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

      {hasSettings && (
        <Text style={styles.readonlyNotice}>
          ההגדרות הקיימות מוגנות מעריכה. למען האבטחה, יש למחוק את ההגדרות הקיימות ולהכניס פרטים חדשים.
        </Text>
      )}

      <TextInput
        placeholder={name || "Cloudinary Name"}
        value={name}
        onChangeText={setName}
        style={[styles.input, hasSettings && styles.disabledInput]}
        editable={!hasSettings}
      />
      <TextInput
        placeholder={apiKey || "Cloudinary API Key"}
        value={apiKey}
        onChangeText={setApiKey}
        style={[styles.input, hasSettings && styles.disabledInput]}
        editable={!hasSettings}
      />
      <TextInput
        placeholder={secret || "Cloudinary Secret"}
        value={secret}
        onChangeText={setSecret}
        secureTextEntry
        style={[styles.input, hasSettings && styles.disabledInput]}
        editable={!hasSettings}
      />
      {secret === "הסוד קיים אך סודי ולכן לא ניתן לצפייה" && (
        <Text style={styles.hiddenSecretText}>הסוד הקיים מוסתר מטעמי אבטחה</Text>
      )}
      <View style={{ gap: 10 }}>
        {!hasSettings ? (
          <PrimaryButton title="שמור הגדרות" onPress={handleSave} />
        ) : (
          <DangerButton title="🗑️ מחק הגדרות" onPress={handleDelete} />
        )}
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
  disabledInput: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
    color: "#999",
  },
  hiddenSecretText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 10,
  },
  readonlyNotice: {
    fontSize: 14,
    color: "#ff6b35",
    backgroundColor: "#fff3f0",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ffccb8",
  },
});
