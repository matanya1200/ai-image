import {
  View,
  Text,
  Image,
  FlatList,
  Button,
  Alert,
  TextInput,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import {
  getMyImages,
  renameImage,
  updateImagePublicStatus,
  deleteImage,
  assignImageToAlbum,
} from "@/api/images";
import { getMyAlbums } from "@/api/albums";
import { getMyProfile } from "@/api/users";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function MyImagesScreen() {
  const [images, setImages] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState<number|null>(null);
  const [page, setPage] = useState(1);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [page])
  );

  const loadData = async () => {
    try {
      const profile = await getMyProfile();
      setBlocked(profile.data.is_blocked);
      const imagesRes = await getMyImages(page);
      setImages(imagesRes.data.images);
      const albumsRes = await getMyAlbums();
      setAlbums(albumsRes.data);
    } catch (error) {
      console.error("שגיאה בטעינת הנתונים:", error);
    }
  };

  const handleRename = (imageId: number) => {
    setRenameId(imageId);
    const image = images.find((i) => i.id === imageId);
    setRenameValue(image?.name || "");
    setRenameModalVisible(true);
  };

  const submitRename = async () => {
    try {
      await renameImage(renameId, renameValue);
      setRenameModalVisible(false);
      loadData();
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לעדכן את שם התמונה");
    }
  };

  const handleDelete = async (imageId: number) => {
    Alert.alert("אישור", "האם למחוק את התמונה?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          await deleteImage(imageId);
          loadData();
        },
      },
    ]);
  };

  const handleTogglePublic = async (imageId: number, current: boolean) => {
    await updateImagePublicStatus(imageId, !current);
    loadData();
  };

  const handleAssignAlbum = async (imageId: number, albumId: string) => {
    const parsedAlbumId = albumId === "none" ? null : parseInt(albumId);
    await assignImageToAlbum(imageId, parsedAlbumId);
    loadData();
  };

  const renderImage = ({ item }: any) => (
    <View style={styles.card}>
      <Pressable onPress={() => router.push(`/image/${item.id}`)}>
        <Image source={{ uri: item.url }} style={styles.image} />
      </Pressable>
      <Text style={styles.name}>{item.name}</Text>

      {(item.is_blocked == 1) && (
        <Text style={{ color: "red", fontSize: 12 }}>התמונה חסומה</Text>
      )}

      {!blocked && (
        <>
          <Button title="📝 שינוי שם" onPress={() => handleRename(item.id)} />
          <Button
            title={item.is_public ? "הפוך לפרטי" : "הפוך לפומבי"}
            onPress={() => handleTogglePublic(item.id, item.is_public)}
          />
          <Button
            title="🗑️ מחק"
            color="red"
            onPress={() => handleDelete(item.id)}
          />

          <Text style={{ marginTop: 5 }}>שיוך לאלבום:</Text>
          <Picker
            selectedValue={item.album_id || "none"}
            onValueChange={(val) => handleAssignAlbum(item.id, val)}
            style={{ width: "100%", height: 40 }}
          >
            <Picker.Item label="כללי (ללא אלבום)" value="none" />
            {albums.map((album) => (
              <Picker.Item
                key={album.id}
                label={album.name}
                value={album.id}
              />
            ))}
          </Picker>
        </>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>🖼️ התמונות שלי</Text>

      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderImage}
        numColumns={2}
        contentContainerStyle={{ gap: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />

      {/* Rename modal */}
      <Modal visible={renameModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalInner}>
            <Text style={{ marginBottom: 10 }}>שם חדש לתמונה:</Text>
            <TextInput
              value={renameValue}
              onChangeText={setRenameValue}
              style={styles.input}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Button title="ביטול" onPress={() => setRenameModalVisible(false)} />
              <Button title="שמור" onPress={submitRename} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 6,
    marginBottom: 5,
  },
  name: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalInner: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});
