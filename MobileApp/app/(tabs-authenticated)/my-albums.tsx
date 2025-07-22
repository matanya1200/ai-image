import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  getMyAlbums,
  deleteAlbum,
} from "@/api/albums";
import { getMyProfile } from "@/api/users";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function MyAlbumsScreen() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchAlbums();
      fetchUserStatus();
    }, [])
  );

  const fetchAlbums = async () => {
    try {
      const res = await getMyAlbums();
      setAlbums(res.data);
    } catch (error) {
      console.error("שגיאה בקבלת האלבומים:", error);
    }
  };

  const fetchUserStatus = async () => {
    try {
      const res = await getMyProfile();
      setIsBlocked(res.data?.is_blocked);
    } catch (error) {
      console.error("שגיאה בקבלת פרטי המשתמש:", error);
    }
  };

  const handleDelete = async (albumId: number) => {
    Alert.alert("אישור", "האם למחוק את האלבום?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          await deleteAlbum(albumId);
          fetchAlbums();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>📁 האלבומים שלי</Text>

      {albums.map((album) => (
        <View
          key={album.id}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <TouchableOpacity onPress={() => router.push(`/albums/${album.id}`)}>
            <Text style={{ fontSize: 18 }}>{album.name}</Text>
          </TouchableOpacity>
          <Text>סטטוס: {album.is_public ? "פומבי" : "פרטי"}</Text>

          {!isBlocked && (
          <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
            <Button
              title="ערוך"
              onPress={() => router.push(`/albums/edit/${album.id}`)}
            />
            <Button
              title="מחק"
              color="red"
              onPress={() => handleDelete(album.id)}
            />
          </View>)}
          {(album.is_blocked == 1) && (<Text>האלבום הזה חסום</Text>)}
        </View>
      ))}

      {!isBlocked && (
        <View style={{ marginTop: 16 }}>
          <Button
            title="📁 צור אלבום חדש"
            onPress={() => router.push("/create-album")}
          />
        </View>
      )}
    </ScrollView>
  );
}
