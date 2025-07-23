import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, ScrollView, StyleSheet } from "react-native";
import { getPublicImages, searchImagesByName } from "@/api/images";
import { ImageCard } from "@/components/ImageCard";
import { Pagination } from "@/components/pagination";
import { SearchBar } from "@/components/SearchBar";
import { PageHeader } from "@/components/PageHeader";

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
      <PageHeader title="תמונות פומביות" emoji="🖼️" />

      <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          placeholder = "חיפוש לפי שם תמונה"
        />
      
      <View style={styles.grid}>
        {images.map((img) => (
          <ImageCard key = {img.id}
              from="guestIndex"
              id={img.id}
              url={img.url}
              name={img.name}
              user_name={img.user_name}
              is_blocked={img.is_blocked}
              is_public={img.is_public}
              album_id={img.album_id}
              isAdmin={false}
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
