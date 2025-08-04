import { View, TextInput, StyleSheet, Text } from "react-native";
import { PrimaryButton, DangerButton } from "@/components/Button";

interface Props {
    name: string;
    apiKey: string;
    secret: string;
    hasSettings: boolean;
    setName: (name: string) => void;
    setApiKey: (key: string) => void;
    setSecret: (secret: string) => void;
    handleSave: () => void;
    handleDelete: () => void;
}

export function CloudinarySettings({ name, apiKey, secret, hasSettings, handleSave, handleDelete, setName, setApiKey, setSecret
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>☁️ הגדרות Cloudinary</Text>

      <TextInput
        placeholder={name || "Cloudinary Name"}
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder={apiKey || "Cloudinary API Key"}
        value={apiKey}
        onChangeText={setApiKey}
        style={styles.input}
      />
      <TextInput
        placeholder={secret || "Cloudinary Secret"}
        value={secret}
        onChangeText={setSecret}
        secureTextEntry
        style={styles.input}
      />
      {secret === "הסוד קיים אך סודי ולכן לא ניתן לצפייה" && (
            <Text style={styles.hiddenSecretText}>הסוד הקיים מוסתר מטעמי אבטחה</Text> )}
      <View style={{ gap: 10 }}>
        <PrimaryButton title={hasSettings ? "עדכן הגדרות" : "שמור הגדרות"} onPress={handleSave} />
        {hasSettings && <DangerButton title="🗑️ מחק הגדרות" onPress={handleDelete} />}
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  status: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginVertical: 10,
  },
  hiddenSecretText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 10,
  },
});
