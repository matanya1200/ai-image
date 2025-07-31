import { View, Text, StyleSheet, Pressable } from "react-native";

type Props = {
  message: string;
  date: string;
  is_read: boolean;
  onPress?: () => void;
};

export default function MessageCard({ message, date, is_read, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, is_read ? styles.readCard : styles.unreadCard]}
    >
      <Text
        style={[styles.message, !is_read && styles.unreadMessage]}
      >
        {message}
      </Text>
      <Text style={styles.date}>
        {new Date(date).toLocaleString()}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  readCard: {
    backgroundColor: "#f1f1f1", // אפור רגיל
  },
  unreadCard: {
    backgroundColor: "#dbeafe", // כחול בהיר — לציון הודעה חדשה
  },
  message: {
    fontSize: 16,
    marginBottom: 6,
  },
  unreadMessage: {
    fontWeight: "bold", // טקסט בולט להודעות שלא נקראו
  },
  date: {
    fontSize: 12,
    color: "#555",
    textAlign: "right",
  },
});
