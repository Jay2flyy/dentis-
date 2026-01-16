import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import SupabaseVectorStore
from supabase.client import create_client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "online"}

# --- PRODUCTION CORS SETUP ---
# For development we allow localhost, for production this should be restricted
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, replace "*" with your specific domain e.g. ["https://www.yourdentist.co.za", "http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase & Gemini
# Ensure you have SUPABASE_URL and SUPABASE_KEY in your .env file
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

vector_store = SupabaseVectorStore(
    client=supabase, 
    embedding=embeddings, 
    table_name="dental_reception_kb", 
    query_name="match_dental_docs"
)

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.2)
qa_chain = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vector_store.as_retriever())

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = qa_chain.invoke(request.message)
        return {"reply": response["result"]}
    except Exception as e:
        print(f"Error processing request: {e}")
        return {"error": str(e), "reply": "I apologize, I'm having trouble retrieving that information right now. Please call the office directly."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
