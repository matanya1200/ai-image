import { View, Pressable, Text, StyleSheet } from "react-native";
import { PrimaryButton, DangerButton } from "@/components/Button";
import { useRouter } from "expo-router";

interface Props {
  from: "albums" | "my-albums" | "albums-public";
  id: number;
  name: string;
  creator_name: string;
  isAdmin: boolean;
  is_blocked: boolean;
  is_public?: boolean;
  userBlocked?: boolean;
  handleBlock: (id: number, is_blocked: boolean) => void;
  handleDelete: (id: number) => void;
}

export function AlbumCard({
  from,
  id,
  name,
  creator_name,
  isAdmin,
  is_blocked,
  handleBlock,
  is_public,
  userBlocked,
  handleDelete,
}: Props) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Pressable onPress={() => router.push(`/albums/${id}`)}>
        <Text style={styles.albumName}>📁 {name}</Text>
        {(from === "albums" || from === "albums-public") && <Text style={styles.albumUser}>👤 {creator_name}</Text>}
        {from === "my-albums" && (
          <Text style={styles.status}>סטטוס: {is_public ? "פומבי" : "פרטי"}</Text>
        )}
      </Pressable>

      {/* Admin actions */}
      {from === "albums" && isAdmin && (
        <View style={styles.buttonRow}>
          <DangerButton
            title={"חסימה"}
            onPress={() => handleBlock(id, is_blocked)}
          />
        </View>
      )}

      {/* Owner actions */}
      {from === "my-albums" && (!userBlocked) && (
        <View style={styles.buttonRow}>
          <PrimaryButton
            title="✏️ ערוך"
            onPress={() => router.push(`/albums/edit/${id}`)}
          />
          <DangerButton
            title="🗑️ מחק"
            onPress={() => handleDelete(id)}
          />
        </View>
      )}

      {from === "my-albums" && Boolean(is_blocked) && (
        <Text style={styles.blocked}>האלבום הזה חסום</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minWidth: 320,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  albumName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  albumUser: {
    fontSize: 14,
    color: "#666",
  },
  status: {
    fontSize: 14,
    marginTop: 4,
    color: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 12,
    marginTop: 12,
  },
  blocked: {
    color: "red",
    marginTop: 10,
    fontWeight: "bold",
  },
});
