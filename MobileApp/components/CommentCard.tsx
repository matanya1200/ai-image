import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton, DangerButton } from "@/components/Button";

interface Props {
  from: "imageId" | "admincomments";
  id: number;
  user_name: string;
  comment: string;
  rating: number;
  comment_user_id?: number;
  user_id?: number;
  user_blocked?: boolean;
  image_id?: number;
  handleDelete: (id: number) => void;
}

export function CommentCard({ from, id, user_name, comment, rating, comment_user_id, user_id, 
    user_blocked, image_id, handleDelete }: Props) {
  const router = useRouter();

  const canEdit =
    from === "imageId" &&
    comment_user_id === user_id &&
    user_blocked !== true;

  return (
    <View style={styles.card}>
      {image_id != null && (
        <Text style={styles.imageId}>📷 תמונה: {image_id}</Text>
      )}
      <Text style={styles.text}>
        👤 <Text style={styles.bold}>{user_name}</Text>
      </Text>
      <Text style={styles.text}>💬 {comment}</Text>
      <Text style={styles.text}>⭐ {rating}</Text>

      {from === "admincomments" && (
        <DangerButton title="🗑️ מחק" onPress={() => handleDelete(id)} />
      )}

      {canEdit && (
        <View style={styles.buttonRow}>
          <PrimaryButton
            title="✏️ עריכה"
            onPress={() => router.push(`/comment/edit/${id}`)}
          />
          <DangerButton
            title="🗑️ מחיקה"
            onPress={() => handleDelete(id)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginVertical: 8,
    width: "100%",
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  imageId: {
    fontSize: 12,
    marginBottom: 6,
    color: "#777",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
});
