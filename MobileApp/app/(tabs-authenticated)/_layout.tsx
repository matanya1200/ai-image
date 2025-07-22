import { Tabs, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AuthenticatedLayout() {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const role = await AsyncStorage.getItem("role");
      console.log("Role from AsyncStorage:", role); // לבדיקה
      setIsAdmin(role === "admin");
    }
    checkAuth();
  }, []);

  return (
    <Tabs>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: "בית", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen
        name="my-images" 
        options={{ 
          title: "התמונות שלי", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />

      <Tabs.Screen 
        name="add-image" 
        options={{ 
          title: "הוספת תמונה", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size} color={color} />
          )
        }} 
      />

      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: "הפרופיל שלי", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          )
        }} 
      />

      <Tabs.Screen 
        name="albums" 
        options={{ 
          title: "אלבומים", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          )
        }} 
      />

      <Tabs.Screen 
        name="my-albums" 
        options={{ 
          title: "האלבומים שלי", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="folder-open" size={size} color={color} />
          )
        }} 
      />

      <Tabs.Screen 
        name="create-album" 
        options={{ 
          title: "יצירת אלבום", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={size} color={color} />
          )
        }} 
      />
      
      {/* טאבי מנהל */}
      <Tabs.Screen 
        name="admin-users" 
        options={{ 
          title: "ניהול משתמשים", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people" size={size} color={color} />
          ),
          href: isAdmin ? "/admin-users" : null
        }} 
      />
      
      <Tabs.Screen 
        name="admin-comments" 
        options={{ 
          title: "ניהול תגובות", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          href: isAdmin ? "/admin-comments" : null
        }} 
      />

      <Tabs.Screen 
        name="blocked-images" 
        options={{ 
          title: "ניהול תמונות חסומות", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield" size={size} color={color} />
            // או: <Ionicons name="ban" size={size} color={color} />
          ),
          href: isAdmin ? "/blocked-images" : null
        }} 
      />
    </Tabs>
  );
}