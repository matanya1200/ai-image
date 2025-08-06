import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { askAI, clearAIHistory, getAIHistory } from "@/api/ai";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton, DangerButton } from "@/components/Button";

export default function ChatAIScreen() {
  const [history, setHistory] = useState<any[]>([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const loadHistory = async () => {
    try {
      const res = await getAIHistory();
      setHistory(res.data);
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לטעון את ההיסטוריה");
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await askAI(question);
      setHistory(prev => [
        { question, answer: res.data.answer, timestamp: new Date().toISOString() },
        ...prev,
      ]);
      setQuestion("");
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לשלוח את השאלה");
    }
    setLoading(false);
  };

  const handleClear = async () => {
    Alert.alert(
      "מחיקת היסטוריה",
      "האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?",
      [
        { text: "ביטול", style: "cancel" },
        { text: "מחק", style: "destructive", onPress: performClear }
      ]
    );
  };

  const performClear = async () => {
    try {
      await clearAIHistory();
      setHistory([]);
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן למחוק את ההיסטוריה");
    }
  };

  // פונקציה לעיבוד הטקסט מה-AI
  const formatAIResponse = (text: string) => {
    // הסרת formatting מיותר
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '$1') // הסרת bold markdown
      .replace(/^\s*היי,.*?\.\s*/g, '') // הסרת ברכה בתחילה
      .replace(/על פי המידע שברשותי,?\s*/g, '') // הסרת ביטויים מיותרים
      .trim();
    
    return formatted;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString('he-IL')} ${date.toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <View style={styles.container}>
      <PageHeader title="שיחה עם AI" emoji="🤖" />
      
      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>שולח שאלה ל-AI...</Text>
            <Text style={styles.loadingSubtext}>אנא המתן</Text>
          </View>
        </View>
      )}
      
      <View style={[styles.inputSection, loading && styles.disabled]}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="מה תרצה לשאול?"
            value={question}
            onChangeText={setQuestion}
            style={[styles.input, loading && styles.disabledInput]}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title={loading ? "שולח..." : "שלח שאלה"} 
            onPress={handleAsk} 
            disabled={loading || !question.trim()} 
          />
          <DangerButton 
            title="🗑️ נקה היסטוריה" 
            onPress={handleClear}
            disabled={loading || history.length === 0}
          />
        </View>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateEmoji}>💬</Text>
          <Text style={styles.emptyStateTitle}>אין שיחות עדיין</Text>
          <Text style={styles.emptyStateSubtitle}>שאל משהו כדי להתחיל!</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.chatBubbleContainer}>
              {/* שאלת המשתמש */}
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{item.question}</Text>
                <Text style={styles.timestamp}>
                  {formatTimestamp(item.timestamp)}
                </Text>
              </View>
              
              {/* תשובת ה-AI */}
              <View style={styles.aiBubble}>
                <View style={styles.aiHeader}>
                  <Text style={styles.aiLabel}>🤖 AI</Text>
                </View>
                <Text style={styles.aiBubbleText}>
                  {formatAIResponse(item.answer)}
                </Text>
              </View>
            </View>
          )}
          style={styles.chatList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={!loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  inputSection: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputContainer: { 
    marginBottom: 16 
  },
  input: { 
    borderWidth: 1,
    borderColor: '#e1e5e9',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 60,
  },
  buttonContainer: {
    gap: 10
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#adb5bd',
  },
  chatList: {
    flex: 1,
  },
  chatBubbleContainer: {
    marginBottom: 20,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    maxWidth: '80%',
    marginBottom: 8,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubbleText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  timestamp: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    padding: 0,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiHeader: {
    backgroundColor: '#28a745',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  aiLabel: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiBubbleText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
    padding: 12,
  },
  
  // Loading Styles
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  loadingSubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
    color: '#999',
  },
});