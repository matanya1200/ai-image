import api from "./api";

// 1. יצירת אלבום חדש
export const createNewAlbum = (name, isPublic) =>
  api.post("/albums/", { name, is_public: isPublic });

// 2. מחיקת אלבום של המשתמש
export const deleteAlbum = (albumId) =>
  api.delete(`/albums/${albumId}`);

// 3. עדכון שם או public/private
export const updateAlbum = (albumId, name, isPublic) =>
  api.put(`/albums/${albumId}`, { name, is_public: isPublic });

// 4. קבלת כל האלבומים של המשתמש הנוכחי
export const getMyAlbums = () => 
  api.get("/albums/me");

// 5. קבלת כל האלבומים הפומביים
export const getPublicAlbums = () => 
  api.get("/albums/public");

// 6. חיפוש אלבומים לפי שם (פומביים בלבד)
export const searchPublicAlbumsByName = (query) =>
  api.get(`/albums/search?query=${query}`);

// 7. קבלת כל התמונות הפומביות באלבום מסוים
export const getPublicImagesInAlbum = (albumId) =>
  api.get(`/albums/${albumId}/images/public`);

// 8. קבלת כל התמונות באלבום (אם זה של המשתמש עצמו)
export const getAllImagesInAlbum = (albumId) =>
  api.get(`/albums/${albumId}/images`);

// 9. חסימת אלבום (למנהל)
export const blockAlbum = (albumId, isBlocked) =>
  api.put(`/albums/${albumId}/block`, { is_blocked: isBlocked });
