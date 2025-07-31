import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, Alert, StyleSheet } from "react-native";
import { getAllNotifications, getUnreadNotifications, markAsRead } from "@/api/users";
import MessageCard from "@/components/MessageCard";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [onlyUnread, setOnlyUnread] = useState(false);

  const loadNotifications = async () => {
    try {
      const res = onlyUnread ? await getUnreadNotifications() : await getAllNotifications();
      setNotifications(res.data);
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לטעון הודעות");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [onlyUnread]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead(id);
      loadNotifications(); // רענון
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לסמן הודעה כנקראה");
    }
  };

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Text style={styles.title}>📬 ההודעות שלי</Text>
      <Button
        title={onlyUnread ? "הצג את כל ההודעות" : "הצג רק הודעות שלא נקראו"}
        onPress={() => setOnlyUnread((prev) => !prev)}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MessageCard
            message={item.message}
            date={item.created_at}
            is_read={item.is_read}
            onPress={() => handleMarkAsRead(item.id)}
          />
        )}
        contentContainerStyle={{ marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
