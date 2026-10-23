import hashlib
import json
import logging
import math
import re
from typing import List, Optional
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

# Dimension for NVIDIA BGE-M3 / embedding models (typically 1024)
EMBEDDING_DIM = 1024


class EmbeddingService:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = settings.NVIDIA_BASE_URL.rstrip("/")
        self.model = settings.NVIDIA_EMBEDDING_MODEL
        self._cache = {}

    def get_embeddings(self, texts: List[str], input_type: str = "passage") -> List[List[float]]:
        """
        Generates dense vector embeddings for an array of texts.
        Uses NVIDIA NIM Embeddings API when key is provided.
        Falls back to deterministic semantic representation if no API key is set.
        """
        if not texts:
            return []

        # If NVIDIA API Key is present, call NVIDIA NIM Embeddings API
        if self.api_key and self.api_key.startswith("nvapi-"):
            try:
                return self._call_nvidia_embeddings(texts, input_type=input_type)
            except Exception as e:
                logger.error(f"NVIDIA Embeddings API error: {e}. Falling back to local vectorizer.")

        # Local deterministic dense vectorizer (enables zero-crash offline execution)
        return [self._local_vectorize(text) for text in texts]

    def get_query_embedding(self, query: str) -> List[float]:
        """Convenience method to embed a single search query."""
        results = self.get_embeddings([query], input_type="query")
        return results[0] if results else [0.0] * EMBEDDING_DIM

    def _call_nvidia_embeddings(self, texts: List[str], input_type: str = "passage") -> List[List[float]]:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        url = f"{self.base_url}/embeddings"

        payload = {
            "model": self.model,
            "input": texts,
            "input_type": input_type,
            "encoding_format": "float",
            "truncate": "END"
        }

        with httpx.Client(timeout=30.0) as client:
            resp = client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                # Sort by index to preserve order
                items = sorted(data.get("data", []), key=lambda x: x.get("index", 0))
                return [item["embedding"] for item in items]
            else:
                logger.warning(f"NVIDIA Embeddings returned {resp.status_code}: {resp.text}")
                raise RuntimeError(f"NVIDIA Embedding API call failed: {resp.status_code}")

    def _local_vectorize(self, text: str) -> List[float]:
        """
        High-performance deterministic feature hash vectorizer (1024 dims).
        Provides semantic similarity for testing and offline fallback.
        """
        vec = [0.0] * EMBEDDING_DIM
        cleaned = re.sub(r"[^\w\s]", " ", text.lower())
        tokens = cleaned.split()
        if not tokens:
            return vec

        # Unigrams and bigrams
        terms = list(tokens)
        for i in range(len(tokens) - 1):
            terms.append(f"{tokens[i]}_{tokens[i+1]}")

        for term in terms:
            # Hash to bucket
            h = int(hashlib.md5(term.encode("utf-8")).hexdigest(), 16)
            idx = h % EMBEDDING_DIM
            sign = 1.0 if ((h >> 10) & 1) == 0 else -1.0
            vec[idx] += sign

        # L2 Normalize
        norm = math.sqrt(sum(v * v for v in vec))
        if norm > 0:
            vec = [v / norm for v in vec]

        return vec


embedding_service = EmbeddingService()
