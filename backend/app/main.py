import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config import settings
from app.routes import chat, health, internships, auth, announcements, career_path, recruiter
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
    1. Parse and load official PM Internship Scheme records.
    2. Initialize BM25 lexical index.
    3. Seed Qdrant vector database with fresh records.
    """
    logger.info("Starting PM Internship Scheme RAG Backend (Disha AI Engine)...")
    try:
        chunks = get_structured_internship_chunks()
        logger.info(f"Loaded {len(chunks)} structured chunks from official PMIS dataset.")

        # Initialize BM25 for hybrid search
        hybrid_retriever.initialize_bm25(chunks)

        # MongoDB & Knowledge Base Status
        from app.db import is_live_mongodb, count_internships_db
        logger.info(f"MongoDB Status: Live={is_live_mongodb()} | Total Internships in MongoDB={count_internships_db()}")

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
    description="Official Hybrid RAG & Career Guidance Backend for PM Internship Scheme",
    version="2.0.0",
    lifespan=lifespan
)

# CORS Middleware configuration
# Explicitly support Vercel production and preview domains, Render backend, and local development
CORS_ALLOWED_ORIGINS = [
    "https://pmintership.vercel.app",
    "https://pmintership2-0.onrender.com",
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8000",
]

env_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip() and origin.strip() != "*"]
for o in env_origins:
    if o not in CORS_ALLOWED_ORIGINS:
        CORS_ALLOWED_ORIGINS.append(o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Exception Handlers ensuring CORS headers on all errors
@app.exception_handler(StarletteHTTPException)
async def custom_http_exception_handler(request: Request, exc: StarletteHTTPException):
    origin = request.headers.get("origin") or "https://pmintership.vercel.app"
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.exception_handler(Exception)
async def custom_global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    origin = request.headers.get("origin") or "https://pmintership.vercel.app"
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "error": str(exc)},
        headers={
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Include routers
app.include_router(health.router)
app.include_router(chat.router)
app.include_router(internships.router)
app.include_router(auth.router)
app.include_router(announcements.router)
app.include_router(career_path.router)
app.include_router(recruiter.router)

# Mount static and CDN folder for candidate resumes
from fastapi.staticfiles import StaticFiles
from pathlib import Path
static_dir = Path(__file__).parent.parent / "static"
static_dir.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")
app.mount("/cdn", StaticFiles(directory=str(static_dir)), name="cdn")


@app.get("/")
def root():
    try:
        from app.db import count_internships_db
        total = count_internships_db()
    except Exception:
        total = 260
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
            "auth_refresh": "POST /api/auth/refresh",
            "auth_me": "GET /api/auth/me",
            "auth_logout": "POST /api/auth/logout",
            "auth_google": "POST /api/auth/google",
            "user_profile": "GET /api/user/profile",
            "user_applications": "GET /api/user/applications",
            "selected_resumes": "GET /api/resumes/selected",
            "stats": "GET /api/stats",
            "total_internships": total
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
