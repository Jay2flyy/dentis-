# Anvil.works Migration Guide

This guide allows you to move your dental chatbot backend to Anvil.works, eliminating the need for Docker, Render, or manual server management.

## 1. Create Your Anvil App
1.  Go to [anvil.works](https://anvil.works) and create a new **Blank App**.
2.  Select **Material Design 3** (or any theme, it doesn't matter since we are just using the backend).

## 2. Install Python Packages
1.  In the Anvil Editor, click on the **Settings** (gear icon) in the sidebar.
2.  Go to **Python Versions**.
3.  Ensure usage of the **Python 3.10 (Beta)** or Standard Python 3 environment.
4.  Under **Python Packages**, add the following (search and add):
    *   `langchain`
    *   `langchain-google-genai`
    *   `langchain-community`
    *   `supabase`

## 3. Set Up Secrets (Environment Variables)
1.  In the sidebar, look for **App Secrets** (or add the Service if not there).
2.  Add the following secrets (keys) and paste the values provided below:

| Secret Name | Value |
| :--- | :--- |
| `GOOGLE_API_KEY` | `AIzaSyC3mYk5e0DJmInctW8UtdRE7WqmHlgTPac` |
| `SUPABASE_URL` | `https://dmykngeptzepsdiypauu.supabase.co` |
| `SUPABASE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteWtuZ2VwdHplcHNkaXlwYXV1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjE3Mzc0MiwiZXhwIjoyMDgxNzQ5NzQyfQ.fsV7wiqjDEoAsa1BolE5pr5v2yRpYesVJMmS1VPjbm4` |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRteWtuZ2VwdHplcHNkaXlwYXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzM3NDIsImV4cCI6MjA4MTc0OTc0Mn0.k-kLaqHXbBcvNY_HSU8RRwWKhOlR5icrqzBhDoSNymw` |

> **Note:** The `SUPABASE_KEY` specifically uses your **Service Role Secret Key** for full backend access.

## 4. The Server Code (Copy & Paste)
1.  In the specific **Server Code** section (ServerModule1), delete everything and paste this:

```python
import anvil.server
import anvil.secrets
import anvil.http
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import create_client

# 1. Initialize Supabase & Gemini using Anvil Secrets
supabase_url = anvil.secrets.get_secret("SUPABASE_URL")
supabase_key = anvil.secrets.get_secret("SUPABASE_KEY")
google_api_key = anvil.secrets.get_secret("GOOGLE_API_KEY")

# We use the Service Role key (SUPABASE_KEY) for the backend
supabase = create_client(supabase_url, supabase_key)

# 2. Setup Embeddings and LLM
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=google_api_key
)

# Connect to the existing Knowledge Base in Supabase
vector_store = SupabaseVectorStore(
    client=supabase,
    embedding=embeddings,
    table_name="dental_reception_kb",
    query_name="match_dental_docs"
)

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    google_api_key=google_api_key
)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm, 
    chain_type="stuff", 
    retriever=vector_store.as_retriever()
)

# 3. Define the HTTP Endpoint
# The enable_cors=True argument allows your Vercel site to talk to this endpoint
@anvil.server.http_endpoint("/chat", methods=["POST"], enable_cors=True)
def chat_endpoint(**kwargs):
    # Anvil automatically parses JSON bodies if content-type is json
    data = anvil.server.request.body_json
    
    if not data or "message" not in data:
        return anvil.server.HttpResponse(400, "Missing 'message' field")

    user_message = data.get("message")
    
    try:
        # Run the LangChain logic
        response = qa_chain.invoke(user_message)
        return {"reply": response["result"]}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e), "reply": "I apologize, I'm having trouble right now."}
```

## 5. Get Your API URL
1.  After pasting the code, look at the top right of the Code Editor for the **"Run"** button to start the app (or publish it).
2.  Click **Publish** > **Publish this app**.
3.  You will get a URL like `https://funny-random-name.anvil.app/_/api/chat`.
4.  **Important**: Your endpoint is that URL + `/chat`.
    *   Example: `https://funny-random-name.anvil.app/_/api/chat`

## 6. Update Your Frontend
Go to `src/components/DentalChatbot.tsx` in your VS Code and replace the backend URL with your new Anvil URL.
