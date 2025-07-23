import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { register } from "@/api/auth";
import { PageHeader } from "@/components/PageHeader";
import { LogButton } from "@/components/Button";

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
      <PageHeader title="הרשמה"/>

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

      <View>
        <LogButton title="הירשם" onPress={handleRegister} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, justifyContent: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 5, padding: 10, marginBottom: 15 },
});
