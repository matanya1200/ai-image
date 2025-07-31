import api from "./api";

// קבלת כל המשתמשים
export const getAllUsers = () => api.get("/users/");

// קבלת פרופיל משתמש
export const getMyProfile = () => api.get("/users/me");

// עדכון שם משתמש
export const updateMyName = (name) =>
  api.put("/users/me/name", { name });

// חסימת/שיחרור משתמש
export const blockUser = (email, isBlocked) =>
  api.put("/users/block", { email, is_blocked: isBlocked });

// מחיקת משתמש 
export const deleteMyUser = () => api.delete("/users/me");

// ✅ קבלת כל ההודעות של המשתמש המחובר
export const getAllNotifications = () => api.get("/users/notifications");

// ✅ קבלת הודעות שלא נקראו בלבד
export const getUnreadNotifications = () => api.get("/users/notifications/not_read");

// ✅ סימון הודעה כנקראה
export const markAsRead = (notificationId) =>
  api.put(`/users/notifications/${notificationId}/read`);
