import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet } from "react-native";
import { getPublicImages, searchImagesByName } from "@/api/images";

export default function PublicImagesScreen() {
  const [images, setImages] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25,
  });

  useEffect(() => {
    fetchImages();
  }, [page]);

  const fetchImages = async () => {
    try {
      const res = query
        ? await searchImagesByName(query, page)
        : await getPublicImages(page);

      setImages(res.data.images || []);
      setPagination(res.data.pagination || {});
    } catch (err) {
      console.error("שגיאה בקבלת תמונות", err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchImages();
  };

  const nextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🖼️ תמונות פומביות</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="חיפוש לפי שם"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="🔍 חפש" onPress={handleSearch} />
      </View>

      {images.map((img) => (
        <View key={img.id} style={styles.imageCard}>
          <Image source={{ uri: img.url }} style={styles.image} />
          <Text style={styles.imageName}>{img.name}</Text>
          <Text style={styles.author}>🧑‍🎨 {img.user_name}</Text>
        </View>
      ))}

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
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  searchContainer: { flexDirection: "row", marginBottom: 15, gap: 10 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 5,
    padding: 8, flex: 1, minWidth: 200
  },
  imageCard: {
    marginBottom: 20, alignItems: "center",
    borderWidth: 1, borderColor: "#eee", padding: 10, borderRadius: 8
  },
  image: { width: 200, height: 200, borderRadius: 10 },
  imageName: { fontWeight: "bold", marginTop: 5 },
  author: { fontStyle: "italic", color: "#555" },
  pagination: { flexDirection: "row", alignItems: "center", marginTop: 20, gap: 20 },
  pageText: { fontSize: 16 },
});
