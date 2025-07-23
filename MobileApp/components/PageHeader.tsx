import { Text, StyleSheet, View } from "react-native";

interface PageHeaderProps {
  title: string;
  emoji?: string;
}

export function PageHeader({ title, emoji }: PageHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {emoji && `${emoji} `}{title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
});
