import asyncio
from app.database import documents_collection
from app.rag.embedding import generate_embedding

async def retrieve_context(query: str, user: str):
    try:
        query_vector = await generate_embedding(query)

        pipeline = [
            {
                "$vectorSearch": {
                    "index": "vector_index",
                    "queryVector": query_vector,
                    "path": "embedding",
                    "numCandidates": 100,
                    "limit": 5
                }
            },
            {
                "$match": {"user": user}
            }
        ]

        # Add 5 second timeout for DB query to prevent hanging
        docs = await asyncio.wait_for(
            documents_collection.aggregate(pipeline).to_list(5),
            timeout=5.0
        )
        return " ".join(d["text"] for d in docs)
    except asyncio.TimeoutError:
        # MongoDB not responding - return empty context instead of hanging
        return ""
    except Exception:
        # In local/dev environments the DB or vector index may not be configured.
        # Return empty context instead of crashing the API.
        return ""
