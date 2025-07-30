from database import get_connection
import datetime
import time
from utils.toxicity_model import is_toxic
from utils.toxicity_hebrew_filter import is_hebrew_toxic

def scan_toxic_comments():
    yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, user_id, comment FROM commits WHERE updated_at >= %s", (yesterday,))
    comments = cursor.fetchall()

    for comment_id, user_id, text in comments:
        if is_toxic(text):
            reason = "בגלל תוכן פוגעני באנגלית"
        elif is_hebrew_toxic(text):
            reason = "(המערכת אינה משלמת וכן יש להמנע מכל מילה שיכולה להתפרש כפוגענית) בגלל תוכן פוגעני בעברית"
        else:
            continue

        # מחיקת תגובה
        cursor.execute("DELETE FROM commits WHERE id = %s", (comment_id,))
        # יצירת התראה למשתמש
        msg = f"תגובה שלך הוסרה {reason}"
        cursor.execute(
            "INSERT INTO notifications (user_id, message, created_at) VALUES (%s, %s, %s)",
            (user_id, msg, datetime.datetime.now())
        )

    conn.commit()
    cursor.close()
    conn.close()

def schedule_tasks():
    def run_daily():
        while True:
            scan_toxic_comments()
            time.sleep(86400)

    import threading
    threading.Thread(target=run_daily, daemon=True).start()