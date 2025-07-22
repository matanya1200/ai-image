import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function GuestLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#20ab57ff",
        tabBarInactiveTintColor: "#888",
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerStyle: {
          backgroundColor: "#000000ff",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#42b33eff",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ 
          title: "עמוד הבית", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ) }}
      />
      <Tabs.Screen
        name="albums"
        options={{ 
          title: "אלבומים", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="albums" size={size} color={color} />
          ) }}
      />
      <Tabs.Screen
        name="login"
        options={{ 
          title: "התחברות", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-in" size={size} color={color} />
          ) }}
      />
      <Tabs.Screen
        name="register"
        options={{ 
          title: "הרשמה", 
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-add-outline" size={size} color={color} />
          ) }}
      />
    </Tabs>
  );
}
