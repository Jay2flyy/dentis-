# Deploy the Retell AI token generator function to Supabase
Write-Host "Deploying Retell AI token generator function..." -ForegroundColor Green

# Deploy the function
supabase functions deploy dynamic-action --no-verify-jwt

Write-Host "Function deployed successfully!" -ForegroundColor Green
Write-Host "URL: https://dmykngeptzepsdiypauu.supabase.co/functions/v1/dynamic-action" -ForegroundColor Cyan

# Set the environment variables in Supabase
Write-Host "Setting environment variables in Supabase..." -ForegroundColor Green
supabase secrets set RETELL_API_KEY="key_5d3efdda34a2abc95c1bc1ca045e"
supabase secrets set RETELL_AGENT_ID="agent_f8a06e7f0f02de4dbcc6755001"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green