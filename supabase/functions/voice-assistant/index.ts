import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Thandi API constants
const THANDI_API = 'https://www.sim.ai/api/workflows/a6d74fb4-8fe4-4c4b-a34a-422a00fda095/execute';
const SIM_API_KEY = Deno.env.get("SIM_API_KEY") || 'sk-sim-T4NmSu3VOxZOWwv2tA6bbJc-KTu46rrp';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      });
    }

    // Parse the request body
    const body = await req.json();
    const { input, conversationId, userEmail } = body;

    // Validate required fields
    if (!input) {
      return new Response(JSON.stringify({ error: 'Input is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Call Thandi API
    const thandiResponse = await fetch(THANDI_API, {
      method: 'POST',
      headers: {
        'X-API-Key': SIM_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input,
        conversationId: conversationId || 'default-conversation',
        userEmail: userEmail || 'anonymous@example.com'
      })
    });

    if (!thandiResponse.ok) {
      throw new Error(`Thandi API error: ${thandiResponse.status} ${thandiResponse.statusText}`);
    }

    const thandiData = await thandiResponse.json();

    // Return Thandi's response
    return new Response(JSON.stringify({ 
      success: true,
      output: thandiData.output || 'I apologize, but I could not process your request at this time.',
      conversationId: conversationId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error in voice-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});