import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export const login = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  const { access_token, user_id, role } = res.data;

  await AsyncStorage.setItem("token", access_token);
  await AsyncStorage.setItem("user_id", user_id.toString());
  await AsyncStorage.setItem("role", role);

  router.replace("/"); // מרענן את ה-layout וגורם להצגת הסרגל המתאים
};

export const register = async (name, email, password) => {
  await api.post("/auth/register", { name, email, password });
  router.replace("/login");
};

export const logout = async () => {
  await api.post("/auth/logout");
  await api.delete("/ai/clearHistory"); // ניקוי היסטוריית AI בעת התנתקות
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user_id");
  await AsyncStorage.removeItem("role");
  router.replace("/(tabs-guest)/"); // חוזר ל-layout של אורח
};
