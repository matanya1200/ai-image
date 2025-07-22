import { useEffect, useState } from "react";
import { View, Text, Image, Button, ScrollView, Alert } from "react-native";
import { getBlockedPublicImages, blockImage } from "@/api/images";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

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
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>
        🛑 תמונות פומביות חסומות
      </Text>

      {images.length === 0 ? (
        <Text>אין תמונות חסומות.</Text>
      ) : (
        images.map((img) => (
          <View
            key={img.id}
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              padding: 10,
              marginBottom: 16,
              borderRadius: 8,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Image
              source={{ uri: img.url }}
              style={{ width: "100%", height: 200, marginBottom: 8 }}
              resizeMode="contain"
            />
            <Text style={{ fontWeight: "bold" }}>{img.name}</Text>
            <Text>📤 מאת: {img.user_name}</Text>
            <Button title="שחרר תמונה" onPress={() => handleUnblock(img.id)} />
          </View>
        ))
      )}
    </ScrollView>
  );
}
