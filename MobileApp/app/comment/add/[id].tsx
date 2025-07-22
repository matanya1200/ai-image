import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { addComment } from "@/api/commits";

export default function AddCommentScreen() {
  const { id } = useLocalSearchParams(); // imageId
  const router = useRouter();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("5");

  const handleSubmit = async () => {
    try {
      await addComment(id as string, comment, parseInt(rating));
      Alert.alert("✅", "התגובה נוספה בהצלחה");
      router.replace(`/image/${id}`);
    } catch (err) {
      console.error(err);
      Alert.alert("שגיאה", "אירעה שגיאה בעת שליחת התגובה");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>✏️ הוסף תגובה</Text>

      <Text>תגובה:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        placeholder="כתוב תגובה כאן"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
        }}
        multiline
      />

      <Text>דירוג:</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="בחר דירוג (1 עד 5)"
      />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Button title="🚫 ביטול" onPress={handleCancel} color="gray" />
        <Button title="💬 הוסף תגובה" onPress={handleSubmit} />
      </View>
    </View>
  );
}
