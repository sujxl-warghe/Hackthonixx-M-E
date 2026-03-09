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

        # Route the query: determine if it's general or study/syllabus/database related
        routing_prompt = f"""Analyze the following user message: "{query}"
Is this a general conversational message (e.g., greetings, thanking, asking how you are) or a specific question related to study, syllabus, college admissions, or facts?
Reply ONLY with the word "GENERAL" if it is general conversation, or "STUDY" if it is study/fact-related."""
        
        route = ask_groq(routing_prompt, system_prompt="You are a query classifier.").strip().upper()

        if "GENERAL" in route:
            # Handle as a general chat using Groq directly without retrieval
            system_prompt = "You are a helpful, friendly AI assistant for a college. Answer naturally and concisely."
            answer = ask_groq(query, system_prompt=system_prompt)
            return {"answer": answer}
        
        # If it's STUDY (or by default), retrieve context and answer
        context = await retrieve_context(query, user)

        prompt = f"""
Answer ONLY from the context below. If the answer is not in the context, say you don't know based on the provided information.

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
