import json
import logging
from typing import List, Dict, Any, Generator, Tuple
from app.hybrid_retriever import hybrid_retriever
from app.llm_client import nvidia_llm
from app.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_TEMPLATE = """You are the official PM & IIT Internship AI Assistant.
Your duty is to assist undergraduate and postgraduate students with verified, highly accurate information regarding summer research internships and company/research leads based strictly on the official "IIT's Summer Internship Guide 2026".

### STRICT GROUNDING GUIDELINES:
1. Always base your response ONLY on the verified context provided below.
2. If the user asks about an IIT program (like IIT Kanpur SURGE, IIT Roorkee SPARK, IIT Hyderabad SURE, IIT Gandhinagar SRIP, IIT Goa, IIT Delhi, or IIT Bhubaneswar), explicitly provide:
   - Program name & full form (e.g., SURGE, SPARK, SURE, SRIP)
   - Eligibility criteria (degree, year, CGPA cutoffs if mentioned)
   - Stipend amount and benefits
   - Duration and timeline (dates and deadlines, e.g., SURGE deadline is 22 Feb 2026)
   - Official application website link
3. If the user asks about an organization from the 50+ Additional Leads (e.g., DRDO, ISRO, BARC, CSIR labs, Google, NVIDIA, Microsoft, Tata Motors, L&T, BHEL), clarify that this is an official recurring lead, specify suitable branches, and give the official application guidance noted.
4. If the user asks about tips, mention the key points: project-specific SOP, faculty shortlisting, early application, and NOC preparation.
5. NEVER fabricate deadlines or stipends not in the context. If details are not available or variable, state that clearly.
6. Format your answer with clean Markdown, bold highlights, bullet points, and clickable markdown links.

=== RETRIEVED CONTEXT START ===
{context_text}
=== RETRIEVED CONTEXT END ===
"""


class RAGService:
    def __init__(self):
        pass

    def _format_context(self, hits: List[Dict[str, Any]]) -> Tuple[str, List[Dict[str, Any]]]:
        """Formats retrieved chunks into clean prompt text and structured source list."""
        context_blocks = []
        sources = []

        for idx, hit in enumerate(hits):
            payload = hit.get("payload", {})
            title = payload.get("title", f"Document {idx+1}")
            page = payload.get("page", 1)
            content = payload.get("content", "")
            url = payload.get("apply_url", "")
            category = payload.get("category", "")
            score = hit.get("score", 0.0)

            context_blocks.append(
                f"--- SOURCE [{idx+1}]: {title} (Page {page}) ---\n"
                f"{content}\n"
                f"Official Link: {url}\n"
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
        system_content = SYSTEM_PROMPT_TEMPLATE.format(context_text=context_text)
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
        top_k: int = 6
    ) -> Dict[str, Any]:
        """
        End-to-End RAG execution:
        1. Hybrid retrieval (Dense + BM25 + RRF)
        2. Context construction
        3. NVIDIA Nemotron-3.5-super-vl generation
        4. Structured source citation output
        """
        # Retrieve context
        hits = hybrid_retriever.retrieve(query, top_k=top_k)
        context_text, sources = self._format_context(hits)

        # Build messages
        messages = self._build_messages(query, context_text, history)

        # Generate response using NVIDIA Nemotron
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
        top_k: int = 6
    ) -> Generator[str, None, None]:
        """
        Streams response tokens as Server-Sent Events (SSE).
        Emits metadata first, then tokens, then [DONE].
        """
        hits = hybrid_retriever.retrieve(query, top_k=top_k)
        context_text, sources = self._format_context(hits)
        messages = self._build_messages(query, context_text, history)

        # Emit sources first
        yield f"event: sources\ndata: {json.dumps(sources)}\n\n"

        # Stream LLM tokens
        for token in nvidia_llm.stream_response(messages):
            yield f"event: token\ndata: {json.dumps({'text': token})}\n\n"

        yield "event: done\ndata: {}\n\n"


rag_service = RAGService()
