import { View, Text, Alert, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { logout } from "@/api/auth"
import { getMyProfile, updateMyName, deleteMyUser } from "@/api/users";
import { UserCard } from "@/components/UserCard"
import { PageHeader } from "@/components/PageHeader"
import {
  getCloudinarySettings,
  saveCloudinarySettings,
  deleteCloudinarySettings,
} from "@/api/cloudinary";
import { CloudinarySettings } from "@/components/CloudinarySettings"

export default function ProfileScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [secret, setSecret] = useState("");
  const [hasSettings, setHasSettings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadProfile();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const res = await getCloudinarySettings();
      setName(res.data.cloud_name || "");
      setApiKey(res.data.api_key || "");
      if (res.data.cloud_name) setSecret("הסוד קיים אך סודי ולכן לא ניתן לצפייה");
      setHasSettings(!!res.data.cloud_name);
      console.log("Cloudinary settings loaded:", res.data);
    } catch (e) {
      console.log("אין הגדרות Cloudinary");
    }
  };

  const handleSaveCloudinary = async () => {
    try {
      await saveCloudinarySettings(name, apiKey, secret === "**********" ? undefined : secret);
      Alert.alert("הצלחה", "ההגדרות נשמרו בהצלחה");
      loadSettings();
    } catch (e) {
      Alert.alert("שגיאה", "לא ניתן לשמור את ההגדרות");
    }
  };

  const handleDeleteCloudinary = async () => {
    Alert.alert("אישור", "האם למחוק את הגדרות Cloudinary?", [
      { text: "ביטול", style: "cancel" },
      {
        text: "מחק",
        style: "destructive",
        onPress: async () => {
          await deleteCloudinarySettings();
          setName("");
          setApiKey("");
          setSecret("");
          setHasSettings(false);
        },
      },
    ]);
  };

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
    <ScrollView contentContainerStyle={styles.container}>
    <View style={styles.container}>
      <PageHeader title="הפרטים שלי"/>
      <UserCard
        from="user"
        name={profile.name}
        email={profile.email}
        role={profile.role}
        is_blocked={isBlocked}
        is_admin={profile.role === "admin"}
        newName={newName}
        handleToggleBlock={() => {}}
        setNewName={setNewName}
        handleUpdateName={handleUpdateName}
        handleDelete={handleDelete}
        logout={logout}
      />
      
      <CloudinarySettings
        name={name}
        apiKey={apiKey}
        secret={secret}
        hasSettings={hasSettings}
        setName={setName}
        setApiKey={setApiKey}
        setSecret={setSecret}
        handleSave={handleSaveCloudinary}
        handleDelete={handleDeleteCloudinary}
      />
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
