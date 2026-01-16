import { useState, useEffect, useRef } from 'react';
import { VolumeX, Phone, PhoneOff, Send, MessageSquare } from 'lucide-react';
import Vapi from '@vapi-ai/web';
import { supabase } from '../lib/supabase';

// Configuration from environment
const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ELEVENLABS_VOICE = import.meta.env.VITE_ELEVENLABS_VOICE_ID;

interface Message {
  user: string;
  assistant: string;
}

// ============================================================================
// DATABASE TOOLS
// ============================================================================
const tools = {
  checkAvailability: async (date: string, time: string) => {
    console.log(`[CHECK_AVAILABILITY] ${date} at ${time}`);

    const { data, error } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', date)
      .eq('appointment_time', time)
      .neq('status', 'cancelled')
      .single();

    if (error && error.code !== 'PGRST116') {
      return `ERROR: ${error.message}`;
    }

    return data ? "UNAVAILABLE" : "AVAILABLE";
  },

  getAlternativeSlots: async (date: string) => {
    console.log(`[GET_ALTERNATIVES] ${date}`);

    const workingHours = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

    const { data: bookedSlots } = await supabase
      .from('appointments')
      .select('appointment_time')
      .eq('appointment_date', date)
      .neq('status', 'cancelled');

    const booked = bookedSlots?.map(s => s.appointment_time) || [];
    const available = workingHours.filter(time => !booked.includes(time));

    if (available.length === 0) return "No slots available on this date.";
    return `Available times: ${available.join(', ')}`;
  },

  getPatient: async (email: string) => {
    console.log(`[GET_PATIENT] ${email}`);

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error) return "NOT_FOUND";
    return JSON.stringify(data);
  },

  createPatient: async (details: any) => {
    console.log(`[CREATE_PATIENT]`, details);

    const { data, error } = await supabase
      .from('patients')
      .insert({
        full_name: details.name,
        email: details.email.toLowerCase().trim(),
        phone: details.phone,
        insurance_info: details.medicalAid || null
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return "ERROR: Patient already exists";
      return `ERROR: ${error.message}`;
    }

    return `SUCCESS: Patient created (ID: ${data.id})`;
  },

  bookAppointment: async (details: any) => {
    console.log('[BOOK_APPOINTMENT]', details);

    // Double-check availability
    const availCheck = await tools.checkAvailability(details.date, details.time);
    if (availCheck === "UNAVAILABLE") {
      return "FAILED: That slot was just taken. Please suggest another time.";
    }

    const { data: appt, error } = await supabase
      .from('appointments')
      .insert({
        patient_email: details.email.toLowerCase().trim(),
        patient_name: details.name,
        patient_phone: details.phone || '',
        appointment_date: details.date,
        appointment_time: details.time,
        service_type: details.reason || 'General Checkup',
        status: 'confirmed'
      })
      .select()
      .single();

    if (error) return `FAILED: ${error.message}`;

    // Send confirmation emails via API
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'patient_confirmation',
          to: details.email,
          details: {
            name: details.name,
            date: details.date,
            time: details.time,
            service: details.reason || 'General Checkup'
          }
        })
      });

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'doctor_notification',
          notificationType: 'new',
          details: {
            name: details.name,
            email: details.email,
            phone: details.phone,
            date: details.date,
            time: details.time,
            service: details.reason || 'General Checkup'
          }
        })
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return `SUCCESS: Appointment confirmed (ID: ${appt.id}). Confirmation emails have been sent to you and the doctor.`;
  },

  getAppointments: async (email: string) => {
    console.log('[GET_APPOINTMENTS]', email);

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('patient_email', email.toLowerCase().trim())
      .neq('status', 'cancelled')
      .order('appointment_date', { ascending: true });

    if (error) return `ERROR: ${error.message}`;
    if (!data || data.length === 0) return "No upcoming appointments found.";

    return JSON.stringify(data.map(a => ({
      id: a.id,
      date: a.appointment_date,
      time: a.appointment_time,
      service: a.service_type,
      status: a.status
    })));
  },

  rescheduleAppointment: async (details: any) => {
    console.log('[RESCHEDULE]', details);

    // Check new slot availability
    const availCheck = await tools.checkAvailability(details.newDate, details.newTime);
    if (availCheck === "UNAVAILABLE") {
      return "FAILED: New slot is unavailable.";
    }

    // Get old appointment details
    const { data: oldAppt } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', details.appointmentId)
      .single();

    if (!oldAppt) return "FAILED: Appointment not found.";

    // Update appointment
    const { error } = await supabase
      .from('appointments')
      .update({
        appointment_date: details.newDate,
        appointment_time: details.newTime,
        updated_at: new Date().toISOString()
      })
      .eq('id', details.appointmentId);

    if (error) return `FAILED: ${error.message}`;

    // Send reschedule emails
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'patient_reschedule',
          to: oldAppt.patient_email,
          details: {
            name: oldAppt.patient_name,
            newDate: details.newDate,
            newTime: details.newTime,
            oldDate: oldAppt.appointment_date,
            oldTime: oldAppt.appointment_time,
            service: oldAppt.service_type
          }
        })
      });

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'doctor_notification',
          notificationType: 'rescheduled',
          details: {
            name: oldAppt.patient_name,
            email: oldAppt.patient_email,
            phone: oldAppt.patient_phone,
            newDate: details.newDate,
            newTime: details.newTime,
            oldDate: oldAppt.appointment_date,
            oldTime: oldAppt.appointment_time,
            service: oldAppt.service_type
          }
        })
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    return "SUCCESS: Appointment rescheduled. Confirmation emails sent.";
  },

  cancelAppointment: async (id: string) => {
    console.log('[CANCEL]', id);

    const { error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', id);

    if (error) return `FAILED: ${error.message}`;
    return "SUCCESS: Appointment cancelled.";
  },

  getLoyaltyPoints: async (email: string) => {
    console.log('[GET_LOYALTY]', email);
    const { data: patient } = await supabase.from('patients').select('id, full_name').eq('email', email.toLowerCase().trim()).single();
    if (!patient) return "ERROR: Patient not found.";

    const { data, error } = await supabase.from('loyalty_points').select('*').eq('patient_id', patient.id).single();
    if (error) return "No loyalty points record found for this patient.";

    return `Patient ${patient.full_name} has ${data.points_balance} points. Tier: ${data.tier_level}. Lifetime points: ${data.lifetime_points}.`;
  }
};

