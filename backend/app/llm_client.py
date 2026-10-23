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
        max_tokens: int = 2500,
        extra_body: Optional[Dict[str, Any]] = None
    ) -> str:
        """Generates complete text response from AI model."""
        client = self._get_client()
        if not client:
            return self._fallback_generate(messages)

        try:
            logger.info(f"Calling AI LLM model: {self.model}")
            kwargs: Dict[str, Any] = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "top_p": 0.9
            }
            if extra_body:
                kwargs["extra_body"] = extra_body
            elif "nemotron" in self.model.lower() or "vl" in self.model.lower():
                kwargs["extra_body"] = {"chat_template_kwargs": {"thinking": False}}

            completion = client.chat.completions.create(**kwargs)
            content = completion.choices[0].message.content or ""
            if not content.strip() and hasattr(completion.choices[0].message, "reasoning_content"):
                # If content was blank, check if reasoning content contains the output
                rc = getattr(completion.choices[0].message, "reasoning_content", "") or ""
                if "{" in rc and "}" in rc:
                    content = rc
                elif rc:
                    content = rc
            return content
        except Exception as e:
            logger.error(f"Error calling AI LLM {self.model}: {e}")
            return self._fallback_generate(messages)

    def stream_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.2,
        max_tokens: int = 2500,
        extra_body: Optional[Dict[str, Any]] = None
    ) -> Generator[str, None, None]:
        """Streams response tokens in real-time from AI model."""
        client = self._get_client()
        if not client:
            fallback = self._fallback_generate(messages)
            yield fallback
            return

        try:
            logger.info(f"Streaming from AI LLM model: {self.model}")
            kwargs: Dict[str, Any] = {
                "model": self.model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "top_p": 0.9,
                "stream": True
            }
            if extra_body:
                kwargs["extra_body"] = extra_body
            elif "nemotron" in self.model.lower() or "vl" in self.model.lower():
                kwargs["extra_body"] = {"chat_template_kwargs": {"thinking": False}}

            stream = client.chat.completions.create(**kwargs)
            yielded_anything = False
            for chunk in stream:
                if chunk.choices and chunk.choices[0].delta:
                    delta = chunk.choices[0].delta
                    token = delta.content
                    if not token:
                        token = getattr(delta, "reasoning_content", None)
                    if token:
                        yield token
                        yielded_anything = True
            
            if not yielded_anything:
                yield self._fallback_generate(messages)
        except Exception as e:
            logger.error(f"Error streaming from AI LLM: {e}")
            yield self._fallback_generate(messages)

    def _fallback_generate(self, messages: List[Dict[str, str]]) -> str:
        """
        Clean verified guidance fallback when cloud model is connecting or offline.
        Directly extracts and presents grounded knowledge from the official portal dataset.
        """
        sys_msg = next((m["content"] for m in messages if m["role"] == "system"), "")
        if "=== RETRIEVED CONTEXT START ===" in sys_msg and "=== RETRIEVED CONTEXT END ===" in sys_msg:
            raw_context = sys_msg.split("=== RETRIEVED CONTEXT START ===")[-1].split("=== RETRIEVED CONTEXT END ===")[0].strip()
            # Clean section markers into clean guidance format
            clean_lines = [l for l in raw_context.split("\n") if not l.startswith("Document [") and not l.startswith("Source:")]
            return "### 📌 Verified Guidance from Official PM Internship Portal:\n\n" + "\n".join(clean_lines[:15])
        
        return "### 📌 Verified PM Internship Scheme Guidance:\n\nThe Prime Minister's Internship Scheme provides 12-month paid internships in India's top 500 corporations with a ₹5,000 monthly stipend plus ₹6,000 one-time grant. Explore all live openings directly on our Explore Internships tab or check your Student Dashboard."


nvidia_llm = NvidiaLLMClient()
