import langchain
import langchain_community
import sys

print(f"LangChain version: {langchain.__version__}")
print(f"LangChain location: {langchain.__file__}")
try:
    import langchain.chains
    print("langchain.chains found")
except ImportError as e:
    print(f"langchain.chains NOT found: {e}")

try:
    from langchain.chains import RetrievalQA
    print("RetrievalQA found")
except ImportError as e:
    print(f"RetrievalQA NOT found: {e}")
