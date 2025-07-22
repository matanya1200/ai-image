import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");

      setIsLoggedIn(!!token);
      setIsAdmin(role === "admin");

      // מסכים שמחייבים התחברות
      const protectedRoutes = [
        "/my-images",
        "/add-image",
        "/profile",
        "/my-albums",
        "/create-album",
        "/admin/users",
        "/admin/comments",
      ];

      // אם לא מחובר ונמצא במסך מוגן – העברה למסך התחברות
      if (!token && protectedRoutes.some((route) => pathname.startsWith(route))) {
        router.replace("/(tabs-guest)/login");
      }
    };

    checkAuth();
  }, [pathname]);

  return (
    <Stack>
      {isLoggedIn ? (
        <Stack.Screen
          name="(tabs-authenticated)"
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="(tabs-guest)"
          options={{ headerShown: false }}
        />
      )}
    </Stack>
  );
}
