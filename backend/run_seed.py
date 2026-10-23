"""
Standalone seeding script for populating Qdrant vector database.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from app.document_parser import get_structured_internship_chunks
from app.embeddings import embedding_service
from app.vector_store import vector_store


def main():
    print("Loading chunks from guide...")
    chunks = get_structured_internship_chunks()
    print(f"Loaded {len(chunks)} chunks.")

    print("Generating embeddings...")
    texts = [c.get("content", "") for c in chunks]
    embeddings = embedding_service.get_embeddings(texts, input_type="passage")

    print(f"Upserting {len(chunks)} vectors into Qdrant collection '{vector_store.collection_name}'...")
    vector_store.upsert_chunks(chunks, embeddings)
    print(f"Done! Total collection size: {vector_store.count()} points.")


if __name__ == "__main__":
    main()
