import api from "./api";

export const generateImageWithAI = (prompt, name) =>
  api.post("/images/AIgenerate", { name, prompt });

export const uploadImageFile = (formData) =>
  api.post("/images/upload_image_file", formData ,{headers: {
        "Content-Type": "multipart/form-data",
      },});

export const addImageByUrl = (name, imageUrl) =>
  api.post("/images/add_image_by_url", { name, image_url: imageUrl });

export const getMyImages = (page = 1, limit = 25) =>
  api.get(`/images/me?page=${page}&limit=${limit}`);

export const getPublicImages = (page = 1, limit = 25) =>
  api.get(`/images/public?page=${page}&limit=${limit}`);

export const getImageById = (imageId) =>
  api.get(`/images/${imageId}`);

export const renameImage = (imageId, newName) =>
  api.put(`/images/${imageId}/rename`, { name: newName });

export const updateImagePublicStatus = (imageId, isPublic) =>
  api.put(`/images/${imageId}/public`, { is_public: isPublic });

export const blockImage = (imageId, isBlocked) =>
  api.put(`/images/${imageId}/block`, { is_blocked: isBlocked });

export const deleteImage = (imageId) =>
  api.delete(`/images/${imageId}`);

export const assignImageToAlbum = (imageId, albumId) =>
  api.put(`/images/${imageId}/assign`, { album_id: albumId });

export const searchImagesByName = (query, page = 1, limit = 25) =>
  api.get(`/images/search?query=${query}&page=${page}&limit=${limit}`);

export const getImageRating = (imageId) =>
  api.get(`/images/${imageId}/rating`);

export const getBlockedPublicImages = () =>
  api.get(`/images/blocked`);
