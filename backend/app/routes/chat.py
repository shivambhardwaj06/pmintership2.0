import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from app.rag_service import rag_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Chat"])


class ChatMessage(BaseModel):
    role: str = Field(..., description="Role: 'user' or 'assistant'/'bot'")
    content: Optional[str] = Field(None, description="Message text")
    text: Optional[str] = Field(None, description="Alternate field for message text")


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User question or query")
    history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Previous conversation turns")
    top_k: Optional[int] = Field(default=6, ge=1, le=15, description="Number of context passages to retrieve")


class SourceItem(BaseModel):
    id: Optional[str] = None
    title: str
    page: int
    url: Optional[str] = ""
    category: Optional[str] = ""
    score: Optional[float] = 0.0


class ChatResponse(BaseModel):
    query: str
    answer: str
    sources: List[SourceItem]
    model: str


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(payload: ChatRequest):
    """
    Standard synchronous JSON endpoint for RAG chatbot.
    Retrieves grounded context from IIT Internship Guide using Hybrid RAG + NVIDIA Nemotron LLM.
    """
    try:
        result = rag_service.answer_query(
            query=payload.message,
            history=payload.history,
            top_k=payload.top_k
        )
        return result
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat/stream")
async def chat_stream_endpoint(payload: ChatRequest):
    """
    Real-time streaming endpoint for chatbot UI (Server-Sent Events).
    Streams tokens as they are produced by NVIDIA Nemotron-3.5-super-vl.
    """
    try:
        return StreamingResponse(
            rag_service.stream_query(
                query=payload.message,
                history=payload.history,
                top_k=payload.top_k
            ),
            media_type="text/event-stream"
        )
    except Exception as e:
        logger.error(f"Error in chat stream: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))
