from fastapi import APIRouter, UploadFile, File, Form
import fitz
from app.database import documents_collection
from app.rag.embedding import generate_embedding

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), user: str = Form(...)):
    try:
        pdf = fitz.open(stream=await file.read(), filetype="pdf")

        full_text = ""
        for page in pdf:
            full_text += page.get_text()

        chunks = [full_text[i:i+500] for i in range(0, len(full_text), 500)]

        for chunk in chunks:
            embedding = await generate_embedding(chunk)
            await documents_collection.insert_one({
                "user": user,
                "text": chunk,
                "embedding": embedding
            })

        return {"message": "Document indexed successfully"}
    except Exception as e:
        return {"error": f"Upload failed: {str(e)}", "message": "Document upload failed"}
