import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getPublicImagesInAlbum, getAllImagesInAlbum } from "@/api/albums";
import { getMyAlbums } from "@/api/albums";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageCard } from "@/components/ImageCard";

export default function AlbumDetailsScreen() {
  const { id } = useLocalSearchParams(); // id של האלבום מהמסלול

  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    checkOwnershipAndLoadImages();
  }, []);

  const checkOwnershipAndLoadImages = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        // אם המשתמש מחובר – נבדוק אם האלבום שלו
        const myAlbumsRes = await getMyAlbums();
        const myAlbums = myAlbumsRes.data;
        const match = myAlbums.find((a: any) => a.id.toString() === id);

        // לפי השייכות נביא את התמונות
        if (match) {
          const res = await getAllImagesInAlbum(id as string);
          setImages(res.data);
        } else {
          const res = await getPublicImagesInAlbum(id as string);
          setImages(res.data);
        }
      } else {
        // אם לא מחובר – נביא רק את הפומביות
        const res = await getPublicImagesInAlbum(id as string);
        setImages(res.data);
      }
    } catch (err) {
      console.error("שגיאה בקבלת תמונות באלבום", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📁 תמונות באלבום</Text>

      {images.length === 0 ? (
        <Text style={styles.noImages}>לא נמצאו תמונות באלבום</Text>
      ) : (
        <View style={styles.grid}>
          {images.map((img) => (
            <ImageCard key = {img.id}
            from="albumsimages"
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
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  noImages: { fontSize: 16, color: "gray", marginTop: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 }
});
