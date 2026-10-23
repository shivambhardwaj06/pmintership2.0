import logging
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient
from qdrant_client.http import models
from app.config import settings

logger = logging.getLogger(__name__)


class QdrantVectorStore:
    def __init__(self):
        self.collection_name = settings.QDRANT_COLLECTION_NAME
        self.client = self._init_client()

    def _init_client(self) -> QdrantClient:
        """
        Initializes Qdrant client:
        - If QDRANT_URL is provided, connects to remote Qdrant Cloud (cloud.qdrant.io).
        - If QDRANT_URL is not provided, runs built-in embedded Qdrant on local disk/memory.
          This guarantees 100% independence from any local PC when hosted live on Render!
        """
        if settings.QDRANT_URL:
            logger.info(f"Connecting to Qdrant Cloud instance: {settings.QDRANT_URL}")
            return QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY,
                timeout=20.0
            )
        else:
            local_storage_dir = Path(settings.QDRANT_LOCAL_PATH)
            local_storage_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"Using Embedded In-Container Qdrant storage at {local_storage_dir.absolute()} (No local PC needed!)")
            try:
                return QdrantClient(path=str(local_storage_dir.absolute()))
            except Exception as e:
                logger.warning(f"Failed to bind local path ({e}), using in-memory Qdrant client")
                return QdrantClient(":memory:")

    def ensure_collection(self, vector_size: int = 1024):
        """Ensures the vector collection exists; creates it if absent."""
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                logger.info(f"Creating Qdrant collection '{self.collection_name}' with dim {vector_size}")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=vector_size,
                        distance=models.Distance.COSINE
                    )
                )
        except Exception as e:
            logger.error(f"Error ensuring collection: {e}")

    def upsert_chunks(self, chunks: List[Dict[str, Any]], embeddings: List[List[float]]):
        """Batch upserts chunks with their vector embeddings and rich metadata payloads."""
        self.ensure_collection(vector_size=len(embeddings[0]))

        points = []
        for idx, (chunk, vector) in enumerate(zip(chunks, embeddings)):
            point = models.PointStruct(
                id=idx + 1,
                vector=vector,
                payload={
                    "doc_id": chunk.get("id"),
                    "title": chunk.get("title"),
                    "category": chunk.get("category"),
                    "page": chunk.get("page"),
                    "organization": chunk.get("organization"),
                    "branches": chunk.get("branches", []),
                    "eligibility": chunk.get("eligibility", ""),
                    "stipend": chunk.get("stipend", ""),
                    "duration": chunk.get("duration", ""),
                    "apply_url": chunk.get("apply_url", ""),
                    "deadline": chunk.get("deadline", ""),
                    "content": chunk.get("content", "")
                }
            )
            points.append(point)

        # Batch upsert in chunks of 50
        batch_size = 50
        for i in range(0, len(points), batch_size):
            batch = points[i:i + batch_size]
            self.client.upsert(
                collection_name=self.collection_name,
                points=batch
            )
        logger.info(f"Successfully indexed {len(points)} points into Qdrant collection '{self.collection_name}'")

    def count(self) -> int:
        """Returns the number of points in the collection."""
        try:
            res = self.client.count(collection_name=self.collection_name)
            return res.count
        except Exception:
            return 0

    def search_vectors(self, query_vector: List[float], limit: int = 6) -> List[Dict[str, Any]]:
        """Dense similarity vector search supporting both modern and legacy Qdrant client versions."""
        try:
            if hasattr(self.client, "query_points"):
                results = self.client.query_points(
                    collection_name=self.collection_name,
                    query=query_vector,
                    limit=limit
                ).points
                return [
                    {
                        "score": hit.score,
                        "payload": hit.payload
                    }
                    for hit in results
                ]
            elif hasattr(self.client, "search"):
                results = self.client.search(
                    collection_name=self.collection_name,
                    query_vector=query_vector,
                    limit=limit
                )
                return [
                    {
                        "score": hit.score,
                        "payload": hit.payload
                    }
                    for hit in results
                ]
            return []
        except Exception as e:
            logger.error(f"Vector search failed: {e}")
            return []


vector_store = QdrantVectorStore()
