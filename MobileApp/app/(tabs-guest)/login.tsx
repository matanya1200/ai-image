import { useState } from "react";
import { View, TextInput, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { login } from "@/api/auth";
import { PageHeader } from "@/components/PageHeader";
import { LogButton } from "@/components/Button";

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
      <PageHeader title="התחברות"/>

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

      <View>
        <LogButton title="התחבר" onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
});
