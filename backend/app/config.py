import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "PM Internship Scheme (PMIS) Disha AI & RAG Backend"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    PORT: int = int(os.getenv("PORT", 8000))
    HOST: str = os.getenv("HOST", "0.0.0.0")
    CORS_ORIGINS: str = os.getenv("CORS_ORIGINS", "*")

    # NVIDIA NIM LLM Configuration
    NVIDIA_API_KEY: Optional[str] = os.getenv("NVIDIA_API_KEY", "")
    NVIDIA_BASE_URL: str = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
    NVIDIA_LLM_MODEL: str = os.getenv("NVIDIA_LLM_MODEL", "nvidia/nemotron-3.5-super-vl-120b-a12b")
    NVIDIA_EMBEDDING_MODEL: str = os.getenv("NVIDIA_EMBEDDING_MODEL", "baai/bge-m3")

    # Qdrant Vector Database
    QDRANT_URL: Optional[str] = os.getenv("QDRANT_URL", None)
    QDRANT_API_KEY: Optional[str] = os.getenv("QDRANT_API_KEY", None)
    QDRANT_COLLECTION_NAME: str = os.getenv("QDRANT_COLLECTION_NAME", "pmis_internships_120_kb")
    QDRANT_LOCAL_PATH: str = os.getenv("QDRANT_LOCAL_PATH", "./qdrant_storage")

    # Cloudinary configuration for dynamic Resume Storage
    CLOUDINARY_CLOUD_NAME: Optional[str] = os.getenv("CLOUDINARY_CLOUD_NAME", "")
    CLOUDINARY_API_KEY: Optional[str] = os.getenv("CLOUDINARY_API_KEY", "")
    CLOUDINARY_API_SECRET: Optional[str] = os.getenv("CLOUDINARY_API_SECRET", "")

    # Google OAuth 2.0
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID", "")

    # RAG Settings
    TOP_K_RETRIEVAL: int = 5
    SIMILARITY_THRESHOLD: float = 0.25

    class Config:
        env_file = ".env"
        extra = "allow"


settings = Settings()
