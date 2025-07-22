import { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { getAllComments, deleteComment } from "@/api/commits";

export default function AdminCommentsScreen() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useFocusEffect(
    useCallback(() => {
      fetchComments();
    }, [page])
  );

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await getAllComments(page, 25);
      setComments(res.data.commits || []);
      console.log(res.data);
    } catch {
      Alert.alert("שגיאה", "לא ניתן לטעון את התגובות");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert("אישור", "האם למחוק את התגובה?", [
      { text: "ביטול" },
      {
        text: "מחק",
        onPress: async () => {
          try {
            await deleteComment(id);
            fetchComments();
          } catch {
            Alert.alert("שגיאה", "לא ניתן למחוק את התגובה");
          }
        },
      },
    ]);
  };

  const renderComment = ({ item }: { item: any }) => (
    <View style={styles.commentBox}>
      <Text>📷 תמונה: {item.image_id}</Text>
      <Text>👤 משתמש: {item.user_name}</Text>
      <Text>💬 תגובה: {item.comment}</Text>
      <Text>⭐ דירוג: {item.rating}</Text>
      <Button title="🗑️ מחק" onPress={() => handleDelete(item.id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 ניהול תגובות</Text>
      {loading ? (
        <Text>טוען תגובות...</Text>
      ) : (
        <>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
          />
          <View style={styles.pagination}>
            <Button
              title="⬅️ קודם"
              onPress={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            />
            <Text style={{ marginHorizontal: 10 }}>עמוד {page}</Text>
            <Button
              title="הבא ➡️"
              onPress={() => setPage((p) => p + 1)}
              disabled={comments.length < 25}
            />
          </View>
        </>
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
  commentBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: "#f2f2f2",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    alignItems: "center",
  },
});
