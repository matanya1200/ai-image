import api from "./api";

// שמירת הגדרות Cloudinary
export const saveCloudinarySettings = (cloud_name, api_key, api_secret) =>
  api.post("/cloudinary/settings", { cloud_name, api_key, api_secret });

// מחיקת הגדרות Cloudinary
export const deleteCloudinarySettings = () =>
  api.delete("/cloudinary/settings");

// קבלת הגדרות Cloudinary (ללא הסוד)
export const getCloudinarySettings = () =>
  api.get("/cloudinary/settings");

// העלאת תמונה ל־Cloudinary
export const uploadToCloudinary = (url, name) =>
  api.post("/cloudinary/upload", { url, name });