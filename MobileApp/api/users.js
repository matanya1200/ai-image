import api from "./api";

export const getAllUsers = () => api.get("/users/");
export const getMyProfile = () => api.get("/users/me");
export const updateMyName = (name) => 
    api.put("/users/me/name", { name });
export const blockUser = (email, isBlocked) =>
    api.put("/users/block", { email, is_blocked: isBlocked });
export const deleteMyUser = () => api.delete("/users/me");
export const getAllNotifications = () => api.get("/users/notifications");
export const getUnreadNotifications = () => api.get("/users/notifications/not_read");
export const markAsRead = (notificationId) =>
    api.put(`/users/notifications/${notificationId}/read`);
