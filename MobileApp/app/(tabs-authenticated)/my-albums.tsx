import { useState } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { getMyAlbums, deleteAlbum } from "@/api/albums";
import { getMyProfile } from "@/api/users";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { AlbumCard } from "@/components/AlbumCard"
import { PrimaryButton } from "@/components/Button"
import { PageHeader } from "@/components/PageHeader"

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
      <PageHeader title="האלבומים שלי" emoji="📁"/>

      {albums.map((album) => (
        <AlbumCard
          key={album.id}
          from="my-albums"
          id={album.id}
          name={album.name}
          creator_name=""
          isAdmin={false}
          is_blocked={album.is_blocked}
          is_public={album.is_public}
          userBlocked={isBlocked}
          handleBlock={() => {}}
          handleDelete={handleDelete}
        />
      ))}

      {!isBlocked && (
        <View style={{ marginTop: 16 }}>
          <PrimaryButton
            title="📁 צור אלבום חדש"
            onPress={() => router.push("/create-album")}
          />
        </View>
      )}
    </ScrollView>
  );
}
