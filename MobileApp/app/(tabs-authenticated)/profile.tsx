import { View, Text, Alert, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { logout } from "@/api/auth"
import { getMyProfile, updateMyName, deleteMyUser } from "@/api/users";
import { UserCard } from "@/components/UserCard"
import { PageHeader } from "@/components/PageHeader"

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
    </View>
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
