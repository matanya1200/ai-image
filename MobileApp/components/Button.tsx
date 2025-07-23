import { Pressable, Text, StyleSheet, GestureResponderEvent } from "react-native";

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
}

export function CancelButton({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.CancelButton,
        disabled && styles.CancelButton,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function PrimaryButton({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.primarydisabled,
        disabled && styles.primarydisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function DangerButton({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.dangerdisabled,
        disabled && styles.dangerdisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

export function LogButton({ title, onPress, disabled = false }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.logdisabled,
        disabled && styles.logdisabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  primarydisabled: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 20, // פחות מ-45
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1, // מאפשר התאמה בתוך שורה
  },
  CancelButton: {
    backgroundColor: "#98999aff",
    paddingVertical: 8,
    paddingHorizontal: 20, // פחות מ-45
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1, // מאפשר התאמה בתוך שורה
  },
  dangerdisabled: {
    backgroundColor: "#ff3b30",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  logdisabled: {
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});
