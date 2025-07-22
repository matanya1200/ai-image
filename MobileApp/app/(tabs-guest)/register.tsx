import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { register } from "@/api/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert("שגיאה", "אנא מלא את כל השדות");
        return;
      }

      await register(name, email, password);
      Alert.alert("נרשמת בהצלחה!", "המשך להתחברות", [
        { text: "אישור", onPress: () => router.replace("/(tabs-guest)/login") },
      ]);
    } catch (error: any) {
      console.error("Register failed:", error);
      Alert.alert("שגיאה", "הרשמה נכשלה. נסה שוב.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>הרשמה</Text>

      <TextInput
        style={styles.input}
        placeholder="שם משתמש"
        value={name}
        onChangeText={setName}
      />

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

      <Button title="הירשם" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
});
