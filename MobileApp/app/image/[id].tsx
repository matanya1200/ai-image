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
import { ImageCard } from "@/components/ImageCard";
import { CommentCard } from "@/components/CommentCard";
import { Pagination } from "@/components/pagination";
import { PrimaryButton } from "@/components/Button";

export default function ImageDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const imageId = Number(id);
  const [image, setImage] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [myId, setMyId] = useState<number | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25,
  });

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
    setPagination(commentRes.data.pagination || {});

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

  const nextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {image && (
        <>
          <ImageCard
            from="imageDetails"
            id={image.id}
            url={image.url}
            name={image.name}
            user_name={image.user_name}
            is_blocked={image.is_blocked}
            is_public={image.is_public}
            album_id={image.album_id}
            isAdmin={false}
            rating={rating}
          />

          {!isBlocked && (
            <PrimaryButton
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
                  <CommentCard
                    from="imageId"
                    id={c.id}
                    comment_user_id={c.user_id}
                    user_id={myId ?? undefined}
                    user_name={c.user_name}
                    comment={c.comment}
                    rating={c.rating}
                    user_blocked={isBlocked}
                    handleDelete={handleDelete}
                  />
                </View>
            ))}
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              onNext={nextPage}
              onPrev={prevPage}
            />  
        </>
      )}
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
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
