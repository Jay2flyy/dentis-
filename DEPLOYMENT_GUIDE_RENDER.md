# 🚀 Render Deployment Guide (Manual Step Required)

I have prepared your code and pushed it to GitHub, but I could not trigger the deployment automatically because the **Render MCP tool does not support the Free Plan**.

## ✅ What I Have Done For You
1.  **Updated Code**: Fixed `backend/requirements.txt` and added a health check to `backend/app.py`.
2.  **Pushed to GitHub**: Your latest code is live at `https://github.com/Jay2flyy/dentis-`.
3.  **Selected Workspace**: I verified we are working with `young's workspace`.

## 🛠️ Your Next Steps (Takes 2 Minutes)

1.  **Open Render Dashboard**: [https://dashboard.render.com/web/new](https://dashboard.render.com/web/new)
2.  **Connect GitHub**: Select the repository **`Jay2flyy/dentis-`**.
3.  **Configure Service**:
    *   **Name**: `dental-chatbot-api`
    *   **Language**: `Python 3`
    *   **Root Directory**: (Leave blank or `.`)
    *   **Build Command**: `pip install -r backend/requirements.txt`
    *   **Start Command**: `cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker app:app --bind 0.0.0.0:$PORT`
    *   **Instance Type**: Select **Free**.

4.  **Environment Variables**:
    Click "Add Environment Variable" for each of these keys.

    | Key | Value |
    | :--- | :--- |
    | `PYTHON_VERSION` | `3.10.0` |
    | `GOOGLE_API_KEY` | `AIzaSyC3mYk5e0DJmInctW8UtdRE7WqmHlgTPac` |
    | `SUPABASE_URL` | `https://dmykngeptzepsdiypauu.supabase.co` |
    | `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteWtuZ2VwdHplcHNkaXlwYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3Mzc0MiwiZXhwIjoyMDgxNzQ5NzQyfQ.fsV7wiqjDEoAsa1BolE5pr5v2yRpYesVJMmS1VPjbm4` |
    | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteWtuZ2VwdHplcHNkaXlwYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzM3NDIsImV4cCI6MjA4MTc0OTc0Mn0.k-kLaqHXbBcvNY_HSU8RRwWKhOlR5icrqzBhDoSNymw` |

5.  **Click "Create Web Service"**.

Once deployed, copy the **Production URL** (e.g., `https://dental-chatbot-api.onrender.com`) and update your Vercel frontend or `app.py` CORS config if needed.
