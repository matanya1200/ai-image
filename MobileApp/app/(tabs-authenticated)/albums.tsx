import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { getPublicAlbums, searchPublicAlbumsByName, blockAlbum } from "@/api/albums";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { AlbumCard } from "@/components/AlbumCard";
import { SearchBar } from "@/components/SearchBar";
import { PageHeader } from "@/components/PageHeader";

export default function PublicAlbumsScreen() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchAlbums();
      checkAdmin();
    }, [])
  );

  const checkAdmin = async () => {
    const role = await AsyncStorage.getItem("role");
    setIsAdmin(role === "admin");
  };

  const fetchAlbums = async () => {
    const res = await getPublicAlbums();
    setAlbums(res.data || []);
  };

  const handleSearch = async () => {
    const res = await searchPublicAlbumsByName(query);
    setAlbums(res.data || []);
  };

  const handleBlock = async (albumId: number, isBlocked: boolean) => {
    await blockAlbum(albumId, !isBlocked);
    fetchAlbums();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <PageHeader title="אלבומים פומביים" emoji="📂"/>

      <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          placeholder = "חיפוש לפי שם תמונה"
        />

      <View style={styles.albumList}>
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            from="albums"
            id={album.id}
            name={album.name}
            creator_name={album.creator_name}
            isAdmin={isAdmin}
            is_blocked={album.is_blocked}
            handleBlock={handleBlock}
            handleDelete={() => {}}
          />
        ))}
      </View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  container: { padding: 20 },
  albumList: { gap: 15, marginTop: 10 }
});
