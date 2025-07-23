import { View, Text, FlatList, Button, Alert, TextInput, Modal, StyleSheet } from "react-native";
import { useState } from "react";
import { getMyImages, renameImage, updateImagePublicStatus, deleteImage, assignImageToAlbum } from "@/api/images";
import { getMyAlbums } from "@/api/albums";
import { getMyProfile } from "@/api/users";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { ImageCard } from "@/components/ImageCard";
import { Pagination } from "@/components/pagination";
import { PageHeader } from "@/components/PageHeader";

export default function MyImagesScreen() {
  const [images, setImages] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameId, setRenameId] = useState<number|null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 25,
  });

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
      setPagination(imagesRes.data.pagination || {});
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

  const nextPage = () => {
    if (page < pagination.total_pages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const renderImage = ({ item }: any) => (
    <View style={styles.card}>
      <ImageCard
        from="myImages"
        id={item.id}
        url={item.url}
        name={item.name}
        user_name={item.user_name}
        is_blocked={item.is_blocked}
        is_public={item.is_public}
        album_id={item.album_id}
        isAdmin={false}
        userBlocked={!blocked}
        albums={albums}
        handleRename={handleRename}
        handleDelete={handleDelete}
        handleTogglePublic={handleTogglePublic}
        handleAssignAlbum={handleAssignAlbum}
      />
    </View>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <PageHeader title="התמונות שלי " emoji="🖼️"/>

      <FlatList
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderImage}
        numColumns={1}
        contentContainerStyle={{ gap: 10 }}
      />

      <Pagination
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onNext={nextPage}
          onPrev={prevPage}
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
    width: "100%",
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  image: {
    width: "100%",
    height: 100,
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
