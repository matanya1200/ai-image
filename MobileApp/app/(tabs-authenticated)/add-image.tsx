import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  uploadImageFile,
  addImageByUrl,
  generateImageWithAI,
} from "@/api/images";
import { getMyProfile } from "@/api/users";
import { useRouter } from "expo-router";

export default function AddImageScreen() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [file, setFile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getMyProfile();
      setIsBlocked(res.data.is_blocked);
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לטעון פרטי משתמש");
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selected = result.assets[0];
      const localUri = selected.uri;
      const filename = localUri.split("/").pop() || "image.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      setFile({
        uri: localUri,
        name: filename,
        type,
      });

      setPreviewImage(localUri);
    }
  };

  const handleUploadFile = async () => {
    if (!name || !file) return Alert.alert("שגיאה", "הזן שם ובחר קובץ");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", {
      uri: file.uri,
      name: file.name || "image.jpg",
      type: file.type || "image/jpeg",
    } as any);

    try {
      const res = await uploadImageFile(formData);
      Alert.alert("הצלחה", "התמונה הועלתה");
      setPreviewImage(res.data.url);
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן להעלות תמונה");
    } finally {
      setFile(null);
      setName("");
      setPreviewImage("");
      setLoading(false);
      router.push(`/my-images`)
    }
  };

  const handleAddFromUrl = async () => {
    if (!name || !url) return Alert.alert("שגיאה", "הזן שם וקישור");
    setLoading(true);

    try {
      const res = await addImageByUrl(name, url);
      Alert.alert("הצלחה", "התמונה נוספה");
      setPreviewImage(res.data.url);
    } catch (err) {
      Alert.alert("שגיאה", "הקישור לא תקין או נכשל");
    } finally {
      setName("");
      setUrl("");
      setPreviewImage("");
      setLoading(false);
      router.push(`/my-images`)
    }
  };

  const handleGenerateAI = async () => {
    if (!name || !prompt) return Alert.alert("שגיאה", "הזן שם ותיאור");
    setLoading(true);

    try {
      const res = await generateImageWithAI(prompt, name);
      setPreviewImage(res.data.url);
      Alert.alert("הצלחה", "התמונה נוצרה");
    } catch (err) {
      Alert.alert("שגיאה", "שגיאה ביצירת תמונה");
    } finally {
      setName("");
      setPrompt("");
      setPreviewImage("");
      setLoading(false);
      router.push(`/my-images`)
    }
  };

  if (isBlocked) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18 }}>⛔ המשתמש שלך חסום. אין אפשרות להוסיף תמונות.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        🖼️ הוספת תמונה חדשה
      </Text>

      <TextInput
        placeholder="שם התמונה"
        value={name}
        onChangeText={setName}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />

      {/* העלאה מקובץ */}
      <Button title="בחר קובץ תמונה" onPress={handlePickImage} />
      <View style={{ height: 10 }} />
      <Button title="העלה קובץ" onPress={handleUploadFile} />

      <Text style={{ marginVertical: 10, fontWeight: "bold" }}>או:</Text>

      {/* הוספה מקישור */}
      <TextInput
        placeholder="קישור לתמונה (URL)"
        value={url}
        onChangeText={setUrl}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <Button title="הוסף מקישור" onPress={handleAddFromUrl} />

      <Text style={{ marginVertical: 10, fontWeight: "bold" }}>או:</Text>

      {/* יצירה עם AI */}
      <TextInput
        placeholder="תיאור באנגלית ליצירת תמונה"
        value={prompt}
        onChangeText={setPrompt}
        style={{
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      <Button title="צור תמונה עם AI" onPress={handleGenerateAI} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {previewImage && (
        <Image
          source={{ uri: previewImage }}
          style={{ width: "100%", height: 300, marginTop: 20 }}
          resizeMode="contain"
        />
      )}
    </ScrollView>
  );
}
