import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getCommentByID, updateComment } from "@/api/commits";

export default function EditCommentScreen() {
  const { id } = useLocalSearchParams(); // commentId
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("5");
  const [imageId, setImageId] = useState<string | null>(null);

  useEffect(() => {
    const loadComment = async () => {
      try {
        const res = await getCommentByID(id as string);
        setComment(res.data.commit.comment);
        setRating(res.data.commit.rating.toString());
        setImageId(res.data.commit.image_id?.toString());
      } catch (err) {
        console.error(err);
        Alert.alert("שגיאה", "לא ניתן לטעון תגובה");
        router.back();
      }
    };

    loadComment();
  }, []);

  const handleUpdate = async () => {
    try {
      await updateComment(id as string, comment, parseInt(rating));
      Alert.alert("עודכן בהצלחה");
      router.replace(`/image/${imageId}`);
    } catch (err) {
      console.error(err);
      Alert.alert("שגיאה", "העדכון נכשל");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>✏️ עריכת תגובה</Text>

      <Text>תגובה:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        multiline
        placeholder="עדכן את התגובה"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
        }}
      />

      <Text>דירוג:</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        placeholder="1–5"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
        }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="ביטול" onPress={() => router.replace(`/image/${imageId}`)} color="gray" />
        <Button title="עדכן" onPress={handleUpdate} />
      </View>
    </View>
  );
}
