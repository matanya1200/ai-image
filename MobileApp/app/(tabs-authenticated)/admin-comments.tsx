import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, Text, FlatList, Alert, StyleSheet } from "react-native";
import { getAllComments, deleteComment } from "@/api/commits";
import { CommentCard } from "@/components/CommentCard";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/PageHeader";

export default function AdminCommentsScreen() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25,
  });

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
      setPagination(res.data.pagination || {});
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
    <CommentCard
      from="admincomments"
      id={item.id}
      user_name={item.user_name}
      comment={item.comment}
      rating={item.rating}
      image_id={item.image_id}
      handleDelete={handleDelete}
    />
  );

  const nextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };


  return (
    <View style={styles.container}>
      <PageHeader title="ניהול תגובות" emoji="📝"/>
      {loading ? (
        <Text>טוען תגובות...</Text>
      ) : (
        <>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
          />
          <Pagination
            currentPage={pagination.current_page}
            totalPages={pagination.total_pages}
            onNext={nextPage}
            onPrev={prevPage}
          />  
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, marginBottom: 20 },
});
