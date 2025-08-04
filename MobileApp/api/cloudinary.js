import api from "./api";

export const saveCloudinarySettings = (cloud_name, api_key, api_secret) =>
  api.post("/cloudinary/settings", { cloud_name, api_key, api_secret });
export const deleteCloudinarySettings = () => api.delete("/cloudinary/settings");
export const getCloudinarySettings = () => api.get("/cloudinary/settings");
export const uploadToCloudinary = (url, name) => api.post("/cloudinary/upload", { url, name });