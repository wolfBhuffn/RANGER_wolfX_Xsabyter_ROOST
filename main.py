import os
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from github import Github, Auth, GithubIntegration

load_dotenv()

app = FastAPI(title="RANGER Command Center API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Environment variables
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GITHUB_APP_ID = os.getenv("GITHUB_APP_ID")
GITHUB_WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "")

# Locate private key (Render mounts secret files in /etc/secrets/ by default)
PRIVATE_KEY_PATH = "/etc/secrets/github-private-key.pem"
if not os.path.exists(PRIVATE_KEY_PATH):
    PRIVATE_KEY_PATH = "github-private-key.pem"  # Fallback for local testing

private_key_exists = os.path.exists(PRIVATE_KEY_PATH)

@app.get("/")
def read_root():
    return {"status": "online", "system": "RANGER_wolfX_Xsabyter_ROOST Backend"}

@app.get("/health")
def health_check():
    """Diagnostic health check to verify all credentials and secret files are loaded."""
    return {
        "status": "ok",
        "gemini_key": "Configured" if GEMINI_API_KEY else "Missing",
        "github_app_id": "Configured" if GITHUB_APP_ID else "Missing",
        "github_webhook_secret": "Configured" if GITHUB_WEBHOOK_SECRET else "Missing",
        "github_private_key_file": "Found" if private_key_exists else "Missing",
        "message": "Keep-alive active"
    }

@app.post("/github-webhook")
async def github_webhook(request: Request):
    event = request.headers.get("X-GitHub-Event")
    payload = await request.json()
    
    if event == "push":
        repo_name = payload.get("repository", {}).get("full_name")
        return {"status": "received", "event": event, "repo": repo_name}
        
    return {"status": "ignored", "event": event}