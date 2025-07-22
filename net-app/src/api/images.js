import api from "./api";

// 1. יצירת תמונה בעזרת AI
export const generateImageWithAI = (prompt, name) =>
  api.post("/images/AIgenerate", { name, prompt });

// 2. העלאת תמונה מקובץ
export const uploadImageFile = (formData) =>
  api.post("/images/upload_image_file", formData);

// 3. הוספת תמונה לפי קישור URL
export const addImageByUrl = (name, imageUrl) =>
  api.post("/images/add_image_by_url", { name, image_url: imageUrl });

// 4. קבלת כל התמונות של המשתמש
export const getMyImages = (page = 1, limit = 25) =>
 api.get(`/images/me?page=${page}&limit=${limit}`);

// 5. קבלת כל התמונות הפומביות
export const getPublicImages = (page = 1, limit = 25) =>
  api.get(`/images/public?page=${page}&limit=${limit}`);

// 6. קבלת תמונה לפי מזהה (למשתמש/מנהל)
export const getImageById = (imageId) =>
  api.get(`/images/${imageId}`);

// 7. שינוי שם תמונה
export const renameImage = (imageId, newName) =>
  api.put(`/images/${imageId}/rename`, { name: newName });

// 8. שינוי public/private
export const updateImagePublicStatus = (imageId, isPublic) =>
  api.put(`/images/${imageId}/public`, { is_public: isPublic });

// 9. חסימת/שחרור תמונה (מנהל או בעלים)
export const blockImage = (imageId, isBlocked) =>
  api.put(`/images/${imageId}/block`, { is_blocked: isBlocked });

// 10. מחיקת תמונה
export const deleteImage = (imageId) =>
  api.delete(`/images/${imageId}`);

// 11. שיוך תמונה לאלבום
export const assignImageToAlbum = (imageId, albumId) =>
  api.put(`/images/${imageId}/assign`, { album_id: albumId });

// 12. חיפוש תמונות לפי שם
export const searchImagesByName = (query, page = 1, limit = 25) =>
  api.get(`/images/search?query=${query}&page=${page}&limit=${limit}`);

// 13. קבלת דירוג ממוצע לתמונה
export const getImageRating = (imageId) =>
  api.get(`/images/${imageId}/rating`);

// 14. קבלת כל התמונות הפומביות החסומות עבור מנהל 
export const getBlockedPublicImages = () =>
  api.get(`/images/blocked`);
