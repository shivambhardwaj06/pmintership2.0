import logging
import math
import re
from collections import Counter
from typing import List, Dict, Any, Optional
from app.embeddings import embedding_service
from app.vector_store import vector_store
from app.config import settings

logger = logging.getLogger(__name__)


def tokenize(text: str) -> List[str]:
    """Simple lowercase tokenization for BM25."""
    return [w for w in re.findall(r"\w+", text.lower()) if len(w) > 1]


class BM25Index:
    """
    Self-contained Okapi BM25 implementation.
    Guarantees zero dependency issues and maximum speed on both local and Render environments.
    """
    def __init__(self, corpus: List[List[str]], k1: float = 1.5, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus_size = len(corpus)
        self.doc_lens = [len(doc) for doc in corpus]
        self.avgdl = sum(self.doc_lens) / (self.corpus_size or 1)
        self.doc_freqs: List[Counter] = [Counter(doc) for doc in corpus]
        self.idf: Dict[str, float] = {}
        self._compute_idf(corpus)

    def _compute_idf(self, corpus: List[List[str]]):
        df: Dict[str, int] = {}
        for doc in corpus:
            for term in set(doc):
                df[term] = df.get(term, 0) + 1

        for term, freq in df.items():
            # Standard Lucene/Okapi smoothed IDF
            self.idf[term] = math.log(1.0 + (self.corpus_size - freq + 0.5) / (freq + 0.5))

    def get_scores(self, query: List[str]) -> List[float]:
        scores = [0.0] * self.corpus_size
        for term in query:
            if term not in self.idf:
                continue
            idf_val = self.idf[term]
            for idx in range(self.corpus_size):
                freq = self.doc_freqs[idx].get(term, 0)
                if freq == 0:
                    continue
                num = freq * (self.k1 + 1.0)
                denom = freq + self.k1 * (1.0 - self.b + self.b * (self.doc_lens[idx] / (self.avgdl or 1)))
                scores[idx] += idf_val * (num / denom)
        return scores


class HybridRetriever:
    def __init__(self):
        self.bm25: Optional[BM25Index] = None
        self.doc_lookup: Dict[int, Dict[str, Any]] = {}
        self.doc_list: List[Dict[str, Any]] = []

    def initialize_bm25(self, chunks: List[Dict[str, Any]]):
        """Builds in-memory BM25 index over all chunks for lexical precision."""
        self.doc_list = chunks
        self.doc_lookup = {idx: chunk for idx, chunk in enumerate(chunks)}

        tokenized_corpus = [
            tokenize(f"{c.get('title', '')} {c.get('organization', '')} {' '.join(c.get('branches', []))} {c.get('content', '')}")
            for c in chunks
        ]
        self.bm25 = BM25Index(tokenized_corpus)
        logger.info(f"Initialized self-contained BM25 index over {len(chunks)} documents")

    def retrieve(
        self,
        query: str,
        top_k: int = 6,
        category_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Hybrid retrieval combining Dense Vector Search + BM25 Lexical Search via
        Reciprocal Rank Fusion (RRF).
        """
        if not query.strip():
            return []

        # 1. Dense Semantic Vector Retrieval
        query_vector = embedding_service.get_query_embedding(query)
        dense_hits = vector_store.search_vectors(query_vector=query_vector, limit=top_k * 2)

        # 2. Sparse Lexical BM25 Retrieval
        sparse_hits = []
        if self.bm25:
            tokens = tokenize(query)
            if tokens:
                scores = self.bm25.get_scores(tokens)
                sorted_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
                for rank, idx in enumerate(sorted_indices[: top_k * 2]):
                    if scores[idx] > 0:
                        sparse_hits.append({
                            "doc_id": self.doc_list[idx].get("id"),
                            "rank": rank + 1,
                            "score": float(scores[idx]),
                            "payload": self.doc_list[idx]
                        })

        # 3. Reciprocal Rank Fusion (RRF)
        rrf_k = 60
        fused_scores: Dict[str, float] = {}
        payload_map: Dict[str, Dict[str, Any]] = {}

        # Dense ranking contribution
        for rank, hit in enumerate(dense_hits):
            payload = hit.get("payload", {})
            doc_id = payload.get("doc_id") or str(payload.get("id", rank))
            rrf_score = 1.0 / (rrf_k + (rank + 1))
            fused_scores[doc_id] = fused_scores.get(doc_id, 0.0) + rrf_score
            payload_map[doc_id] = payload

        # Sparse BM25 ranking contribution
        for rank, hit in enumerate(sparse_hits):
            payload = hit.get("payload", {})
            doc_id = payload.get("id") or hit.get("doc_id")
            rrf_score = 1.0 / (rrf_k + (rank + 1))
            fused_scores[doc_id] = fused_scores.get(doc_id, 0.0) + rrf_score
            if doc_id not in payload_map:
                payload_map[doc_id] = payload

        # Sort combined results
        sorted_docs = sorted(fused_scores.items(), key=lambda item: item[1], reverse=True)

        # 4. Domain & Acronym Boosts
        lower_query = query.lower()
        boosted_results = []
        for doc_id, score in sorted_docs:
            payload = payload_map.get(doc_id, {})
            title_lower = (payload.get("title") or "").lower()
            org_lower = (payload.get("organization") or "").lower()

            adjusted_score = score
            # Boost exact program name matches
            if any(term in lower_query for term in ["surge", "spark", "sure", "srip"]) and any(term in title_lower for term in ["surge", "spark", "sure", "srip"]):
                adjusted_score += 0.05
            if any(term in lower_query for term in ["drdo", "isro", "barc", "csir", "bhel", "bel"]) and any(term in org_lower for term in ["drdo", "isro", "barc", "csir", "bhel", "bel"]):
                adjusted_score += 0.05

            boosted_results.append({
                "score": round(adjusted_score, 4),
                "rrf_score": round(score, 4),
                "payload": payload
            })

        # Re-sort after boost
        boosted_results.sort(key=lambda x: x["score"], reverse=True)

        # Apply category filter if requested
        if category_filter:
            boosted_results = [r for r in boosted_results if r["payload"].get("category") == category_filter]

        return boosted_results[:top_k]


hybrid_retriever = HybridRetriever()
