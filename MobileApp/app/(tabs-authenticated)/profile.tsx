import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { logout } from "@/api/auth"
import {
  getMyProfile,
  updateMyName,
  deleteMyUser,
} from "@/api/users";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      setProfile(res.data);
      setNewName(res.data.name);
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לטעון את פרטי המשתמש");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("שגיאה", "יש להזין שם חדש");
      return;
    }

    try {
      await updateMyName(newName.trim());
      Alert.alert("הצלחה", "השם עודכן בהצלחה");
      loadProfile();
    } catch {
      Alert.alert("שגיאה", "לא ניתן לעדכן את השם");
    }
  };

  const handleDelete = () => {
    Alert.alert("אישור מחיקה", "האם אתה בטוח שברצונך למחוק את המשתמש?", [
      {
        text: "בטל",
        style: "cancel",
      },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteMyUser();
            await logout();
            Alert.alert("נמחק", "המשתמש נמחק");
            router.replace("/(tabs-guest)/login");
          } catch {
            Alert.alert("שגיאה", "לא ניתן למחוק את המשתמש");
          }
        },
      },
    ]);
  };

  if (loading || !profile) {
    return (
      <View style={styles.center}>
        <Text>טוען פרטים...</Text>
      </View>
    );
  }

  const isBlocked = !!profile.is_blocked;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 פרופיל משתמש</Text>
      <Text>שם נוכחי: {profile.name}</Text>
      <Text>אימייל: {profile.email}</Text>
      <Text>תפקיד: {profile.role}</Text>
      <Text style={{ color: isBlocked ? "red" : "green" }}>
        {isBlocked ? "⚠️ המשתמש חסום" : "✅ המשתמש פעיל"}
      </Text>

      <Text style={{ marginTop: 20 }}>שם חדש:</Text>
      <TextInput
        value={newName}
        onChangeText={setNewName}
        style={styles.input}
        editable={!isBlocked}
      />

      <Button
        title="עדכן שם"
        onPress={handleUpdateName}
        disabled={isBlocked}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="🗑️ מחיקת משתמש"
          color="red"
          onPress={handleDelete}
          disabled={isBlocked}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button
          title="התנתקות"
          color="red"
          onPress={logout}
          disabled={isBlocked}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 6,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
