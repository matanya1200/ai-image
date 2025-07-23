import time
from datetime import datetime, timedelta
from database import get_connection

def unblock_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET is_blocked = FALSE,
            blocked_at = NULL
        WHERE is_blocked = TRUE
          AND blocked_at IS NOT NULL
          AND blocked_at <= NOW() - INTERVAL '7 days'
    """)
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