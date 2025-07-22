import api from "./api";

export const createNewAlbum = (name, isPublic) =>
  api.post("/albums/", { name, is_public: isPublic });

export const deleteAlbum = (albumId) =>
  api.delete(`/albums/${albumId}`);

export const updateAlbum = (albumId, name, isPublic) =>
  api.put(`/albums/${albumId}`, { name, is_public: isPublic });

export const getMyAlbums = () => api.get("/albums/me");

export const getPublicAlbums = () => api.get("/albums/public");

export const searchPublicAlbumsByName = (query) =>
  api.get(`/albums/search?query=${query}`);

export const getPublicImagesInAlbum = (albumId) =>
  api.get(`/albums/${albumId}/images/public`);

export const getAllImagesInAlbum = (albumId) =>
  api.get(`/albums/${albumId}/images`);

export const blockAlbum = (albumId, isBlocked) =>
  api.put(`/albums/${albumId}/block`, { is_blocked: isBlocked });
