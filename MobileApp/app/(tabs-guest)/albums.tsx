import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getPublicAlbums, searchPublicAlbumsByName } from "@/api/albums";
import { AlbumCard } from "@/components/AlbumCard";
import { SearchBar } from "@/components/SearchBar";
import { PageHeader } from "@/components/PageHeader";

export default function PublicAlbumsScreen() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = query
        ? await searchPublicAlbumsByName(query)
        : await getPublicAlbums();

      setAlbums(res.data || []);
    } catch (err) {
      console.error("שגיאה בקבלת אלבומים", err);
    }
  };

  const handleSearch = () => {
    
    console.log(albums);
    fetchAlbums();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PageHeader title="אלבומים פומביים" emoji="📚" />

      <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          placeholder = "חיפוש לפי שם תמונה"
        />

      {albums.map((album) => (
        <AlbumCard
            key={album.id}
            from="albums"
            id={album.id}
            name={album.name}
            creator_name={album.creator_name}
            isAdmin={false}
            is_blocked={album.is_blocked}
            handleBlock={() => {}}
            handleDelete={() => {}}
          />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
});
