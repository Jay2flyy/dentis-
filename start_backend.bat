@echo off
echo Starting Dental Chatbot Backend...
cd backend
python -m uvicorn app:app --host 0.0.0.0 --port 3001 --reload
pause
