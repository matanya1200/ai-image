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

    cursor.execute("UPDATE users SET is_blocked = %s, blocked_at = %s WHERE email = %s AND role = 'user'", (data.is_blocked, blocked_at, data.email))
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
