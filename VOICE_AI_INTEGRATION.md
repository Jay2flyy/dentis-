# Voice AI Assistant Integration Guide

This guide explains how to set up and deploy the voice assistant integration for your dental practice website.

## Supabase Edge Function Deployment

### 1. Install Supabase CLI
If you haven't already, install the Supabase CLI:

```bash
# For Windows
winget install supabase

# Or using npm
npm install -g supabase
```

### 2. Set up Supabase project
```bash
# Navigate to your project directory
cd dental-practice-automation

# Login to Supabase (if not already logged in)
supabase login

# Link your project
supabase link --project-ref <your-project-ref>
```

### 3. Deploy the Edge Function
```bash
# Deploy the voice assistant function
supabase functions deploy voice-assistant
```

### 4. Set Environment Variables
```bash
# Set your service role key (found in your Supabase dashboard)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

## Voice AI Platform Configuration

You can integrate with multiple voice AI platforms. Here are the configurations for both Vapi.ai and Retell AI.

### Vapi.ai Configuration

#### 1. Create a Vapi Account
- Sign up at [vapi.ai](https://vapi.ai)
- Get your API keys from the dashboard

#### 2. Configure the Assistant
Create a new assistant with the following settings:

**Voice Settings:**
- Name: "Thandi - Dental Assistant"
- Voice: Choose a friendly, professional voice

**Model Configuration:**
- Model: Choose GPT-4 or equivalent
- Temperature: 0.7

**System Prompt:**
```
You are Thandi, a friendly and professional virtual assistant for Makhanda Smiles Dental Practice in Makhanda, South Africa. You speak in an approachable but professional manner. Your primary functions are:

1. Check appointment availability
2. Book new appointments
3. Check patient loyalty points
4. Answer common questions about dental services

For appointments, you need to collect:
- Patient's phone number
- Preferred date and time
- Service type

For loyalty checks, you only need the patient's phone number.

When booking appointments, always verify availability first and confirm with the patient before finalizing.

Our services include:
- Teeth Whitening (R8,000)
- Dental Implants (From R70,000)
- General Dentistry (From R1,600)
- Emergency Care (R3,000)
- Root Canal (R16,000)
- Dental Crown (R24,000)
- Periodontal Treatment (R300)
- Orthodontic Consultation (Free)

Our loyalty program: 10 points for every R100 spent. 1000 points = Free Teeth Whitening, 500 points = Free Fluoride Treatment.
```

#### 3. Add Function Tools
Create three function tools that connect to your Supabase Edge Function:

**Tool 1: Check Availability**
```json
{
  "name": "check_availability",
  "description": "Check if an appointment slot is available",
  "parameters": {
    "type": "object",
    "properties": {
      "appointment_date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format"
      },
      "appointment_time": {
        "type": "string",
        "description": "Time in HH:MM AM/PM format"
      }
    },
    "required": ["appointment_date", "appointment_time"]
  }
}
```

**Tool 2: Get Patient Loyalty**
```json
{
  "name": "get_patient_loyalty",
  "description": "Get patient loyalty information using their phone number",
  "parameters": {
    "type": "object",
    "properties": {
      "patient_phone": {
        "type": "string",
        "description": "Patient's phone number in international format (+27...)"
      }
    },
    "required": ["patient_phone"]
  }
}
```

**Tool 3: Book Appointment**
```json
{
  "name": "book_appointment",
  "description": "Book a new appointment for a patient",
  "parameters": {
    "type": "object",
    "properties": {
      "patient_phone": {
        "type": "string",
        "description": "Patient's phone number in international format (+27...)"
      },
      "appointment_date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format"
      },
      "appointment_time": {
        "type": "string",
        "description": "Time in HH:MM AM/PM format"
      },
      "service_type": {
        "type": "string",
        "description": "Type of dental service"
      }
    },
    "required": ["patient_phone", "appointment_date", "appointment_time", "service_type"]
  }
}
```

**Webhook URL:** Set this to your deployed function URL:
```
https://<your-project-ref>.supabase.co/functions/v/voice-assistant
```

**Configure the Function Tools in Vapi**
In your Vapi assistant configuration, add the three functions as tools and make sure they're set to be used automatically when appropriate.

### Retell AI Configuration

#### 1. Create a Retell AI Account
- Sign up at [retellai.com](https://www.retellai.com)
- Get your API key from the dashboard

#### 2. Create an Agent
- Go to the Agents section
- Create a new agent with the following configuration:

**Agent Settings:**
- Name: "Thandi - Dental Assistant"
- Voice: Choose a friendly, professional voice

**System Prompt:**
```
You are Thandi, a friendly and professional virtual assistant for Makhanda Smiles Dental Practice in Makhanda, South Africa. You speak in an approachable but professional manner. Your primary functions are:

