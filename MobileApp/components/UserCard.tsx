import { View, TextInput, StyleSheet, Text } from "react-native";
import { PrimaryButton, DangerButton } from "@/components/Button";

interface Props {
  from: "admin" | "user";
  name: string;
  email: string;
  role: string;
  is_blocked: boolean;
  is_admin: boolean;
  newName: string;
  handleToggleBlock: (email: string, is_blocked: boolean) => void;
  setNewName: (name: string) => void;
  handleUpdateName: () => void;
  handleDelete: () => void;
  logout: () => void;
}

export function UserCard({
  from,
  name,
  email,
  role,
  is_blocked,
  is_admin,
  newName,
  handleToggleBlock,
  setNewName,
  handleUpdateName,
  handleDelete,
  logout,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>שם: {name}</Text>
      <Text style={styles.label}>תפקיד: {role}</Text>
      <Text style={styles.label}>מייל: {email}</Text>
      <Text style={[styles.status, { color: is_blocked ? "red" : "green" }]}>
        {is_blocked ? "❌ חסום" : "✅ פעיל"}
      </Text>

      {/* Admin actions */}
      {from === "admin" && (
        <View style={styles.buttons}>
          {role !== "admin" ? (
            (is_blocked ?
              <PrimaryButton
                title={"שחרר משתמש"}
                onPress={() => handleToggleBlock(email, is_blocked)}
              />:
              <DangerButton
                title={"חסום משתמש"}
                onPress={() => handleToggleBlock(email, is_blocked)}
              />
            )
          ) : (
            <Text style={{ color: "gray" }}>אי אפשר לחסום מנהל</Text>
          )}
        </View>
      )}

      {/* User profile actions */}
      {from === "user" && (
        <View style={styles.buttons}>
          <Text style={{ marginTop: 16 }}>שם חדש:</Text>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
            editable={!is_blocked}
          />
          <PrimaryButton
            title="עדכן שם"
            onPress={handleUpdateName}
            disabled={is_blocked}
          />
          <DangerButton
            title="🗑️ מחיקת משתמש"
            onPress={handleDelete}
            disabled={is_blocked}
          />
          <DangerButton
            title="🚪 התנתקות"
            onPress={logout}
            disabled={is_blocked}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  buttons: {
    marginTop: 10,
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginVertical: 10,
  },
});
