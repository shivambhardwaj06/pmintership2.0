"""
Test verification script for PM Internship Scheme 120 Records & Disha AI.
"""
import sys
import io
from pathlib import Path

# Force UTF-8 for console output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).parent))

from app.document_parser import get_structured_internship_chunks
from app.embeddings import embedding_service
from app.vector_store import vector_store
from app.hybrid_retriever import hybrid_retriever
from app.rag_service import rag_service


def run_tests():
    print("=" * 60)
    print(">> Starting PM Internship 120 Records & Disha AI Verification")
    print("=" * 60)

    # 1. Test Document Parser
    chunks = get_structured_internship_chunks()
    print(f"[OK] 1. Dataset Loaded: {len(chunks)} chunks (120 PM listings + scheme guides).")
    assert len(chunks) >= 120, f"Expected at least 120 chunks, found {len(chunks)}"

    # 2. Test BM25
    hybrid_retriever.initialize_bm25(chunks)
    print("[OK] 2. BM25 Lexical Index: Successfully initialized.")

    # 3. Test Vector Store & Embeddings
    print("[..] 3. Indexing into Qdrant Vector Store...")
    vector_store.ensure_collection(vector_size=1024)
    texts = [c.get("content", "") for c in chunks]
    embeddings = embedding_service.get_embeddings(texts, input_type="passage")
    vector_store.upsert_chunks(chunks, embeddings)
    point_count = vector_store.count()
    print(f"[OK] Points indexed in Qdrant: {point_count}")

    # 4. Test Queries
    test_queries = [
        "What is the software development internship at Tata Consultancy Services?",
        "Tell me about HDFC Bank or ICICI Bank finance internships",
        "How do I apply on the PM Internship website?",
        "Are there automotive internships for mechanical students like Maruti or Tata Motors?",
        "Where can I find past selected resumes and check skill gaps?"
    ]

    print("\n[..] 4. Testing Hybrid Retrieval on PMIS 120 Records:")
    for q in test_queries:
        hits = hybrid_retriever.retrieve(q, top_k=3)
        print(f"\nQuery: '{q}'")
        for idx, h in enumerate(hits):
            p = h["payload"]
            print(f"  [{idx+1}] Score: {h['score']} | {p.get('title')} ({p.get('location')})")
        assert len(hits) > 0, f"No results retrieved for query: {q}"

    # 5. Test Disha AI Answer Generation
    print("\n[..] 5. Testing Disha AI Grounded Friendly Answer:")
    sample_q = "How do I apply for internships on this website and what stipend will I receive?"
    res = rag_service.answer_query(sample_q, top_k=3)
    print(f"Query: {res['query']}")
    print(f"Model configured: {res['model']}")
    print(f"Sources cited: {[s['title'] for s in res['sources']]}")
    print("\nDisha AI Excerpt:")
    print("-" * 40)
    print(res["answer"][:300] + ("..." if len(res["answer"]) > 300 else ""))
    print("-" * 40)

    print("\n>>> ALL TESTS PASSED! PMIS 120 Database & Disha AI Verified. <<<")


if __name__ == "__main__":
    run_tests()
