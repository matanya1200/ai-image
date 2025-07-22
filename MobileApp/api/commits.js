import api from "./api";

export const getCommentsByImage = (imageId, page = 1, limit = 25) =>
  api.get(`/commits/image/${imageId}?page=${page}&limit=${limit}`);

export const addComment = (image_id, comment, rating) =>
  api.post(`/commits/${image_id}`, { comment, rating });

export const updateComment = (commentId, comment, rating) =>
  api.put(`/commits/${commentId}`, { comment, rating });

export const deleteComment = (commentId) =>
  api.delete(`/commits/${commentId}`);

export const getAllComments = (page = 1, limit = 25) =>
  api.get(`/commits?page=${page}&limit=${limit}`);

export const getCommentByID = (commentId) =>
  api.get(`/commits/${commentId}`);
