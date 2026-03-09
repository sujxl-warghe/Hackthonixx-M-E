from groq import Groq
from app.config import GROQ_API_KEY


# Graceful local fallback when GROQ_API_KEY isn't provided or request fails
def ask_groq(prompt: str):
    if not GROQ_API_KEY:
        return "[Local dev] GROQ API key not configured. Skipping model call."

    try:
        client = Groq(api_key=GROQ_API_KEY, timeout=30.0)  # 30s timeout to fail fast
        res = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "You are a helpful RAG assistant for college admissions"},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,  # Limit response length for faster generation
            temperature=0.7  # Balanced quality vs speed
        )
        return res.choices[0].message.content
    except Exception as e:
        return f"[Groq error] {str(e)}"
