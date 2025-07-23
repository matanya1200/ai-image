import { View, TextInput, StyleSheet } from "react-native";
import {PrimaryButton} from "@/components/Button";

interface SearchBarProps {
  query: string;
  onQueryChange: (text: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export function SearchBar({
  query,
  onQueryChange,
  onSearch,
  placeholder = "חפש...",
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={query}
        onChangeText={onQueryChange}
      />
      <PrimaryButton title="🔍 חפש" onPress={onSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minWidth: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
});
