import os
from dotenv import load_dotenv
from supabase.client import create_client
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import SupabaseVectorStore
from langchain_core.documents import Document

load_dotenv()

# Common SA Dental Knowledge
dental_data = [
    "Working Hours: Mon-Fri 08:00 - 17:00. Sat 09:00 - 13:00. Closed on Public Holidays.",
    "Pricing: Consultation R550. Basic Cleaning R750. Fillings start from R900. Extractions from R800.",
    "Services: Routine check-ups, teeth whitening, root canals, crowns, and emergency pain management.",
    "Medical Aids: We accept Discovery, Bonitas, and Momentum. Private patients must settle on the day.",
    "Location: We are based in Sandton, Johannesburg, near the Gautrain station."
]

docs = [Document(page_content=x) for x in dental_data]

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

vector_store = SupabaseVectorStore.from_documents(
    docs, 
    embeddings, 
    client=supabase, 
    table_name="dental_reception_kb",     # Matches your new SQL table
    query_name="match_dental_docs"        # Matches your new SQL function
)
print("Dental knowledge base updated in Supabase!")
