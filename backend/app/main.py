from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.auth.auth_routes import router as auth_router
from app.chat.chat_routes import router as chat_router
from app.rag.document_routes import router as doc_router
from app.dashboard.dashboard_routes import router as dashboard_router
import os

app = FastAPI(title="KDK RAG Assistant")

# Build CORS allowed origins
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
    "https://127.0.0.1:3000",
]

# Add ngrok URL if provided via environment variable
ngrok_url = os.getenv("NGROK_URL")
if ngrok_url:
    allowed_origins.append(ngrok_url)

# For development, you can also allow all origins by uncommenting:
# allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(auth_router)
app.include_router(doc_router)
app.include_router(chat_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {"status": "RAG Assistant running"}
