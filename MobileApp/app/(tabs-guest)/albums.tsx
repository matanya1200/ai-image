import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getPublicAlbums, searchPublicAlbumsByName } from "@/api/albums";

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
      <Text style={styles.title}>📚 אלבומים פומביים</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="חפש לפי שם אלבום"
          value={query}
          onChangeText={setQuery}
        />
        <Button title="🔍 חפש" onPress={handleSearch} />
      </View>

      {albums.map((album) => (
        <Pressable
          key={album.id}
          style={styles.albumCard}
          onPress={() => router.push(`/albums/${album.id}`)}
        >
          <Text style={styles.albumName}>📁 {album.name}</Text>
          <Text style={styles.albumOwner}>👤 {album.creator_name}</Text>
        </Pressable>
      ))}
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
  albumCard: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    width: "100%",
    backgroundColor: "#fafafa"
  },
  albumName: { fontSize: 16, fontWeight: "bold" },
  albumOwner: { fontSize: 14, color: "#555" },
  pagination: { flexDirection: "row", gap: 20, alignItems: "center", marginTop: 20 },
});
