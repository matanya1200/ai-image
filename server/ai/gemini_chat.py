from ai.ai_interface import AIService
from utils.db_queries import get_user_statistics
from utils.ai_loader import load_yaml_knowledge
import os
import google.generativeai as genai
from dotenv import load_dotenv


load_dotenv()

class GeminiService(AIService):
    
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not set in environment variables.")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("models/gemini-2.5-pro")

    def ask_ai(self, question: str, user_id: int, role: str) -> str:
        print(f"Using GeminiService for role: {role} and user_id: {user_id}")
        instructions = load_yaml_knowledge(role)
        stats = get_user_statistics(user_id, role)

        prompt = (
            f"הנחיות כלליות: {instructions}\n"
            f"מידע על המשתמש: {stats}\n"
            f"שאלה: {question}"
        )

        print(f"Full prompt for Gemini: {prompt}")

        response = self.model.generate_content(prompt)
        return response.text.strip()
