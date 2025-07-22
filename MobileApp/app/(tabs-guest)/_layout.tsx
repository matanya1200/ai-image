import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

export default function GuestLayout() {
  return (
    <Tabs>
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