1. Check appointment availability
2. Book new appointments
3. Check patient loyalty points
4. Answer common questions about dental services

For appointments, you need to collect:
- Patient's phone number
- Preferred date and time
- Service type

For loyalty checks, you only need the patient's phone number.

When booking appointments, always verify availability first and confirm with the patient before finalizing.

Our services include:
- Teeth Whitening (R8,000)
- Dental Implants (From R70,000)
- General Dentistry (From R1,600)
- Emergency Care (R3,000)
- Root Canal (R16,000)
- Dental Crown (R24,000)
- Periodontal Treatment (R300)
- Orthodontic Consultation (Free)

Our loyalty program: 10 points for every R100 spent. 1000 points = Free Teeth Whitening, 500 points = Free Fluoride Treatment.
```

#### 3. Deploy the Secure Token Generator

The Retell AI integration uses a Supabase Edge Function to securely generate tokens without exposing your API key to the frontend. This function is already created in `supabase/functions/dynamic-action/index.ts`.

To deploy it:

```bash
supabase functions deploy dynamic-action --no-verify-jwt
```

#### 4. Set Environment Variables

Set your Retell API key and agent ID as Supabase secrets:

```bash
supabase secrets set RETELL_API_KEY="your_retell_api_key_here"
supabase secrets set RETELL_AGENT_ID="your_agent_id_here"
```

#### 5. Update Environment Variables in Your Frontend

Add your Retell AI credentials to your .env.local file:

```env
VITE_RETELL_API_KEY=your_retell_api_key_here
VITE_RETELL_AGENT_ID=your_agent_id_here
```

The RetellVoiceWidget component will use these credentials to connect to your agent through the secure Supabase function.

### 1. Create a Vapi Account
- Sign up at [vapi.ai](https://vapi.ai)
- Get your API keys from the dashboard

### 2. Configure the Assistant
Create a new assistant with the following settings:

**Voice Settings:**
- Name: "Thandi - Dental Assistant"
- Voice: Choose a friendly, professional voice

**Model Configuration:**
- Model: Choose GPT-4 or equivalent
- Temperature: 0.7

**System Prompt:**
```
You are Thandi, a friendly and professional virtual assistant for Makhanda Smiles Dental Practice in Makhanda, South Africa. You speak in an approachable but professional manner. Your primary functions are:

1. Check appointment availability
2. Book new appointments
3. Check patient loyalty points
4. Answer common questions about dental services

For appointments, you need to collect:
- Patient's phone number
- Preferred date and time
- Service type

For loyalty checks, you only need the patient's phone number.

When booking appointments, always verify availability first and confirm with the patient before finalizing.

Our services include:
- Teeth Whitening (R8,000)
- Dental Implants (From R70,000)
- General Dentistry (From R1,600)
- Emergency Care (R3,000)
- Root Canal (R16,000)
- Dental Crown (R24,000)
- Periodontal Treatment (R300)
- Orthodontic Consultation (Free)

