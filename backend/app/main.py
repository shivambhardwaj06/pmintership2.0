import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import chat, health, internships, auth
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
    1. Parse and load all 120 official PM Internship Scheme records.
    2. Initialize BM25 lexical index.
    3. Seed Qdrant vector database with fresh records.
    """
    logger.info("Starting PM Internship Scheme RAG Backend (Disha AI Engine)...")
    try:
        chunks = get_structured_internship_chunks()
        logger.info(f"Loaded {len(chunks)} structured chunks from official PMIS dataset.")

        # Initialize BM25 for hybrid search
        hybrid_retriever.initialize_bm25(chunks)

        # Ensure collection exists
        vector_store.ensure_collection(vector_size=1024)

        # Seed knowledge base
        texts = [c.get("content", "") for c in chunks]
        embeddings = embedding_service.get_embeddings(texts, input_type="passage")
        vector_store.upsert_chunks(chunks, embeddings)
        logger.info(f"Vector indexing complete! {len(chunks)} points indexed into Qdrant.")

    except Exception as e:
        logger.error(f"Error during application startup initialization: {e}", exc_info=True)

    yield

    logger.info("Shutting down PM Internship Scheme Backend...")


app = FastAPI(
    title="PM Internship Scheme (PMIS) Disha AI Backend",
    description="Official Hybrid RAG & Career Guidance Backend for PM Internship Scheme 120 Records",
    version="2.0.0",
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
app.include_router(internships.router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "status": "online",
        "service": "PM Internship Scheme Disha AI Backend",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "chat": "POST /api/chat",
            "chat_stream": "POST /api/chat/stream",
            "internships": "GET /api/internships",
            "auth_register": "POST /api/auth/register",
            "auth_login": "POST /api/auth/login",
            "auth_google": "POST /api/auth/google",
            "user_profile": "GET /api/user/profile",
            "user_applications": "GET /api/user/applications",
            "selected_resumes": "GET /api/resumes/selected",
            "stats": "GET /api/stats"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
