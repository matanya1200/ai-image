from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from database import get_connection
from utils.auth_utils import get_current_user
import cloudinary
import cloudinary.uploader
from utils.crypto_utils import encrypt, decrypt
import requests
from io import BytesIO

router = APIRouter(prefix="/cloudinary", tags=["Cloudinary"])

# 🧩 סכמת בקשה
class CloudinarySettingsRequest(BaseModel):
    cloud_name: str
    api_key: str
    api_secret: str 

# 🎯 שמירת/עדכון הגדרות
@router.post("/settings")
def save_cloudinary_settings(data: CloudinarySettingsRequest, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM cloudinary_settings WHERE user_id = %s", (user["sub"],))

    encrypted_secret = encrypt(data.api_secret)
    cursor.execute("""
        INSERT INTO cloudinary_settings (user_id, cloud_name, api_key, api_secret)
        VALUES (%s, %s, %s, %s)
    """, (user["sub"], data.cloud_name, data.api_key, encrypted_secret))

    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Cloudinary settings saved"}

# 🎯 קבלת הגדרות
@router.get("/settings")
def get_cloudinary_settings(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT cloud_name, api_key 
        FROM cloudinary_settings 
        WHERE user_id = %s
    """, (user["sub"],))
    result = cursor.fetchone()

    cursor.close()
    conn.close()

    if not result:
        raise HTTPException(status_code=404, detail="Settings not found")
    
    return {"cloud_name": result[0], "api_key": result[1]}

# ❌ מחיקת הגדרות
@router.delete("/settings")
def delete_cloudinary_settings(user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("DELETE FROM cloudinary_settings WHERE user_id = %s", (user["sub"],))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Settings deleted"}

# ☁️ העלאת תמונה ל-Cloudinary
class UploadImageRequest(BaseModel):
    url: str
    name: str

@router.post("/upload")
def upload_to_cloudinary(data: UploadImageRequest, user=Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT cloud_name, api_key, api_secret FROM cloudinary_settings WHERE user_id = %s", (user["sub"],))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if not result:
        raise HTTPException(status_code=400, detail="Cloudinary credentials not found")

    cloud_name, api_key, encrypted_secret = result
    api_secret = decrypt(encrypted_secret)

    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret
    )

    try:
        response = requests.get(data.url)
        response.raise_for_status()
        image_data = BytesIO(response.content)
        safe_name = data.name.replace(" ", "_")
        result = cloudinary.uploader.upload(image_data, public_id=safe_name)
        return {"url": result["secure_url"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
