import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Image,
  Pressable,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getMyProfile } from "@/api/users";
import { getMyImages, assignImageToAlbum } from "@/api/images";
import { createNewAlbum } from "@/api/albums";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

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
          <Text style={styles.title}>📁 יצירת אלבום חדש</Text>
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
          <Button title="צור אלבום" onPress={handleCreateAlbum} />
          <View style={{ marginTop: 10 }}>
            <Button title="חזרה" onPress={() => router.back()} />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>הוספת תמונות לאלבום</Text>
          {images.map((img) => (
            <View key={img.id} style={styles.imageCard}>
              <Image source={{ uri: img.url }} style={styles.image} />
              <Pressable
                style={styles.addButton}
                onPress={() => handleAssign(img.id)}
              >
                <Text style={{ color: "white" }}>➕ הוסף</Text>
              </Pressable>
            </View>
          ))}
          <View style={{ marginTop: 20 }}>
            <Button
              title="סיום"
              onPress={() => handlefinish()}
              color="green"
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
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
  },
  imageCard: {
    marginBottom: 10,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  addButton: {
    marginTop: 5,
    backgroundColor: "blue",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
});
