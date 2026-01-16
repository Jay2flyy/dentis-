# PowerShell script to set up Thandi AI voice assistant in Supabase

Write-Host "Setting up Thandi AI Voice Assistant..." -ForegroundColor Green

# Set the SIM API key as a Supabase secret
Write-Host "Setting SIM_API_KEY secret..." -ForegroundColor Yellow
supabase secrets set SIM_API_KEY="sk-sim-T4NmSu3VOxZOWwv2tA6bbJc-KTu46rrp"

# Deploy the voice-assistant function
Write-Host "Deploying voice-assistant function..." -ForegroundColor Yellow
supabase functions deploy voice-assistant

Write-Host "Thandi AI Voice Assistant setup complete!" -ForegroundColor Green
Write-Host "Remember to add your API keys to your .env.local file:" -ForegroundColor Cyan
Write-Host "VITE_SIM_API_KEY=your_sim_api_key" -ForegroundColor White
Write-Host "VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key" -ForegroundColor White
Write-Host "VITE_ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id" -ForegroundColor White