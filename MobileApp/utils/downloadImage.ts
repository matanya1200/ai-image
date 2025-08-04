import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Alert } from "react-native";

export async function downloadImageToDevice(imageUrl: string) {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("אין הרשאה", "לא ניתנה הרשאה לגשת לגלריה");
      return;
    }

    const filename = imageUrl.split("/").pop();
    const fileUri = (FileSystem.documentDirectory ?? "") + filename;

    const download = await FileSystem.downloadAsync(imageUrl, fileUri);

    const asset = await MediaLibrary.createAssetAsync(download.uri);
    await MediaLibrary.createAlbumAsync("AI Images", asset, false);

    Alert.alert("הורדה הושלמה", "התמונה נשמרה בהצלחה בגלריה");
  } catch (error) {
    console.error("שגיאה בהורדת תמונה:", error);
    Alert.alert("שגיאה", "לא ניתן להוריד את התמונה");
  }
}
