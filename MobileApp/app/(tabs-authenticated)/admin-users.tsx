import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import { getAllUsers, blockUser } from "@/api/users";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function AdminUsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [])
  );

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      Alert.alert("שגיאה", "לא ניתן לטעון את המשתמשים");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (email: string, isBlocked: boolean) => {
    try {
      await blockUser(email, !isBlocked);
      fetchUsers();
    } catch {
      Alert.alert("שגיאה", "לא ניתן לעדכן את סטטוס המשתמש");
    }
  };

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <Text style={styles.email}>{item.email}</Text>
      <Text>שם: {item.name}</Text>
      <Text>תפקיד: {item.role}</Text>
      <Text
        style={{
          color: item.is_blocked ? "red" : "green",
        }}
      >
        {item.is_blocked ? "חסום ❌" : "פעיל ✅"}
      </Text>
      <Button
        title={item.is_blocked ? "שחרר משתמש" : "חסום משתמש"}
        color={item.is_blocked ? "green" : "red"}
        onPress={() => handleToggleBlock(item.email, item.is_blocked)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛡️ ניהול משתמשים</Text>
      {loading ? (
        <Text>טוען משתמשים...</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.email}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  userCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginVertical: 8,
    borderRadius: 6,
    backgroundColor: "#f9f9f9",
  },
  email: {
    fontWeight: "bold",
  },
});
