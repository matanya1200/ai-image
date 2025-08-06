from .ollama_chat import OllamaService
from .ai_interface import AIService
from .gemini_chat import GeminiService
from .gpt_chat import GPTService

# ברירת מחדל: להשתמש ב-Ollama
default_ai: AIService = GeminiService()
