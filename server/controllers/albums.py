from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from utils.auth_utils import get_current_user
from utils.permissions import admin_only, self_only,ensure_not_blocked
from database import get_connection

router = APIRouter(prefix="/albums", tags=["Albums"])


# 📦 Models
class AlbumCreate(BaseModel):
    name: str
    is_public: Optional[bool] = False

class AlbumUpdate(BaseModel):
    name: Optional[str] = None
    is_public: Optional[bool] = None

class AlbumBlock(BaseModel):
    is_blocked: bool


# 1. יצירת אלבום
@router.post("/")
def create_album(data: AlbumCreate, user=Depends(get_current_user)):
    ensure_not_blocked(user)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO albums (user_id, name, is_public) VALUES (%s, %s, %s)",
        (user["sub"], data.name, data.is_public)
    )
    album_id = cursor.lastrowid  # שליפת ה-ID של האלבום החדש
    conn.commit()
    cursor.close()
    conn.close()

    return {
        "message": "Album created",
        "album_id": album_id  # מחזירים גם את ה-ID
    }


# 2. קבלת כל האלבומים הפומביים
@router.get("/public")
def get_public_albums():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""SELECT a.* , u.name AS creator_name 
                   FROM albums a 
                   JOIN users u ON a.user_id = u.id
                   WHERE a.is_public = TRUE AND a.is_blocked = FALSE""")
    albums = cursor.fetchall()
    cursor.close()
    conn.close()
    return albums


# 3. חיפוש אלבום פומבי לפי שם
@router.get("/search")
def search_public_albums(query: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""SELECT a.* , u.name AS creator_name
                   FROM albums a  
                   JOIN users u ON a.user_id = u.id
                   WHERE a.is_public = TRUE AND a.is_blocked = FALSE AND a.name LIKE %s""",
                   ("%" + query + "%",))
    albums = cursor.fetchall()
    cursor.close()
    conn.close()
    return albums


# 4. קבלת אלבומים של משתמש
@router.get("/me")
def get_my_albums(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM albums WHERE user_id = %s", (user["sub"],))
    albums = cursor.fetchall()
    cursor.close()
    conn.close()
    return albums


# 5. עדכון אלבום (שם/פומבי)
@router.put("/{album_id}")
def update_album(album_id: int, data: AlbumUpdate, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id FROM albums WHERE id = %s", (album_id,))
    album = cursor.fetchone()
    
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    self_only(user, album["user_id"])

    update_fields = []
    params = []
    if data.name is not None:
        update_fields.append("name = %s")
        params.append(data.name)
    if data.is_public is not None:
        update_fields.append("is_public = %s")
        params.append(data.is_public)
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields to update")
    params.append(album_id)

    sql = f"UPDATE albums SET {', '.join(update_fields)} WHERE id = %s"
    cursor.execute(sql, params)

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Album updated"}


# 6. מחיקת אלבום
@router.delete("/{album_id}")
def delete_album(album_id: int, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id FROM albums WHERE id = %s", (album_id,))
    album = cursor.fetchone()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    self_only(user, album["user_id"])

    cursor.execute("DELETE FROM albums WHERE id = %s", (album_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Album deleted"}


# 7. חסימת/שחרור אלבום ע"י מנהל
@router.put("/{album_id}/block")
def block_album(album_id: int, data: AlbumBlock, user=Depends(get_current_user)):
    admin_only(user)
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE albums SET is_blocked = %s WHERE id = %s", (data.is_blocked, album_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Album block status updated"}


# 8. תמונות פומביות באלבום
@router.get("/{album_id}/images/public")
def get_public_images_in_album(album_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.* FROM images i
        JOIN albums a ON i.album_id = a.id
        WHERE i.album_id = %s AND i.is_public = TRUE AND i.is_blocked = FALSE
        AND a.is_public = TRUE AND a.is_blocked = FALSE
    """, (album_id,))
    images = cursor.fetchall()
    cursor.close()
    conn.close()
    return images


# 9. כל התמונות באלבום של המשתמש
@router.get("/{album_id}/images")
def get_user_album_images(album_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id FROM albums WHERE id = %s", (album_id,))
    album = cursor.fetchone()
    if not album:
        raise HTTPException(status_code=404, detail="Album not found")
    self_only(user, album["user_id"])

    cursor.execute("SELECT * FROM images WHERE album_id = %s", (album_id,))
    images = cursor.fetchall()
    cursor.close()
    conn.close()
    return images
