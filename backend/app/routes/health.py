import logging
from fastapi import APIRouter
from app.config import settings
from app.vector_store import vector_store
from app.document_parser import get_structured_internship_chunks
from app.embeddings import embedding_service
from app.hybrid_retriever import hybrid_retriever

logger = logging.getLogger(__name__)
router = APIRouter(tags=["System"])


@router.get("/health")
def health_check():
    """Health check endpoint for Render and uptime monitors."""
    vector_count = vector_store.count()
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "model": settings.NVIDIA_LLM_MODEL,
        "vector_store_mode": "Qdrant Cloud" if settings.QDRANT_URL else "Embedded (Local/Container)",
        "indexed_chunks": vector_count
    }


@router.get("/api/stats")
def get_stats():
    """Returns knowledge base indexing and configuration statistics."""
    chunks = get_structured_internship_chunks()
    categories = {}
    for c in chunks:
        cat = c.get("category", "other")
        categories[cat] = categories.get(cat, 0) + 1

    return {
        "total_guide_chunks": len(chunks),
        "categories": categories,
        "qdrant_points_indexed": vector_store.count(),
        "embedding_model": settings.NVIDIA_EMBEDDING_MODEL,
        "llm_model": settings.NVIDIA_LLM_MODEL,
        "nvidia_key_configured": bool(settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY.startswith("nvapi-"))
    }


@router.post("/api/seed")
def trigger_seed():
    """Manual trigger to re-index all chunks into Qdrant."""
    chunks = get_structured_internship_chunks()
    texts = [c.get("content", "") for c in chunks]
    embeddings = embedding_service.get_embeddings(texts, input_type="passage")
    vector_store.upsert_chunks(chunks, embeddings)
    hybrid_retriever.initialize_bm25(chunks)
    return {
        "status": "success",
        "message": f"Successfully indexed {len(chunks)} chunks into vector store."
    }
