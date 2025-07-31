from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from utils.auth_utils import get_current_user
from utils.permissions import admin_only, self_only, ensure_not_blocked
from database import get_connection
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])


class UpdateNameRequest(BaseModel):
    name: str


class UpdateBlockRequest(BaseModel):
    email: str
    is_blocked: bool


@router.get("/")
def get_all_users(user=Depends(get_current_user)):
    admin_only(user)
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, email, role, is_blocked, created_at FROM users")
    users = cursor.fetchall()
    cursor.close()
    conn.close()
    return users


@router.get("/me")
def get_my_profile(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, email, role, is_blocked, created_at FROM users WHERE id = %s", (user["sub"],))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return result


@router.put("/me/name")
def update_name(data: UpdateNameRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    self_only(user, int(user["sub"]))
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET name = %s WHERE id = %s", (data.name, user["sub"]))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Name updated successfully"}


@router.put("/block")
def block_user(data: UpdateBlockRequest, user=Depends(get_current_user)):
    admin_only(user)
    conn = get_connection()
    cursor = conn.cursor()

    if data.is_blocked:
        blocked_at = datetime.now()
    else:
        blocked_at = None

    cursor.execute(
        "UPDATE users SET is_blocked = %s, blocked_at = %s WHERE email = %s AND role = 'user'",
        (data.is_blocked, blocked_at, data.email)
    )

    cursor.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    user_row = cursor.fetchone()
    if user_row:
        user_id = user_row[0]
        msg = "חשבונך נחסם על ידי מנהל" if data.is_blocked else "חשבונך שוחרר על ידי מנהל"
        cursor.execute(
            "INSERT INTO notifications (user_id, message, created_at) VALUES (%s, %s, %s)",
            (user_id, msg, datetime.now())
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": f"User {data.email} block status updated"}


@router.delete("/me")
def delete_my_user(user=Depends(get_current_user)):
    self_only(user, int(user["sub"]))
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (user["sub"],))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User deleted"}


@router.get("/notifications/not_read")
def get_user_unread_notifications(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, message, created_at, is_read
        FROM notifications 
        WHERE user_id = %s AND is_read = FALSE 
        ORDER BY created_at DESC
    """, (user["sub"],))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"id": r[0], "message": r[1], "created_at": r[2], "is_read": r[3]} for r in results]


@router.get("/notifications")
def get_user_notifications(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT id, message, created_at, is_read
        FROM notifications 
        WHERE user_id = %s
        ORDER BY created_at DESC
    """, (user["sub"],))
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return [{"id": r[0], "message": r[1], "created_at": r[2], "is_read": r[3]} for r in results]


@router.put("/notifications/{notification_id}/read")
def mark_notification_as_read(notification_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE notifications 
        SET is_read = TRUE 
        WHERE id = %s AND user_id = %s
    """, (notification_id, user["sub"]))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Notification marked as read"}
