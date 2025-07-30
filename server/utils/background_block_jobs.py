import time
from datetime import datetime, timedelta
from database import get_connection

def unblock_users():
    conn = get_connection()
    cursor = conn.cursor()

    # נשלוף את כל המשתמשים שמשתחררים עכשיו
    cursor.execute("""
        SELECT id FROM users
        WHERE is_blocked = TRUE
          AND blocked_at IS NOT NULL
          AND blocked_at <= NOW() - INTERVAL '7 days'
    """)
    users_to_unblock = cursor.fetchall()

    cursor.execute("""
        UPDATE users
        SET is_blocked = FALSE,
            blocked_at = NULL
        WHERE is_blocked = TRUE
          AND blocked_at IS NOT NULL
          AND blocked_at <= NOW() - INTERVAL '7 days'
    """)

    for user in users_to_unblock:
        user_id = user[0]
        cursor.execute(
            "INSERT INTO notifications (user_id, message, created_at) VALUES (%s, %s, %s)",
            (user_id, "חשבונך שוחרר אוטומטית לאחר 7 ימים", datetime.now())
        )
    

    conn.commit()
    cursor.close()
    conn.close()

def schedule_unblock_task():
    def run_daily():
        while True:
            unblock_users()
            time.sleep(86400)  # 24 שעות

    import threading
    thread = threading.Thread(target=run_daily, daemon=True)
    thread.start()