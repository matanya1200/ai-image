import { useState } from "react";
import { Text, ScrollView, Alert } from "react-native";
import { getBlockedPublicImages, blockImage } from "@/api/images";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ImageCard } from "@/components/ImageCard";
import { PageHeader } from "@/components/PageHeader";

export default function BlockedImagesAdmin() {
  const [images, setImages] = useState<any[]>([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchBlockedImages();
    }, [])
  );

  const fetchBlockedImages = async () => {
    try {
      const res = await getBlockedPublicImages();
      setImages(res.data.images || []);
    } catch (err) {
      Alert.alert("שגיאה", "שגיאה בטעינת תמונות");
    }
  };

  const handleUnblock = async (id: number) => {
    try {
      await blockImage(id, false);
      fetchBlockedImages();
    } catch (err) {
      Alert.alert("שגיאה", "לא הצלחנו לשחרר את התמונה");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <PageHeader title="תמונות פומביות חסומות" emoji="🛑"/>

      {images.length === 0 ? (
        <Text>אין תמונות חסומות.</Text>
      ) : (
        images.map((img) => (
          <ImageCard key = {img.id}
            from="blockedImages"
            id={img.id}
            url={img.url}
            name={img.name}
            user_name={img.user_name}
            is_blocked={img.is_blocked}
            is_public={img.is_public}
            album_id={img.album_id}
            isAdmin={true}
          />
        ))
      )}
    </ScrollView>
  );
}