Our loyalty program: 10 points for every R100 spent. 1000 points = Free Teeth Whitening, 500 points = Free Fluoride Treatment.
```

### 3. Add Function Tools
Create three function tools that connect to your Supabase Edge Function:

**Tool 1: Check Availability**
```json
{
  "name": "check_availability",
  "description": "Check if an appointment slot is available",
  "parameters": {
    "type": "object",
    "properties": {
      "appointment_date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format"
      },
      "appointment_time": {
        "type": "string",
        "description": "Time in HH:MM AM/PM format"
      }
    },
    "required": ["appointment_date", "appointment_time"]
  }
}
```

**Tool 2: Get Patient Loyalty**
```json
{
  "name": "get_patient_loyalty",
  "description": "Get patient loyalty information using their phone number",
  "parameters": {
    "type": "object",
    "properties": {
      "patient_phone": {
        "type": "string",
        "description": "Patient's phone number in international format (+27...)"
      }
    },
    "required": ["patient_phone"]
  }
}
```

**Tool 3: Book Appointment**
```json
{
  "name": "book_appointment",
  "description": "Book a new appointment for a patient",
  "parameters": {
    "type": "object",
    "properties": {
      "patient_phone": {
        "type": "string",
        "description": "Patient's phone number in international format (+27...)"
      },
      "appointment_date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format"
      },
      "appointment_time": {
        "type": "string",
        "description": "Time in HH:MM AM/PM format"
      },
      "service_type": {
        "type": "string",
        "description": "Type of dental service"
      }
    },
    "required": ["patient_phone", "appointment_date", "appointment_time", "service_type"]
  }
}
```

**Webhook URL:** Set this to your deployed function URL:
```
https://<your-project-ref>.supabase.co/functions/v/voice-assistant
```

### 4. Configure the Function Tools in Vapi
In your Vapi assistant configuration, add the three functions as tools and make sure they're set to be used automatically when appropriate.

## Frontend Integration

The application includes multiple voice assistant options that can work together. Both the Vapi.ai and Retell AI assistants are automatically included in your application via the App.tsx file.

### 1. Add Environment Variables to your .env.local

For Vapi.ai:
```env
VITE_VAPI_PUBLIC_KEY=your_vapi_public_key_here
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here
```

For Retell AI:
```env
VITE_RETELL_API_KEY=your_retell_api_key_here
VITE_RETELL_AGENT_ID=your_retell_agent_id_here
```

### 2. Voice Assistant Components in Your App
Both voice assistant components are already integrated into your App.tsx file:

```tsx
import FreeVoiceAssistant from './components/FreeVoiceAssistant';
import RetellVoiceWidget from './components/RetellVoiceWidget';

// These components are already included in your App.tsx
<FreeVoiceAssistant />
<RetellVoiceWidget />
```

The FreeVoiceAssistant uses browser-based speech recognition, while the RetellVoiceWidget connects to your Retell AI agent through the secure Supabase function.

## Testing the Integration

### For Vapi.ai Integration:
1. Make sure your Supabase Edge Function is deployed
2. Verify your Vapi assistant is configured with the correct tools
3. Add your API keys to the environment variables
4. Start your React app: `npm run dev`
5. Click the floating button and test the voice assistant

### For Retell AI Integration:
1. Deploy the dynamic-action function: `supabase functions deploy dynamic-action --no-verify-jwt`
2. Set your Retell API key and agent ID as Supabase secrets
3. Add your Retell credentials to the environment variables
4. Start your React app: `npm run dev`
5. Click the Retell voice assistant button and test the connection

### For Browser-Based Voice Assistant:
1. Start your React app: `npm run dev`
2. Click the "Sarah" voice assistant button
3. Test the speech recognition and conversation flow

## Troubleshooting

### Common Issues:
1. **Function not responding**: Check that your Supabase Edge Function is deployed and the URL is correct
2. **CORS errors**: The function is configured with CORS headers, but verify your Vapi webhook settings
3. **Authentication errors**: Ensure your SUPABASE_SERVICE_ROLE_KEY is set correctly
4. **Phone number format**: The function handles SA phone number formats, but ensure they're in +27 format when passing to the API

### Testing the Function Directly
You can test the function directly with curl:

```bash
curl -X POST https://<your-project-ref>.supabase.co/functions/v/voice-assistant \
  -H "Content-Type: application/json" \
  -d '{
    "action": "check_availability",
    "appointment_date": "2024-01-15",
    "appointment_time": "10:00 AM"
  }'
```

## Security Notes

- The Edge Function uses the service_role key which bypasses RLS for administrative operations
- Patient data access is still protected by RLS policies
- All requests from the voice assistant platform are allowed via CORS
- Phone numbers are validated for South African format