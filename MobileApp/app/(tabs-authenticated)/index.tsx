import { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { getPublicImages, searchImagesByName, blockImage } from "@/api/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ImageCard } from "@/components/ImageCard";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/SearchBar";
import { PageHeader } from "@/components/PageHeader";

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
      <PageHeader title="עמוד הבית" emoji="🏠"/>

      <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          placeholder = "חיפוש לפי שם תמונה"
        />

      <View style={styles.grid}>
        {images.map((img) => (
          <ImageCard key = {img.id}
            from="index"
            id={img.id}
            url={img.url}
            name={img.name}
            user_name={img.user_name}
            is_blocked={img.is_blocked}
            is_public={img.is_public}
            album_id={img.album_id}
            isAdmin={isAdmin}
            handleBlock={handleBlock}
          />
        ))}
      </View>

      <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onNext={nextPage}
          onPrev={prevPage}
        />  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
});