// ============================================================================
// AI BRAIN (Enhanced Gemini with Personality)
// ============================================================================
const callGeminiAI = async (messages: any[], userEmail: string) => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[now.getDay()];

  const systemPrompt = `You are Thandi, the warm, intelligent, and slightly witty virtual office manager at Makhanda Smiles dental practice in Grahamstown, South Africa.

## YOUR PERSONALITY
- Warm and professional with a touch of South African charm
- Patient, empathetic, and genuinely caring
- Occasionally uses light humor to put patients at ease (but knows when to be serious)
- Uses South African English and local context
- Makes patients feel heard and valued
- Has a conversational, natural style (not robotic!)
- Can have basic conversations about the weather, sports, life, etc.
- Shows genuine interest in patients as people, not just appointment slots

## TODAY'S INFO
Date: ${now.toLocaleDateString('en-ZA')} (${currentDay})
Time: ${now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
${userEmail ? `Current User Email: ${userEmail}` : 'User email not captured yet'}

## CORE RULES
1. **ALWAYS USE TOOLS** - Never hallucinate data. Use tools for ANY database operation.
2. **TOOL FORMAT**: [TOOL_NAME: {"param": "value"}] or [TOOL_NAME: "simple_param"]
3. **BE CONVERSATIONAL** - Chat naturally, ask follow-up questions, show empathy
4. **COLLECT INFO GRADUALLY** - Don't ask for everything at once
5. **CONFIRM BEFORE ACTING** - Always confirm details before booking/rescheduling
6. **BE HUMAN** - Small talk is okay! Build rapport before diving into business.

## AVAILABLE TOOLS
[CHECK_AVAILABILITY: {"date": "YYYY-MM-DD", "time": "HH:MM"}]
[GET_ALTERNATIVES: "YYYY-MM-DD"]
[GET_PATIENT: "email@example.com"]
[GET_LOYALTY: "email@example.com"]
[CREATE_PATIENT: {"name": "Full Name", "email": "email@example.com", "phone": "0123456789", "medicalAid": "Discovery"}]
[BOOK: {"name": "...", "email": "...", "phone": "...", "date": "YYYY-MM-DD", "time": "HH:MM", "reason": "..."}]
[GET_APPOINTMENTS: "email@example.com"]
[RESCHEDULE: {"appointmentId": "uuid", "newDate": "YYYY-MM-DD", "newTime": "HH:MM"}]
[CANCEL: "appointment_uuid"]

## CONVERSATION EXAMPLES

User: "Hi"
You: "Hello! 😊 I'm Thandi, your virtual assistant at Makhanda Smiles. How's your day going so far? Is there anything I can help you with?"

User: "Good thanks, just need to book a dentist"
You: "Ah wonderful! Always happy to help with that. Have you been to Makhanda Smiles before, or will this be your first visit with us?"

User: "I need a dentist urgently my tooth is killing me"
You: "Oh no, I'm so sorry to hear that! 😟 Toothaches are absolutely no fun. Let me see what I can do to get you in as soon as possible. What type of pain are you experiencing - sharp, dull, throbbing? This helps me prioritize your appointment."

User: "When is my next appointment?"
You: "I can absolutely check that for you! To pull up your appointment, I'll need your email address. What email did you use when you booked with us?"

User: "How are you?"
You: "Aw, thanks for asking! 😊 I'm doing great - helping lovely people like yourself makes my day! How are you doing? Everything going well on your side?"

User: "What's the weather like?"
You: "Haha, well I'm stuck inside this computer so I can't actually look outside! 😄 But I can tell you it's ${currentDay} afternoon in Grahamstown. Are you planning to come by for an appointment? I can help you book one!"

## WORKING HOURS
Monday - Friday: 08:00 - 17:00
Saturday: 09:00 - 13:00
Sunday: Closed
Lunch: 13:00 - 14:00 (no appointments)

## COMMON SERVICES
- General Checkup (30 min)
- Cleaning (45 min)
- Filling (1 hour)
- Root Canal (1.5 hours)
- Extraction (1 hour)
- Emergency (30 min)

## LOYALTY PROGRAM
- Bronze: 0-499 points
- Silver: 500-999 points (10% discount)
- Gold: 1000-1999 points (15% discount)
- Platinum: 2000+ points (20% discount)
- Patients earn points for every visit and referral!

Remember: You're not just a booking bot - you're a friendly, helpful person who happens to work at a dental practice. Build rapport, show empathy, and make every interaction feel personal and warm. Be Thandi! 🦷✨`;

  const contents = messages.map((m: any) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemPrompt }] },
          generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 1024
          }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini Error: ${response.status}`);

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Oops! My brain just froze for a moment. Could you repeat that? 😅";
  } catch (error) {
    console.error('Gemini Error:', error);
    return "I'm having a bit of a moment here... Give me a second to reboot! 🤖";
  }
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const ThandiVoiceAssistant = () => {
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);

  const vapiRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory]);

  // Greeting on open
  useEffect(() => {
    if (!isMinimized && !hasGreeted) {
      setConversationHistory([{
        user: '',
        assistant: "Hey there! 👋 I'm Thandi, your friendly virtual assistant at Makhanda Smiles. How's your day going? Anything I can help you with today?"
      }]);
      setHasGreeted(true);
    }
  }, [isMinimized, hasGreeted]);

  // Check for existing user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });
  }, []);

  // Handle user input
  const handleUserInput = async (userText: string) => {
    if (!userText.trim()) return;

    // Extract email if provided
    const emailMatch = userText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) setUserEmail(emailMatch[0].toLowerCase());

    // Add user message
    setConversationHistory(prev => [...prev, { user: userText, assistant: '...' }]);

    try {
      // Build conversation context
      let turnMessages = conversationHistory
        .filter(h => h.assistant !== '...')
        .flatMap(h => [
          { role: 'user', content: h.user },
          { role: 'assistant', content: h.assistant }
        ]);

      turnMessages.push({ role: 'user', content: userText });

      // Get AI response
      let aiResponse = await callGeminiAI(turnMessages, userEmail);

      // Tool execution loop (max 5 iterations to prevent infinite loops)
      for (let attempt = 0; attempt < 5; attempt++) {
        const toolMatch = aiResponse.match(/\[(CHECK_AVAILABILITY|GET_ALTERNATIVES|GET_PATIENT|CREATE_PATIENT|BOOK|GET_APPOINTMENTS|RESCHEDULE|CANCEL):\s*(.+?)\]/i);

        if (!toolMatch) break;

        const [, toolName, paramsRaw] = toolMatch;
        console.log(`%c TOOL: ${toolName} `, 'background:#8b5cf6;color:white', paramsRaw);

        let params: any;
        try {
          const cleaned = paramsRaw.trim().replace(/^[`"']+|[`"']+$/g, '');
          params = cleaned.startsWith('{') ? JSON.parse(cleaned) : cleaned.replace(/^"|"$/g, '');
        } catch {
          params = paramsRaw.trim().replace(/^"|"$/g, '');
        }

        let toolResult = '';

        switch (toolName) {
          case 'CHECK_AVAILABILITY':
            toolResult = await tools.checkAvailability(params.date, params.time);
            break;
          case 'GET_ALTERNATIVES':
            toolResult = await tools.getAlternativeSlots(params);
            break;
          case 'GET_PATIENT':
            toolResult = await tools.getPatient(params);
            break;
          case 'CREATE_PATIENT':
            toolResult = await tools.createPatient(params);
            break;
          case 'BOOK':
            toolResult = await tools.bookAppointment(params);
            break;
          case 'GET_APPOINTMENTS':
            toolResult = await tools.getAppointments(params);
            break;
          case 'RESCHEDULE':
            toolResult = await tools.rescheduleAppointment(params);
            break;
          case 'CANCEL':
            toolResult = await tools.cancelAppointment(params);
            break;
          case 'GET_LOYALTY':
            toolResult = await tools.getLoyaltyPoints(params);
            break;
        }

        console.log(`%c RESULT `, 'background:#10b981;color:white', toolResult);

        // Feed result back to AI
        turnMessages.push({ role: 'assistant', content: aiResponse });
        turnMessages.push({
          role: 'user',
          content: `[TOOL_RESULT]: ${toolResult}\n\nContinue the conversation naturally based on this result. Don't repeat the tool call or mention technical details.`
        });

        aiResponse = await callGeminiAI(turnMessages, userEmail);
      }

      // Store conversation in database for analytics
      try {
        await supabase.from('conversations').insert({
          patient_email: userEmail || null,
          session_id: `session-${Date.now()}`,
          message_role: 'user',
          message_content: userText,
          created_at: new Date().toISOString()
        });

        await supabase.from('conversations').insert({
          patient_email: userEmail || null,
          session_id: `session-${Date.now()}`,
          message_role: 'assistant',
          message_content: aiResponse,
          created_at: new Date().toISOString()
        });
      } catch (dbError) {
        console.error('Failed to log conversation:', dbError);
      }

      // Update conversation
      setConversationHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].assistant = aiResponse;
        return updated;
      });

      // Speak if call is active
      if (isCallActive && vapiRef.current) {
        vapiRef.current.send({
          type: 'add-message',
          message: { role: 'assistant', content: aiResponse }
        });
      }

    } catch (error) {
      console.error('Chat Error:', error);
      setConversationHistory(prev => {
        const updated = [...prev];
        updated[updated.length - 1].assistant = "Oops! Something went wrong on my end. Mind trying that again? 😅";
        return updated;
      });
    }
  };

  // Vapi setup for voice calls
  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) {
      console.warn('VAPI_PUBLIC_KEY is not defined. Voice features will be disabled.');
      return;
    }

    try {
      const VapiClass = (Vapi as any).default || Vapi;
      vapiRef.current = new VapiClass(VAPI_PUBLIC_KEY);
      const vapi = vapiRef.current;

      vapi.on('call-start', () => {
        setIsCallActive(true);
        console.log('📞 Call started');
      });

      vapi.on('call-end', () => {
        setIsCallActive(false);
        console.log('📞 Call ended');
      });

      vapi.on('speech-start', () => setIsSpeaking(true));
      vapi.on('speech-end', () => setIsSpeaking(false));

      vapi.on('message', (message: any) => {
        if (message.type === 'transcript' && message.transcriptType === 'final' && message.role === 'user') {
          handleUserInput(message.transcript);
        }
      });

      return () => {
        vapi.stop();
      };
    } catch (error) {
      console.error('Failed to initialize Vapi:', error);
    }
  }, []);

  const startVoiceCall = async () => {
    try {
      await vapiRef.current.start({
        assistant: {
          name: "Thandi",
          firstMessage: "Hello! This is Thandi from Makhanda Smiles. How can I help you today?",
          model: {
            provider: "openai",
            model: "gpt-3.5-turbo",
            messages: [{
              role: "system",
              content: "You are Thandi's hearing module. DO NOT RESPOND TO THE USER. Your only job is to listen and let the system handle responses. Stay completely silent."
            }]
          },
          voice: {
            provider: "elevenlabs",
            voiceId: ELEVENLABS_VOICE
          }
        }
      });
      setIsMinimized(false);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const endVoiceCall = () => {
    vapiRef.current.stop();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {!isMinimized && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-4 duration-300 max-h-[85vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Thandi AI</h3>
                <p className="text-xs text-blue-100 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-1.5 ${isCallActive ? 'bg-green-400 animate-pulse' : 'bg-blue-300'}`}></span>
                  {isCallActive ? isSpeaking ? 'Speaking...' : 'Listening...' : 'Online'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
              aria-label="Minimize"
            >
              <VolumeX size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 max-h-[500px]">
            {conversationHistory.map((chat, idx) => (
              <div key={idx} className="space-y-2">
                {chat.user && (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-sm max-w-[85%] shadow-sm">
                      {chat.user}
                    </div>
                  </div>
                )}
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-3 text-sm max-w-[85%] shadow-sm border border-gray-100">
                    {chat.assistant === '...' ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-bounce">●</span>
                        <span className="animate-bounce" style={{ animationDelay: '200ms' }}>●</span>
                        <span className="animate-bounce" style={{ animationDelay: '400ms' }}>●</span>
                      </span>
                    ) : (
                      chat.assistant
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl px-2 py-1">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && currentMessage.trim()) {
                    handleUserInput(currentMessage);
                    setCurrentMessage('');
                  }
                }}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border-none text-sm p-2 outline-none"
              />
              <button
                onClick={() => {
                  if (currentMessage.trim()) {
                    handleUserInput(currentMessage);
                    setCurrentMessage('');
                  }
                }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Voice Call Buttons */}
            <div className="mt-3 flex space-x-2">
              <button
                onClick={isCallActive ? endVoiceCall : startVoiceCall}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center space-x-2 transition ${isCallActive
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
              >
                {isCallActive ? (
                  <>
                    <PhoneOff size={14} />
                    <span>End Call</span>
                  </>
                ) : (
                  <>
                    <Phone size={14} />
                    <span>Start Voice Call</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsMinimized(!isMinimized)}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-200"
        aria-label={isMinimized ? 'Open chat' : 'Close chat'}
      >
        {isMinimized ? <MessageSquare size={28} /> : <VolumeX size={28} />}
      </button>
    </div>
  );
};

export default ThandiVoiceAssistant;
