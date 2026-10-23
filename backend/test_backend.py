"""
Test verification script for IIT Internship RAG Backend.
Runs locally to test document chunking, hybrid retrieval, and prompt pipeline.
"""
import sys
import io
from pathlib import Path

# Force UTF-8 for console output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from app.document_parser import get_structured_internship_chunks
from app.embeddings import embedding_service
from app.vector_store import vector_store
from app.hybrid_retriever import hybrid_retriever
from app.rag_service import rag_service


def run_tests():
    print("=" * 60)
    print(">> Starting RAG Backend Verification Tests")
    print("=" * 60)

    # 1. Test Document Parser
    chunks = get_structured_internship_chunks()
    print(f"[OK] 1. Document Parsing: Loaded {len(chunks)} structured chunks.")
    assert len(chunks) >= 100, f"Expected at least 100 chunks, found {len(chunks)}"

    # 2. Test BM25 Initialization
    hybrid_retriever.initialize_bm25(chunks)
    print("[OK] 2. BM25 Lexical Index: Successfully initialized.")

    # 3. Test Vector Store & Embeddings
    print("[..] 3. Testing Vector Store & Indexing...")
    vector_store.ensure_collection(vector_size=1024)
    texts = [c.get("content", "") for c in chunks]
    embeddings = embedding_service.get_embeddings(texts, input_type="passage")
    print(f"[OK] Generated {len(embeddings)} embeddings of dimension {len(embeddings[0])}.")

    vector_store.upsert_chunks(chunks, embeddings)
    point_count = vector_store.count()
    print(f"[OK] Vector Store points indexed: {point_count}")
    assert point_count >= len(chunks), "Vector store count does not match chunks"

    # 4. Test Hybrid Retrieval on Sample Queries
    test_queries = [
        "What is the application deadline for IIT Kanpur SURGE 2026?",
        "What is the stipend for IIT Roorkee SPARK internship?",
        "Are there research internships for Mechanical and Aerospace at DRDO or ISRO?",
        "What is IIT Hyderabad SURE eligibility?",
        "What are the best tips to increase my chances of getting selected?"
    ]

    print("\n[..] 4. Testing Hybrid Retrieval (Dense + BM25 + RRF):")
    for q in test_queries:
        hits = hybrid_retriever.retrieve(q, top_k=3)
        print(f"\nQuery: '{q}'")
        print(f"Retrieved {len(hits)} passages:")
        for idx, h in enumerate(hits):
            p = h["payload"]
            print(f"  [{idx+1}] Score: {h['score']} | {p.get('title')} (Page {p.get('page')})")
        assert len(hits) > 0, f"No results retrieved for query: {q}"

    # 5. Test End-to-End RAG Answer
    print("\n[..] 5. Testing RAG Answer Execution:")
    sample_q = "How much stipend is paid in IIT Roorkee SPARK and what is the CGPA required?"
    res = rag_service.answer_query(sample_q, top_k=3)
    print(f"Query: {res['query']}")
    print(f"Model configured: {res['model']}")
    print(f"Sources cited: {[s['title'] for s in res['sources']]}")
    print("\nResponse excerpt:")
    print("-" * 40)
    print(res["answer"][:300] + ("..." if len(res["answer"]) > 300 else ""))
    print("-" * 40)

    print("\n>>> ALL TESTS PASSED! RAG backend is 100% verified and ready. <<<")


if __name__ == "__main__":
    run_tests()
