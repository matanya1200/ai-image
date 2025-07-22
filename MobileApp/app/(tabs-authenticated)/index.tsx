import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Button,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  getPublicImages,
  searchImagesByName,
  blockImage,
} from "@/api/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function HomeScreen() {
  const [images, setImages] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25,
  });
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadImages();
      checkAdmin();
    }, [page])
  );

  const checkAdmin = async () => {
    const role = await AsyncStorage.getItem("role");
    setIsAdmin(role === "admin");
  };

  const loadImages = async () => {
    const res = await getPublicImages(page);
    setImages(res.data.images || []);
    setPagination(res.data.pagination || {});
  };

  const handleSearch = async () => {
    const res = await searchImagesByName(query, 1);
    setImages(res.data.images || []);
    setPage(1);
  };

  const handleBlock = async (imageId: number, isBlocked: boolean) => {
    await blockImage(imageId, !isBlocked);
    loadImages();
  };

  const nextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🏠 עמוד הבית - משתמש מחובר</Text>

      <TextInput
        style={styles.input}
        placeholder="חפש לפי שם"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="🔍 חפש" onPress={handleSearch} />

      <View style={styles.grid}>
        {images.map((img) => (
          <View key={img.id} style={styles.imageContainer}>
            <Pressable onPress={() => router.push(`/image/${img.id}`)}>
              <Image source={{ uri: img.url }} style={styles.image} />
              <Text style={styles.caption}>{img.name}</Text>
              <Text style={styles.user}>by {img.user_name}</Text>
            </Pressable>
            {isAdmin && (
              <Button
                title={img.is_blocked ? "שחרור" : "חסימה"}
                color={img.is_blocked ? "green" : "red"}
                onPress={() => handleBlock(img.id, img.is_blocked)}
              />
            )}
          </View>
        ))}
      </View>

      <View style={styles.pagination}>
        <Button title="◀️ קודם" onPress={prevPage} disabled={page <= 1} />
          <Text style={styles.pageText}>
            עמוד {pagination.current_page} מתוך {pagination.total_pages}
          </Text>
        <Button title="▶️ הבא" onPress={nextPage} disabled={page >= pagination.total_pages} />
      </View>    
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  imageContainer: {
    width: 160,
    margin: 10,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  caption: {
    marginTop: 5,
    fontWeight: "600",
  },
  user: {
    fontSize: 12,
    color: "#555",
  },
  pagination: { flexDirection: "row", alignItems: "center", marginTop: 20, gap: 20 },
  pageText: { fontSize: 16 },
});
