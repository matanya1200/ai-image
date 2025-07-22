import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Switch,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getMyAlbums, updateAlbum } from "@/api/albums";

// Define the Album type to fix TypeScript errors
interface Album {
  id: number;
  name: string;
  is_public: boolean;
}

export default function EditAlbumScreen() {
  const { id } = useLocalSearchParams();
  const albumId = Number(id);
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAlbum();
  }, []);

  const fetchAlbum = async () => {
    try {
      const res = await getMyAlbums();
      // Fixed: Added proper typing for the album parameter
      const album = res.data.find((a: Album) => a.id === albumId);
      if (!album) {
        Alert.alert("שגיאה", "האלבום לא נמצא או שאינו שייך לך");
        router.back();
        return;
      }

      console.log(res.data)

      setName(album.name);
      setIsPublic(album.is_public);
      setLoading(false);
    } catch (error) {
      console.error("שגיאה בטעינת האלבום:", error);
      Alert.alert("שגיאה", "טעינת האלבום נכשלה");
    }
  };

  const handleUpdate = async () => {
    if (!name.trim()) {
      Alert.alert("שגיאה", "נא להכניס שם לאלבום");
      return;
    }

    try {
      await updateAlbum(albumId, name.trim(), isPublic);
      Alert.alert("הצלחה", "האלבום עודכן בהצלחה");
      router.replace("/my-albums");
    } catch (error) {
      console.error("שגיאה בעדכון:", error);
      Alert.alert("שגיאה", "עדכון האלבום נכשל");
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>טוען...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>עריכת אלבום</Text>

      <Text>שם האלבום:</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="הכנס שם חדש"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          marginBottom: 16,
          borderRadius: 6,
        }}
      />

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <Switch value={isPublic ? true : false} onValueChange={setIsPublic} />
        <Text style={{ marginLeft: 10 }}>
          {isPublic ? "פומבי" : "פרטי"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Button title="ביטול" onPress={() => router.replace("/my-albums")} />
        <Button title="עדכן" onPress={handleUpdate} />
      </View>


    </View>
  );
}