from database import get_connection

def get_user_statistics(user_id: int, role: str) -> str:
    conn = get_connection()
    cursor = conn.cursor()

    # --- פרטי משתמש ---
    cursor.execute("""
        SELECT name, email, is_blocked, created_at
        FROM users WHERE id = %s
    """, (user_id,))
    user = cursor.fetchone()
    if not user:
        return "אין מידע על המשתמש."

    name, email, is_blocked, created_at = user

    user_info = f"""
        👤 פרטי משתמש:
        שם: {name}
        אימייל: {email}
        חסום: {"כן" if is_blocked else "לא"}
        תאריך הרשמה: {created_at.date()}
    """.strip()

    # --- תמונות ---
    cursor.execute("""
        SELECT COUNT(*), 
               SUM(is_public = TRUE), 
               SUM(is_blocked = TRUE)
        FROM images WHERE user_id = %s
    """, (user_id,))

    total, public, blocked = cursor.fetchone()
    
    image_info = f"""
        🖼️ תמונות:
        סה"כ: {total}
        פומביות: {public}
        חסומות: {blocked}
    """.strip()

    # --- אלבומים ---
    cursor.execute("""
        SELECT COUNT(*),
               SUM(is_public = TRUE)
        FROM albums WHERE user_id = %s
    """, (user_id,))

    total_albums, public_albums = cursor.fetchone()
    
    album_info = f"""
        📁 אלבומים:
        סה"כ: {total_albums}
        פומביים: {public_albums}
    """.strip()

    # --- תגובות ---
    cursor.execute("SELECT COUNT(*) FROM comments WHERE user_id = %s", (user_id,))
    
    total_comments = cursor.fetchone()[0]
    
    comment_info = f"""
        💬 תגובות:
        סה"כ תגובות: {total_comments}
    """.strip()

    # --- נתוני מערכת (למנהל בלבד) ---
    admin_info = ""
    if role == "admin":
        cursor.execute("SELECT COUNT(*) FROM users")
        total_users = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM users WHERE is_blocked = TRUE")
        blocked_users = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM images")
        total_images = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM albums")
        total_albums_sys = cursor.fetchone()[0]
        cursor.execute("SELECT COUNT(*) FROM comments")
        total_comments_sys = cursor.fetchone()[0]

        admin_info = f"""
            🔐 מידע למנהל:
            משתמשים רשומים: {total_users}
            משתמשים חסומים: {blocked_users}
            סה"כ תמונות במערכת: {total_images}
            סה"כ אלבומים במערכת: {total_albums_sys}
            סה"כ תגובות במערכת: {total_comments_sys}
        """.strip()

    cursor.close()
    conn.close()

    return "\n\n".join([user_info, image_info, album_info, comment_info, admin_info])
