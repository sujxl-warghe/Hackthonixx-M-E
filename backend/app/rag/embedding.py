import asyncio
from concurrent.futures import ThreadPoolExecutor
from sentence_transformers import SentenceTransformer

# ThreadPoolExecutor to avoid blocking the event loop during embedding generation
_executor = ThreadPoolExecutor(max_workers=2)
_model = None

def _load_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model

async def generate_embedding(text: str):
    """Generate embedding asynchronously without blocking the event loop."""
    loop = asyncio.get_running_loop()
    model = await loop.run_in_executor(_executor, _load_model)
    vec = await loop.run_in_executor(_executor, lambda: model.encode(text))
    return vec.tolist()
