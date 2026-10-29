import json
import logging
from typing import List, Dict, Any, Generator, Tuple
from app.hybrid_retriever import hybrid_retriever
from app.llm_client import nvidia_llm
from app.config import settings

logger = logging.getLogger(__name__)

DISHA_SYSTEM_PROMPT_TEMPLATE = """You are "Disha", the friendly, helpful AI Guide for the PM Internship Scheme (PMIS) platform.

### YOUR ROLE & TONE:
1. Warm, encouraging, concise, and student-friendly. Address students supportively.
2. Provide SHORT, crisp answers (2-4 bullet points max) rather than long overwhelming essays.
3. If the user asks how to apply or wants to explore roles, guide them step-by-step through our website:
   - "Step 1: Click 'Login / Register' on top to register with your mobile number or Google."
   - "Step 2: Go to the 'Explore Internships' section to filter by your State, Mode (Hybrid/Remote/On-site), or Sector."
   - "Step 3: In your Student Dashboard, set your Branch, Career Goals, and upload your resume."
   - "Step 4: Check 'See Past Selected Resumes' to format your CV, and check top matching database roles."
4. If the user asks about a specific company or internship (e.g., TCS, Infosys, HDFC, L&T, Tata Motors, Sun Pharma, NTPC):
   - Briefly state the role, location, mode, and stipend from the database.
   - Gently advise: "You can explore full details and apply directly in our **Explore Internships** section!"
5. For any general career, skill, or resume question: Answer warmly using verified scheme standards and advise them to check the Student Dashboard.
6. Always maintain the PM Internship Scheme's identity and encourage youth to apply.

=== VERIFIED PORTAL CONTEXT ===
{context_text}
=== END CONTEXT ===
"""


class RAGService:
    def __init__(self):
        pass

    def _format_context(self, hits: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
        context_blocks = []
        sources = []

        for idx, hit in enumerate(hits):
            payload = hit.get("payload", {})
            title = payload.get("title", f"Document {idx+1}")
            page = payload.get("page") or payload.get("record_num", 1)
            content = payload.get("content", "")
            url = payload.get("apply_url", "/dashboard")
            category = payload.get("category", "")
            score = hit.get("score", 0.0)

            context_blocks.append(
                f"--- SOURCE [{idx+1}]: {title} ---\n"
                f"{content}\n"
            )

            sources.append({
                "id": payload.get("id") or payload.get("doc_id"),
                "title": title,
                "page": page,
                "url": url,
                "category": category,
                "score": score
            })

        return "\n".join(context_blocks), sources

    def _build_messages(
        self,
        query: str,
        context_text: str,
        history: List[Dict[str, str]] = None
    ) -> List[Dict[str, str]]:
        system_content = DISHA_SYSTEM_PROMPT_TEMPLATE.format(context_text=context_text)
        messages = [{"role": "system", "content": system_content}]

        # Append last 4 history turns for multi-turn conversational context
        if history:
            for turn in history[-4:]:
                role = "user" if turn.get("role") in ["user", "human"] else "assistant"
                content = turn.get("content") or turn.get("text", "")
                if content:
                    messages.append({"role": role, "content": content})

        # Append current user question
        messages.append({"role": "user", "content": query})
        return messages

    def answer_query(
        self,
        query: str,
        history: List[Dict[str, str]] = None,
        top_k: int = 5
    ) -> Dict[str, Any]:
        """
        Executes Disha AI friendly RAG:
        1. Hybrid retrieval (Dense Vector + BM25) from 120 PM Internship records
        2. Injects student guidance instructions
        3. Generates concise, welcoming answer with NVIDIA Nemotron
        """
        hits = hybrid_retriever.retrieve(query, top_k=top_k)
        context_text, sources = self._format_context(hits)
        messages = self._build_messages(query, context_text, history)

        answer = nvidia_llm.generate_response(messages)

        return {
            "query": query,
            "answer": answer,
            "sources": sources,
            "model": settings.NVIDIA_LLM_MODEL
        }

    def stream_query(
        self,
        query: str,
        history: List[Dict[str, str]] = None,
        top_k: int = 5
    ) -> Generator[str, None, None]:
        hits = hybrid_retriever.retrieve(query, top_k=top_k)
        context_text, sources = self._format_context(hits)
        messages = self._build_messages(query, context_text, history)

        yield f"event: sources\ndata: {json.dumps(sources)}\n\n"

        for token in nvidia_llm.stream_response(messages):
            yield f"event: token\ndata: {json.dumps({'text': token})}\n\n"

        yield "event: done\ndata: {}\n\n"


rag_service = RAGService()
