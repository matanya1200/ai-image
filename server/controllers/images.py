from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
from utils.auth_utils import get_current_user
from utils.permissions import admin_only, self_or_admin, self_only,ensure_not_blocked
from database import get_connection
from utils.generate_image import generate_image_from_text
import shutil
import time
import os

router = APIRouter(prefix="/images", tags=["Images"])


class ImageCreateRequest(BaseModel):
    prompt: str
    name: str
    album_id: Optional[int] = None

class ImageAddRequest(BaseModel):
    name: str
    image_url: str
    album_id: Optional[int] = None

class ImageNameUpdate(BaseModel):
    name: str

class ImageBlockRequest(BaseModel):
    is_blocked: bool

class ImagePublicRequest(BaseModel):
    is_public: bool

class AssignAlbumRequest(BaseModel):
    album_id: Optional[int] = None

def get_image_owner_id(image_id: int) -> int:
    """Helper function to get the owner ID of an image"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT user_id FROM images WHERE id = %s", (image_id,))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not result:
        raise HTTPException(status_code=404, detail="Image not found")
    
    return result[0]



@router.post("/add_image_by_url")
def add_image(data: ImageAddRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO images (user_id, name, url, album_id) VALUES (%s, %s, %s, %s)",
        (user["sub"], data.name, data.image_url, data.album_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Image added successfully"}


@router.post("/upload_image_file")
def upload_image_file(name: str = Form(...), file: UploadFile = File(...), album_id: Optional[int] = Form(None), user=Depends(get_current_user)):
    ensure_not_blocked(user)

    # בדיקת סיומת
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
        raise HTTPException(status_code=400, detail="Invalid file format")

    # שם ייחודי
    timestamp = int(time.time())
    filename = f"user_{user['sub']}_{timestamp}_{file.filename}"
    filepath = os.path.join("static", filename)

    # שמירה פיזית של הקובץ
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # יצירת URL גישה
    image_url = f"http://localhost:8000/static/{filename}"

    # שמירה במסד הנתונים
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO images (user_id, name, url, album_id) VALUES (%s, %s, %s, %s)",
        (user["sub"], name, image_url, album_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Image uploaded", "url": image_url}



@router.post("/AIgenerate")
def create_image(data: ImageCreateRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    image_url = generate_image_from_text(data.prompt)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO images (user_id, name, url, album_id) VALUES (%s, %s, %s, %s)",
        (user["sub"], data.name, image_url, data.album_id)
    )
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": "Image created", "url": image_url}


@router.get("/me")
def get_my_images(page: int = 1, limit: int = 25, user=Depends(get_current_user)):

    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 25
    
    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    
    cursor.execute("SELECT COUNT(*) as total FROM images WHERE user_id = %s", (user["sub"],))
    total_count = cursor.fetchone()["total"]

    cursor.execute("""
                   SELECT id, name, url, is_public, album_id 
                   FROM images 
                   WHERE user_id = %s 
                   ORDER BY updated_at
                   DESC 
                   LIMIT %s OFFSET %s""", (user["sub"], limit, offset))
    images = cursor.fetchall()
    cursor.close()
    conn.close()
    
    total_pages = (total_count + limit - 1) // limit
    
    return {
        "images": images,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }
    }

@router.get("/public")
def get_public_images(page: int = 1, limit: int = 25):
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:  # הגבלה מקסימלית של 100
        limit = 25
    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # סופרים כמה תמונות יש בסך הכול
    cursor.execute("""
        SELECT COUNT(*) as total 
        FROM images 
        WHERE is_public = TRUE AND is_blocked = FALSE
    """)
    total_count = cursor.fetchone()["total"]

    # מביאים את התמונות בפאגינציה
    cursor.execute("""
        SELECT i.id, i.name, i.url, i.updated_at, u.name AS user_name 
        FROM images i
        JOIN users u ON i.user_id = u.id
        WHERE i.is_public = TRUE AND i.is_blocked = FALSE
        ORDER BY i.updated_at DESC
        LIMIT %s OFFSET %s
    """, (limit, offset))
    images = cursor.fetchall()

    cursor.close()
    conn.close()

    total_pages = (total_count + limit - 1) // limit

    return {
        "images": images,
        "pagination": {
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total_count,
            "items_per_page": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }
    }


@router.get("/search")
def search_images(query: str, page: int = 1, limit: int = 25):
    if page < 1:
        page = 1
    if limit < 1 or limit > 100:
        limit = 25
    offset = (page - 1) * limit

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # חישוב מספר כולל
    cursor.execute("""
        SELECT COUNT(*) as total
        FROM images
        WHERE is_public = TRUE AND is_blocked = FALSE AND name LIKE %s
    """, (f"%{query}%",))
    total = cursor.fetchone()["total"]

    # שליפת התוצאות עם הצטרפות ל־users
    cursor.execute("""
        SELECT i.id, i.name, i.url, i.updated_at, u.name AS user_name
        FROM images i
        JOIN users u ON i.user_id = u.id
        WHERE i.is_public = TRUE AND i.is_blocked = FALSE AND i.name LIKE %s
        ORDER BY i.updated_at DESC
        LIMIT %s OFFSET %s
    """, (f"%{query}%", limit, offset))
    results = cursor.fetchall()

    cursor.close()
    conn.close()

    total_pages = (total + limit - 1) // limit

    return {
        "images": results,
        "pagination": {
            "query": query,
            "current_page": page,
            "total_pages": total_pages,
            "total_items": total,
            "items_per_page": limit,
            "has_next": page < total_pages,
            "has_previous": page > 1
        }
    }



@router.get("/{image_id}")
def get_image_by_id(image_id: int, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
                    SELECT i.id, i.name, i.url, i.updated_at, u.name AS user_name
                    FROM images i
                    JOIN users u ON i.user_id = u.id
                    WHERE i.id = %s""", (image_id,))
    images = cursor.fetchall()
    cursor.close()
    conn.close()
    return images


