import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getImageById, getImageRating } from "@/api/images";
import {
  getCommentsByImage,
  deleteComment,
} from "@/api/commits";
import { getMyProfile } from "@/api/users";

export default function ImageDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const imageId = Number(id);
  const [image, setImage] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [myId, setMyId] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    const imageRes = await getImageById(imageId);
    setImage(imageRes.data[0]);

    const ratingRes = await getImageRating(imageId);
    setRating(ratingRes.data.average_rating);

    const commentRes = await getCommentsByImage(imageId);
    setComments(commentRes.data.commits);

    const profile = await getMyProfile();
    setMyId(profile.data.id);
    setIsBlocked(profile.data.is_blocked);
  };

  const handleDelete = async (commentId: number) => {
    Alert.alert("אישור", "האם למחוק את התגובה?", [
      { text: "ביטול" },
      {
        text: "מחק",
        onPress: async () => {
          await deleteComment(commentId);
          fetchAll();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && (
        <>
          <Text style={styles.title}>{image.name}</Text>
          <Image source={{ uri: image.url }} style={styles.image} />
          <Text>מאת: {image.user_name}</Text>
          <Text>
            דירוג ממוצע: {rating ? `${rating.toFixed(1)} ⭐` : "אין דירוג"}
          </Text>
          {!isBlocked && (
            <Button
              title="💬 הוסף תגובה"
              onPress={() => router.push(`/comment/add/${imageId}`)}
            />
          )}
          {(image.is_blocked == 1) && (
            <Text>התמונה הזו חסומה</Text>
          )}
          <Text style={styles.commentHeader}>תגובות:</Text>
          {Array.isArray(comments) && comments.length === 0 && <Text>אין תגובות לתמונה זו.</Text>}
          
          {Array.isArray(comments) &&
            comments.map((c) => (
                <View key={c.id} style={styles.commentBox}>
                <Text>
                    <Text style={styles.bold}>{c.user_name}:</Text> {c.comment}
                </Text>
                <Text>⭐ {c.rating}</Text>
                {c.user_id === myId && !isBlocked && (
                    <View style={styles.buttonRow}>
                    <Button
                        title="✏️ עריכה"
                        onPress={() => router.push(`/comment/edit/${c.id}`)}
                    />
                    <Button
                        title="🗑️ מחיקה"
                        color="red"
                        onPress={() => handleDelete(c.id)}
                    />
                    </View>
                )}
                </View>
            ))}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  image: { width: "100%", height: 200, marginBottom: 10 },
  commentHeader: { fontSize: 18, marginTop: 20 },
  commentBox: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginVertical: 8,
  },
  bold: { fontWeight: "bold" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
});
