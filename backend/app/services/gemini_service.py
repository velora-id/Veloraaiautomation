import google.generativeai as genai
from typing import Optional, Dict, Any, List
from app.core.config import settings


class GeminiService:
    """
    Service for interacting with Google Gemini AI API
    """

    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = None

    def initialize_model(self, model_name: str = "gemini-pro"):
        """
        Initialize Gemini model
        """
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY not configured")

        self.model = genai.GenerativeModel(model_name)
        return self.model

    async def generate_text(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate text using Gemini API

        Args:
            prompt: User prompt/input
            system_prompt: System instructions for the AI
            temperature: Temperature for generation (0.0-1.0)
            max_tokens: Maximum tokens to generate

        Returns:
            Dictionary with generated text and metadata
        """
        try:
            if not self.model:
                self.initialize_model()

            # Combine system prompt with user prompt
            full_prompt = prompt
            if system_prompt:
                full_prompt = f"{system_prompt}\n\nUser: {prompt}\n\nAssistant:"

            # Generate content
            generation_config = genai.types.GenerationConfig(
                temperature=temperature,
                max_output_tokens=max_tokens,
            )

            response = self.model.generate_content(
                full_prompt,
                generation_config=generation_config
            )

            # Extract tokens used (approximate)
            # Gemini doesn't provide exact token counts, so we estimate
            prompt_tokens = len(full_prompt.split()) * 1.3  # Rough estimate
            completion_tokens = len(response.text.split()) * 1.3

            return {
                "text": response.text,
                "model": "gemini-pro",
                "tokens_used": int(prompt_tokens + completion_tokens),
                "prompt_tokens": int(prompt_tokens),
                "completion_tokens": int(completion_tokens),
                "finish_reason": "stop",  # Gemini doesn't provide this
            }

        except Exception as e:
            raise Exception(f"Gemini API error: {str(e)}")

    async def generate_with_tools(
        self,
        prompt: str,
        tools: List[Dict[str, Any]],
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate text with function calling/tools

        Args:
            prompt: User prompt
            tools: List of tool definitions
            system_prompt: System instructions

        Returns:
            Generated response with tool calls
        """
        # TODO: Implement function calling when needed
        # For now, use regular generation
        return await self.generate_text(prompt, system_prompt, **kwargs)

    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1000,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Chat completion with message history

        Args:
            messages: List of message dicts with 'role' and 'content'
            temperature: Temperature for generation
            max_tokens: Maximum tokens to generate

        Returns:
            Generated response
        """
        try:
            if not self.model:
                self.initialize_model()

            # Convert messages to Gemini format
            chat = self.model.start_chat(history=[])

            # Add all previous messages to chat history
            for msg in messages[:-1]:  # All except last
                if msg["role"] == "user":
                    chat.send_message(msg["content"])

            # Send final user message and get response
            last_message = messages[-1]["content"]
            response = chat.send_message(last_message)

            # Estimate tokens
            total_text = " ".join([m["content"] for m in messages])
            prompt_tokens = len(total_text.split()) * 1.3
            completion_tokens = len(response.text.split()) * 1.3

            return {
                "text": response.text,
                "model": "gemini-pro",
                "tokens_used": int(prompt_tokens + completion_tokens),
                "prompt_tokens": int(prompt_tokens),
                "completion_tokens": int(completion_tokens),
                "finish_reason": "stop",
            }

        except Exception as e:
            raise Exception(f"Gemini chat error: {str(e)}")

    def count_tokens(self, text: str) -> int:
        """
        Estimate token count for text
        This is a rough estimate - Gemini uses different tokenization
        """
        return int(len(text.split()) * 1.3)


# Create singleton instance
gemini_service = GeminiService()
