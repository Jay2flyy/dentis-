#!/bin/bash

# Bash script to set up Thandi AI voice assistant in Supabase

echo "Setting up Thandi AI Voice Assistant..." >&2

# Set the SIM API key as a Supabase secret
echo "Setting SIM_API_KEY secret..." >&2
supabase secrets set SIM_API_KEY="sk-sim-T4NmSu3VOxZOWwv2tA6bbJc-KTu46rrp"

# Deploy the voice-assistant function
echo "Deploying voice-assistant function..." >&2
supabase functions deploy voice-assistant

echo "Thandi AI Voice Assistant setup complete!" >&2
echo "Remember to add your API keys to your .env.local file:" >&2
echo "VITE_SIM_API_KEY=your_sim_api_key" >&2
echo "VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key" >&2
echo "VITE_ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id" >&2