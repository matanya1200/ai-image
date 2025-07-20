import bcrypt
from jose import jwt, JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer


load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

SECRET_KEY = os.getenv("JWT_SECRET", "secret")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def create_access_token(user_id: int, role: str, is_blocked: bool, expires_delta: timedelta = timedelta(days=7)) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "is_blocked":is_blocked,
        "exp": datetime.utcnow() + expires_delta
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_access_token(token)
    if not payload:
        raise Exception("Invalid token")
    return payload