@router.get("/{image_id}/rating")
def get_image_rating(image_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            COUNT(rating) AS total_ratings,
            AVG(rating) AS average_rating
        FROM comments
        WHERE image_id = %s AND rating IS NOT NULL
    """, (image_id,))
    rating = cursor.fetchone()
    cursor.close()
    conn.close()

    return {
        "image_id": image_id,
        "total_ratings": rating["total_ratings"],
        "average_rating": round(rating["average_rating"], 2) if rating["average_rating"] else None
    }



@router.put("/{image_id}/rename")
def rename_image(image_id: int, data: ImageNameUpdate, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_image_owner_id(image_id)
    self_only(user, owner_id)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE images SET name = %s, updated_at = NOW() WHERE id = %s",
        (data.name, image_id),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Image renamed successfully"}


@router.put("/{image_id}/block")
def block_image(image_id: int, data: ImageBlockRequest, user=Depends(get_current_user)):
    
    # Only admins can block/unblock images
    admin_only(user)
    
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE images SET is_blocked = %s WHERE id = %s", (data.is_blocked, image_id))
    conn.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    
    cursor.close()
    conn.close()
    return {"message": "Image block status updated"}


@router.put("/{image_id}/public")
def public_image(image_id: int, data: ImagePublicRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_image_owner_id(image_id)
    self_only(user, owner_id)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE images SET is_public = %s WHERE id = %s",
        (data.is_public, image_id),
    )
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Image public status updated"}


@router.put("/{image_id}/assign")
def assign_image_to_album(image_id: int, data: AssignAlbumRequest, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_image_owner_id(image_id)
    self_only(user, owner_id)
    
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # אם האלבום לא קיים אצל המשתמש - חסימה
    if data.album_id:
        cursor.execute("SELECT * FROM albums WHERE id = %s AND user_id = %s", (data.album_id, user["sub"]))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=404, detail="Album not found or not owned")

    cursor.execute("UPDATE images SET album_id = %s WHERE id = %s", (data.album_id, image_id))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Image assigned to album"}


@router.delete("/{image_id}")
def delete_image(image_id: int, user=Depends(get_current_user)):
    ensure_not_blocked(user)
    owner_id = get_image_owner_id(image_id)
    self_or_admin(user, owner_id)

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM images WHERE id = %s", (image_id,))
    conn.commit()
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    
    cursor.close()
    conn.close()
    return {"message": "Image deleted successfully"}
