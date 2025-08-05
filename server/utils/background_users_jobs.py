from database import get_connection


def logout_inactive_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET is_logged_in = FALSE
        WHERE is_logged_in = TRUE
          AND last_login IS NOT NULL
          AND last_login <= NOW() - INTERVAL 12 HOUR
    """)
    conn.commit()
    cursor.close()
    conn.close()
