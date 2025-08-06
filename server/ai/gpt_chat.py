import os
import openai
from ai.ai_interface import AIService
from utils.db_queries import get_user_statistics
from utils.ai_loader import load_yaml_knowledge

class GPTService(AIService):
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not set in environment variables.")
        
        self.client = openai.OpenAI(api_key=api_key)
        

    def ask_ai(self, question: str, user_id: int, role: str) -> str:
        print(f"Using GPTService for role: {role} and user_id: {user_id}")
        instructions = load_yaml_knowledge(role)
        stats = get_user_statistics(user_id, role)

        prompt = (
            f"הנחיות כלליות: {instructions}\n"
            f"מידע על המשתמש: {stats}\n"
        )
        print(f"Full prompt for GPT: {prompt}")

        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": question},
                ],
                max_tokens=500,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return f"שגיאה בקבלת תשובה מה-AI: {str(e)}"
