import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const RETELL_API_KEY = "key_5d3efdda34a2abc95c1bc1ca045e"; // Your Secret Key
const AGENT_ID = "agent_f8a06e7f0f02de4dbcc6755001";    // Your Agent ID

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Call Retell API to create a web call
    const response = await fetch("https://api.retellai.com/v2/create-web-call", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RETELL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ agent_id: AGENT_ID }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Failed to create call");

    return new Response(JSON.stringify({ access_token: data.access_token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Error in dynamic-action function:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});