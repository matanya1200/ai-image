import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  getPublicAlbums,
  searchPublicAlbumsByName,
  blockAlbum,
} from "@/api/albums";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function PublicAlbumsScreen() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

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
      <Text style={styles.title}>📂 אלבומים פומביים</Text>

      <TextInput
        placeholder="חפש אלבום לפי שם"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="🔍 חפש" onPress={handleSearch} />

      <View style={styles.albumList}>
        {albums.map((album) => (
          <View key={album.id} style={styles.albumBox}>
            <Pressable onPress={() => router.push(`/albums/${album.id}`)}>
                <Text style={styles.albumName}>📁 {album.name}</Text>
                <Text style={styles.albumUser}>👤 {album.creator_name}</Text>
            </Pressable>
            {isAdmin && (
              <Button
                title={album.is_blocked ? "שחרור" : "חסימה"}
                color={album.is_blocked ? "green" : "red"}
                onPress={() => handleBlock(album.id, album.is_blocked)}
              />
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  albumList: {
    gap: 15,
    marginTop: 10,
  },
  albumBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 12,
  },
  albumName: {
    fontSize: 16,
    fontWeight: "600",
  },
  albumUser: {
    fontSize: 12,
    color: "#666",
  },
});
