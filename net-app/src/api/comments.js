import api from "./api";

// קבלת כל התגובות לתמונה לפי ID 
export const getCommentsByImage = (imageId, page = 1, limit = 25) =>
  api.get(`/commits/image/${imageId}?page=${page}&limit=${limit}`);

// הוספת תגובה חדשה לתמונה  
export const addComment = (image_id, comment, rating) =>
  api.post(`/commits/${image_id}`, {comment, rating});

// עריכת תגובה קיימת של המשתמש  
export const updateComment = (commentId, comment, rating) =>
  api.put(`/commits/${commentId}`, {comment, rating});

// מחיקת תגובה של המשתמש  
export const deleteComment = (commentId) =>
  api.delete(`/commits/${commentId}`);

// קבלת כל התגובות באתר (עבור מנהל) 
export const getAllComments = (page = 1, limit = 25) => 
  api.get(`/commits?page=${page}&limit=${limit}`);

export const getCommentByID = (commentId) => 
  api.get(`/commits/${commentId}`);
