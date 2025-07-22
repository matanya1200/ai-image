import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/api/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("שגיאה", "אנא הזן אימייל וסיסמה");
        return;
      }

      await login(email, password);  // זה גם שומר ב־AsyncStorage
      router.replace("/(tabs-authenticated)"); // מעבר לטאבים של משתמש
    } catch (error: any) {
      console.error("Login failed:", error);
      Alert.alert("שגיאה", "התחברות נכשלה. בדוק את הפרטים.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>התחברות</Text>

      <TextInput
        style={styles.input}
        placeholder="אימייל"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="סיסמה"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="התחבר" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
});
