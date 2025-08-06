from fastapi import APIRouter, Depends, HTTPException
from database import get_connection
from ai import default_ai
from datetime import datetime
from utils.auth_utils import get_current_user  # אם יש לך פונקציית auth
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["AI"])

class PromptRequest(BaseModel):
    prompt: str

@router.post("/ask")
def ask_ai(data: PromptRequest, user=Depends(get_current_user)):
    try:
        role = user["role"]
        user_id = user["sub"]
        prompt = data.prompt

        # קבלת תשובה מהמודל
        response = default_ai.ask_ai(prompt, user_id, role)

        # שמירת השאלה והתשובה ב-DB
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO ai_history (user_id, question, answer, timestamp)
            VALUES (%s, %s, %s, %s)
        """, (user_id, prompt, response, datetime.now()))
        conn.commit()
        cursor.close()
        conn.close()

        return {"answer": response}

    except Exception as e:
        print(f"Error in ask_ai: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
def get_ai_history(user=Depends(get_current_user)):
    user_id = user["sub"]
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT question, answer, timestamp 
        FROM ai_history 
        WHERE user_id = %s 
        ORDER BY timestamp DESC
    """, (user_id,))
    history = cursor.fetchall()
    cursor.close()
    conn.close()
    return history


@router.delete("/clearHistory")
def clear_ai_history(user=Depends(get_current_user)):
    user_id = user["sub"]
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM ai_history WHERE user_id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "היסטוריית השיחות נמחקה בהצלחה"}