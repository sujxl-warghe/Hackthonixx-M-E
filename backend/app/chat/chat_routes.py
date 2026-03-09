from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
import logging
from jose import jwt
from app.config import JWT_SECRET, ALGORITHM
from app.chat.groq_client import ask_groq
from app.rag.retrieval import retrieve_context

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/")
async def chat(request: Request):
    try:
        body = await request.json()

        query = body.get("query") or body.get("message")
        token = body.get("token")

        if not query:
            return JSONResponse(status_code=400, content={"error": "Query/message missing"})

        user = "public"

        # If token provided, validate and extract user; otherwise treat as public/guest
        if token:
            try:
                payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
                user = payload.get("sub", "public")
            except Exception:
                return JSONResponse(status_code=401, content={"error": "Invalid token"})

        context = await retrieve_context(query, user)

        prompt = f"""
Answer ONLY from the context below.

Context:
{context}

Question:
{query}
"""

        answer = ask_groq(prompt)
        return {"answer": answer}
    except Exception as e:
        logging.exception("Error handling /chat request")
        return JSONResponse(status_code=500, content={"error": str(e)})
