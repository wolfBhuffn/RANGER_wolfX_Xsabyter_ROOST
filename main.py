import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load local .env file if present
load_dotenv()

app = FastAPI(title="RANGER Command Center API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

@app.get("/")
def read_root():
    return {"status": "online", "system": "RANGER_wolfX_Xsabyter_ROOST Backend"}

@app.get("/health")
def health_check():
    key_status = "Configured" if GEMINI_API_KEY else "Missing"
    return {
        "status": "ok",
        "gemini_key": key_status,
        "message": "Keep-alive active"
    }
