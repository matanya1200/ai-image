import { View, Text, Button, StyleSheet } from "react-native";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}: PaginationProps) {
  return (
    <View style={styles.container}>
      <Button
        title="◀️ קודם"
        onPress={onPrev}
        disabled={currentPage <= 1}
      />
      <Text style={styles.pageText}>
        עמוד {currentPage} מתוך {totalPages}
      </Text>
      <Button
        title="▶️ הבא"
        onPress={onNext}
        disabled={currentPage >= totalPages}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    justifyContent: "center",
  },
  pageText: {
    fontSize: 16,
    color: "#333",
  },
});
