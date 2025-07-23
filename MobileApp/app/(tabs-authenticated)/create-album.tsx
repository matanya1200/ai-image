import { View, Text, TextInput, Switch, Button, Alert, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { getMyProfile } from "@/api/users";
import { getMyImages, assignImageToAlbum } from "@/api/images";
import { createNewAlbum } from "@/api/albums";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { LogButton, PrimaryButton, CancelButton } from "@/components/Button"
import { PageHeader } from "@/components/PageHeader"
import { ImageCard } from "@/components/ImageCard";

export default function CreateAlbumScreen() {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [albumId, setAlbumId] = useState<number | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadStatus();
    }, [])
  );

  const loadStatus = async () => {
    try {
      const profile = await getMyProfile();
      setBlocked(profile.data.is_blocked);
    } catch (e) {
      Alert.alert("שגיאה", "לא ניתן לבדוק את סטטוס המשתמש");
    }
  };

  const handleCreateAlbum = async () => {
    if (!name.trim()) {
      Alert.alert("שגיאה", "יש להזין שם לאלבום");
      return;
    }
    try {
      const res = await createNewAlbum(name.trim(), isPublic);
      setAlbumId(res.data.album_id);
      const imgRes = await getMyImages();
      setImages(imgRes.data.images);
    } catch (e) {
      Alert.alert("שגיאה", "לא ניתן ליצור אלבום");
    }
  };

  const handleAssign = async (imageId: number) => {
    try {
      await assignImageToAlbum(imageId, albumId);
      Alert.alert("✅", "התמונה נוספה לאלבום");
    } catch (e) {
      Alert.alert("שגיאה", "לא ניתן להוסיף תמונה");
    }
  };

  const handlefinish = () => {
    setName("");
    setIsPublic(false);
    setAlbumId(null);
    setImages([]);
    setBlocked(false);
    router.replace("/my-albums")
  }

  if (blocked) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>המשתמש חסום. אין אפשרות ליצור אלבום.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!albumId ? (
        <>
          <PageHeader title="יצירת אלבום חדש" emoji="📁"/>
          
          <TextInput
            placeholder="שם האלבום"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <View style={styles.switchRow}>
            <Text>פומבי</Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>
          <PrimaryButton title="צור אלבום" onPress={handleCreateAlbum} />
          <View style={{ height: 10 }} />
          <CancelButton title="חזרה" onPress={() => router.back()} />
        </>
      ) : (
        <>
          <PageHeader title="הוספת תמונות לאלבום"/>
          <View style={styles.grid}>
            {images.map((img) => (
              <ImageCard key = {img.id}
              from="add-images-to-album"
              id={img.id}
              url={img.url}
              name={img.name}
              user_name={img.user_name}
              is_blocked={img.is_blocked}
              is_public={img.is_public}
              album_id={img.album_id}
              isAdmin={false}
              handleAssign={handleAssign}
            />
            ))}
          </View>
          <View style={{ marginTop: 20 }}>
            <LogButton
              title="סיום"
              onPress={() => handlefinish()}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  }
});
