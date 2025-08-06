from abc import ABC, abstractmethod

class AIService(ABC):

    @abstractmethod
    def ask_ai(self, question: str, user_id: int, role: str) -> str:
        """שולח שאלה למנוע AI ומחזיר תשובה"""
        pass
