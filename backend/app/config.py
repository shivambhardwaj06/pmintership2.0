import os
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from both backend directory and root directory
_BACKEND_DIR = Path(__file__).resolve().parent.parent
if (_BACKEND_DIR / ".env").exists():
    load_dotenv(_BACKEND_DIR / ".env")
if (_BACKEND_DIR.parent / ".env").exists():
    load_dotenv(_BACKEND_DIR.parent / ".env")


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "PM Internship Scheme (PMIS) Disha AI & RAG Backend"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    # AI LLM Engine Configuration
    NVIDIA_API_KEY: Optional[str] = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    NVIDIA_LLM_MODEL: str = os.getenv("NVIDIA_LLM_MODEL", "nvidia/nemotron-3.5-super-vl-120b-a12b")
    NVIDIA_EMBEDDING_MODEL: str = os.getenv("NVIDIA_EMBEDDING_MODEL", "nvidia/llama-3.2-nv-embedqa-1b-v1")

    # Qdrant Vector Database
    QDRANT_URL: Optional[str] = os.getenv("QDRANT_URL", None)
    QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY", None)
    QDRANT_COLLECTION_NAME: str = os.getenv("QDRANT_COLLECTION_NAME", "pmis_internships_120_kb")
    QDRANT_LOCAL_PATH: str = os.getenv("QDRANT_LOCAL_PATH", "./qdrant_storage")

    # Cloudinary configuration for dynamic Resume Storage
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET", "")

    # MongoDB Database Settings
    MONGODB_URI: str = os.getenv("MONGODB_URI", os.getenv("MONGO_URI", "mongodb://localhost:27017"))
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "pmis_db")

    # JWT Authentication & Session Security
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "pmis_jwt_secret_key_super_secure_2026_dev_prod")
    JWT_REFRESH_SECRET_KEY: str = os.getenv("JWT_REFRESH_SECRET_KEY", "pmis_jwt_refresh_secret_key_super_secure_2026_dev_prod")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: Optional[str] = (
        os.getenv("GOOGLE_CLIENT_ID", "")
        or os.getenv("VITE_GOOGLE_CLIENT_ID", "")
        or os.getenv("GOOGLE_OAUTH_CLIENT_ID", "")
    )
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET", "")

    # RAG Settings
    TOP_K_RETRIEVAL: int = 5
    SIMILARITY_THRESHOLD: float = 0.25

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
