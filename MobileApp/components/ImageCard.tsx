import { Image, StyleSheet, Text, View, Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DangerButton, PrimaryButton } from "@/components/Button";
import { useRouter } from "expo-router";

interface ImageCardProps {
  from: "index" | "imageDetails" | "myImages" | "guestIndex" | "albumsimages" | "blockedImages" | "add-images-to-album";
  id: number;
  url: string;
  name: string;
  user_name?: string;
  is_blocked: boolean;
  is_public: boolean;
  album_id?: number;
  isAdmin: boolean;
  rating?: number|null;
  userBlocked?: boolean;
  albums?: any[];
  handleBlock?: (id: number, is_blocked: boolean) => void;
  handleRename?: (id: number) => void;
  handleDelete?: (id: number) => void;
  handleTogglePublic?: (id: number, is_public: boolean) => void;
  handleAssignAlbum?: (id: number, val: string) => void;
  handleAssign?: (id:number) => void;
}

export function ImageCard({
  from,
  id,
  url,
  name,
  user_name,
  is_blocked,
  is_public,
  album_id = -1,
  isAdmin,
  rating,
  userBlocked = false,
  albums = [],
  handleBlock,
  handleRename,
  handleDelete,
  handleTogglePublic,
  handleAssignAlbum,
  handleAssign
}: ImageCardProps) {
  const router = useRouter();
  const currentAlbumName =
  album_id && album_id !== -1
    ? albums.find((a) => a.id === album_id)?.name || "לא ידוע"
    : "כללי (ללא אלבום)";
  return (
      <View key={id} style={styles.card}>
        <Pressable onPress={() => {
          if (from !== "guestIndex" && from !== "imageDetails" && from !== "albumsimages") {
            router.push(`/image/${id}`);
          }
        }}>
          <Image source={{ uri: url }} style={styles.image} />
        </Pressable>
        <Text style={styles.name}>🖼️ {name}</Text>
        {(user_name != null) && <Text style={styles.creator}>🧑‍🎨 {user_name}</Text>}

        {/* index.tsx */}
        {from === "index" && isAdmin && (
          <DangerButton
            title={"חסימה"}
            onPress={() => handleBlock?.(id, is_blocked)}
          />
        )}

        {/* create-album.tsx */}
        {(from === "add-images-to-album") && (
          <PrimaryButton
            title={"הוסף"}
            onPress={() => handleAssign?.(id)}
          />
        )}

        {/* blockedImages.tsx */}
        {from === "blockedImages" && isAdmin && (
          <PrimaryButton
            title={"שחרר"}
            onPress={() => handleBlock?.(id, is_blocked)}
          />
        )}

        {/* image/[id].tsx */}
        {from === "imageDetails" && (
          <Text style={styles.rating}>
            דירוג ממוצע: {rating ? `${rating.toFixed(1)} ⭐` : "אין דירוג"}
          </Text>
        )}

        {/* myImages.tsx */}
        {from === "myImages" && (
          <>
            {(is_blocked == true)  && (
              <Text style={styles.blockedText}>⚠️ התמונה חסומה</Text>
            )}

            {userBlocked && (
              <>
                <View style={styles.buttonRow}>
                  <PrimaryButton
                    title="📝 שינוי שם"
                    onPress={() => handleRename?.(id)}
                  />
                  <PrimaryButton
                    title={is_public ? "הפוך לפרטי" : "הפוך לפומבי"}
                    onPress={() => handleTogglePublic?.(id, is_public)}
                  />
                </View>
                <DangerButton
                  title="🗑️ מחק"
                  onPress={() => handleDelete?.(id)}
                />
                <Text style={styles.albumLabel}>שיוך לאלבום: {currentAlbumName}</Text>
                <Picker
                  selectedValue={album_id}
                  onValueChange={(val) => handleAssignAlbum?.(id, val.toString())}
                  style={styles.picker}
                >
                  <Picker.Item label="כללי (ללא אלבום)" value="none" />
                  {albums.map((album) => (
                    <Picker.Item
                      key={album.id}
                      label={album.name}
                      value={album.id}
                    />
                  ))}
                </Picker>
              </>
            )}
          </>
        )}
      </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 12,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#212121",
  },
  creator: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  rating: {
    marginTop: 6,
    fontSize: 14,
    color: "#333",
  },
  blockedText: {
    marginTop: 6,
    fontSize: 13,
    color: "red",
  },
  albumLabel: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#267625ff",
  },
  picker: {
    width: "100%",
    height: 40,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
});
