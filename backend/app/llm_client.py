import logging
from typing import List, Dict, Any, Generator, Optional
from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)


class NvidiaLLMClient:
    def __init__(self):
        self.api_key = settings.NVIDIA_API_KEY
        self.base_url = settings.NVIDIA_BASE_URL
        self.model = settings.NVIDIA_LLM_MODEL
        self._client: Optional[OpenAI] = None

        if self.api_key and self.api_key.startswith("nvapi-"):
            self._client = OpenAI(
                base_url=self.base_url,
                api_key=self.api_key,
                timeout=60.0
            )

    def _get_client(self) -> Optional[OpenAI]:
        # Lazily recreate client if API key changed in runtime
        if not self._client and settings.NVIDIA_API_KEY and settings.NVIDIA_API_KEY.startswith("nvapi-"):
            self._client = OpenAI(
                base_url=settings.NVIDIA_BASE_URL,
                api_key=settings.NVIDIA_API_KEY,
                timeout=60.0
            )
        return self._client

    def generate_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        max_tokens: int = 1500
    ) -> str:
        """Generates complete text response from NVIDIA Nemotron-3.5-super-vl-120b-a12b."""
        client = self._get_client()
        if not client:
            return self._fallback_generate(messages)

        try:
            logger.info(f"Calling NVIDIA LLM model: {self.model}")
            completion = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=0.9
            )
            return completion.choices[0].message.content or ""
        except Exception as e:
            logger.error(f"Error calling NVIDIA LLM {self.model}: {e}")
            return f"Error communicating with NVIDIA Nemotron API ({e}). Falling back to retrieved facts:\n\n" + self._fallback_generate(messages)

    def stream_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        max_tokens: int = 1500
    ) -> Generator[str, None, None]:
        """Streams response tokens in real-time from NVIDIA Nemotron."""
        client = self._get_client()
        if not client:
            fallback = self._fallback_generate(messages)
            yield fallback
            return

        try:
            logger.info(f"Streaming from NVIDIA LLM model: {self.model}")
            stream = client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                top_p=0.9,
                stream=True
            )
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error(f"Error streaming from NVIDIA LLM: {e}")
            yield f"\n\n[Note: NVIDIA LLM Stream encountered an issue: {e}]"

    def _fallback_generate(self, messages: List[Dict[str, str]]) -> str:
        """
        Clean fallback formatter when NVIDIA_API_KEY is not configured yet.
        Directly extracts and presents grounded knowledge from the context.
        """
        user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        sys_msg = next((m["content"] for m in messages if m["role"] == "system"), "")

        return (
            "### 📌 Information from Verified 2026 Guide:\n\n"
            "*(Notice: `NVIDIA_API_KEY` is not yet configured on this server. Here is the verified information directly retrieved from the document:)*\n\n"
            + sys_msg.split("=== RETRIEVED CONTEXT START ===")[-1].split("=== RETRIEVED CONTEXT END ===")[0].strip()
        )


nvidia_llm = NvidiaLLMClient()
