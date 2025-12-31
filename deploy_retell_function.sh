#!/bin/bash

# Deploy the Retell AI token generator function to Supabase
echo "Deploying Retell AI token generator function..."

# Deploy the function
supabase functions deploy dynamic-action --no-verify-jwt

echo "Function deployed successfully!"
echo "URL: https://dmykngeptzepsdiypauu.supabase.co/functions/v1/dynamic-action"

# Set the environment variables in Supabase
echo "Setting environment variables in Supabase..."
supabase secrets set RETELL_API_KEY="key_5d3efdda34a2abc95c1bc1ca045e"
supabase secrets set RETELL_AGENT_ID="agent_f8a06e7f0f02de4dbcc6755001"

echo "Environment variables set successfully!"
echo "Deployment complete!"