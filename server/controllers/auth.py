from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user
from database import get_connection
import datetime
from datetime import timedelta


router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


class RegisterModel(BaseModel):
    name: str
    email: str
    password: str


class LoginModel(BaseModel):
    email: str
    password: str


@router.post("/register")
def register_user(data: RegisterModel):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(data.password)
    cursor.execute(
        "INSERT INTO users (name, email, password_hash, role, is_blocked) VALUES (%s, %s, %s, %s, %s)",
        (data.name, data.email, hashed, "user", False), #רק כשאני נרשם אח"כ מחזירים ל user 
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User registered successfully"}


@router.post("/login")
def login_user(data: LoginModel):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, password_hash, role, is_blocked, is_logged_in, last_login FROM users WHERE email = %s", (data.email,))
    user = cursor.fetchone()
    
    if not user or not verify_password(data.password, user["password_hash"]):
        cursor.close()
        conn.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user["is_logged_in"] and user["last_login"]:
        last_login_time = user["last_login"]
        now = datetime.now()
        if now - last_login_time < timedelta(hours=12):
            cursor.close()
            conn.close()
            raise HTTPException(status_code=403, detail="User already logged in elsewhere")
        
    cursor.execute("UPDATE users SET is_logged_in = TRUE, last_login = %s WHERE id = %s", (datetime.now(), user["id"]))
    conn.commit()
    cursor.close()
    conn.close()

    token = create_access_token(user["id"], user["role"], user["is_blocked"])
    return {"access_token": token, "token_type": "bearer", "user_id": user["id"],"role": user["role"]}


@router.post("/logout")
def logout_user(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE users
        SET is_logged_in = FALSE
        WHERE id = %s
    """, (user["sub"],))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "User logged out"}