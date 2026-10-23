import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import chat, health
from app.document_parser import get_structured_internship_chunks
from app.embeddings import embedding_service
from app.vector_store import vector_store
from app.hybrid_retriever import hybrid_retriever

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("pm_internship_backend")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Automatic startup lifecycle:
    1. Parse and load all 28 pages of the IIT Summer Internship Guide.
    2. Initialize BM25 lexical index.
    3. Auto-seed Qdrant vector database if empty (ensures instant zero-config on Render).
    """
    logger.info("Starting PM & IIT Internship RAG Backend...")
    try:
        chunks = get_structured_internship_chunks()
        logger.info(f"Loaded {len(chunks)} structured chunks from guide data.")

        # Initialize BM25 for hybrid search
        hybrid_retriever.initialize_bm25(chunks)

        # Ensure collection exists
        vector_store.ensure_collection(vector_size=1024)

        # Check existing point count
        current_count = vector_store.count()
        logger.info(f"Current Qdrant collection point count: {current_count}")

        if current_count == 0 or current_count < len(chunks):
            logger.info("Auto-indexing knowledge base into Qdrant vector store...")
            texts = [c.get("content", "") for c in chunks]
            embeddings = embedding_service.get_embeddings(texts, input_type="passage")
            vector_store.upsert_chunks(chunks, embeddings)
            logger.info("Auto-indexing complete! RAG system is fully online.")
        else:
            logger.info("Qdrant collection is already populated and ready.")

    except Exception as e:
        logger.error(f"Error during application startup initialization: {e}", exc_info=True)

    yield

    logger.info("Shutting down PM & IIT Internship RAG Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Optimized Hybrid RAG Backend using NVIDIA Nemotron 3.5 Super VL for IIT Internships & Leads Guide 2026",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Middleware configuration
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
if "*" in origins or not origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "chat": "POST /api/chat",
            "chat_stream": "POST /api/chat/stream",
            "stats": "GET /api/stats",
            "seed": "POST /api/seed"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
