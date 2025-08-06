from ai.ai_interface import AIService
import csv
import os
from utils.db_queries import get_user_statistics
from utils.ai_loader import load_yaml_knowledge
import requests
import yaml

class OllamaService(AIService):
    
    def ask_ai(self, question: str, user_id: int, role: str) -> str:
        print(f"Using OllamaService for role: {role} and user_id: {user_id}")
        instructions = load_yaml_knowledge(role)
        stats = get_user_statistics(user_id, role)
        full_prompt = (
            f"הוראות מערכת: {instructions}\n\n"
            f"נתונים על המשתמש: {stats}\n\n"
            f"שאלה: {question}"
        )
        print(f"Full prompt for Ollama: {full_prompt}")

        response = requests.post("http://localhost:11434/api/generate", json={
            "model": "mistral",
            "prompt": full_prompt,
            "stream": False
        })

        if response.status_code == 200:
            return response.json()["response"].strip()
        else:
            return f"שגיאה בתקשורת עם Ollama: {response.status_code} - {response.text}"
