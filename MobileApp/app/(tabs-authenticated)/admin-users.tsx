import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import { getAllUsers, blockUser } from "@/api/users";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { UserCard } from "@/components/UserCard"
import { PageHeader } from "@/components/PageHeader"

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
    <UserCard
      from="admin"
      name={item.name}
      email={item.email}
      role={item.role}
      is_blocked={item.is_blocked}
      is_admin={item.role === "admin"}
      newName={""} // לא רלוונטי לאדמין
      setNewName={() => {}} // לא רלוונטי לאדמין
      handleUpdateName={() => {}} // לא רלוונטי לאדמין
      handleDelete={() => {}} // לא רלוונטי לאדמין
      logout={() => {}} // לא רלוונטי לאדמין
      handleToggleBlock={handleToggleBlock}
    />
  );

  return (
    <View style={styles.container}>
      <PageHeader title="ניהול משתמשים" emoji="🛡️"/>
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
});
