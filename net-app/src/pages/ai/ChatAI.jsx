import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { askAI, getAIHistory, clearAIHistory } from "../../api/ai";

function ChatAI() {
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [engine, setEngine] = useState("ollama"); // לצורך תצוגה בלבד

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await getAIHistory();
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await askAI(question);
      setHistory([{ question, answer: res.data.answer, timestamp: new Date() }, ...history]);
      setQuestion("");
    } catch (err) {
      console.error(err);
      setError("שגיאה בשליחת השאלה ל-AI");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearAIHistory();
      setHistory([]);
    } catch (err) {
      setError("שגיאה במחיקת היסטוריה");
    }
  };

  const handleToggleEngine = () => {
    const newEngine = engine === "ollama" ? "gemini" : "ollama";
    setEngine(newEngine);
    alert(`כעת אתה משתמש ב-${newEngine.toUpperCase()} (לצורך הדגמה בלבד, המודל האמיתי מוגדר בצד שרת)`);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="card-title mb-0">
            <i className="bi bi-chat-dots-fill me-2"></i>
            עוזר חכם AI
          </h2>
        </div>

        <div className="card-body">

          {/* כפתורי ניהול */}
          <div className="d-flex justify-content-between mb-3">
            <button className="btn btn-outline-danger" onClick={handleClearHistory}>
              <i className="bi bi-trash-fill me-1"></i> נקה היסטוריה
            </button>
            <button className="btn btn-outline-secondary" onClick={handleToggleEngine}>
              <i className="bi bi-arrow-repeat me-1"></i> החלף מנוע ({engine})
            </button>
          </div>

          {/* שאלה */}
          <div className="input-group mb-3">
            <textarea
              className="form-control"
              placeholder="כתוב שאלה ל-AI..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
            />
            <button
              className="btn btn-success"
              onClick={handleAsk}
              disabled={loading || !question.trim()}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : (
                <i className="bi bi-send-fill me-1"></i>
              )}
              שלח
            </button>
          </div>

          {/* שגיאה */}
          {error && <div className="alert alert-danger">{error}</div>}

          {/* היסטוריית שיחה */}
          <div className="mt-4">
            <h5 className="mb-3">
              <i className="bi bi-clock-history me-2"></i> היסטוריית שיחה
            </h5>

            {history.length === 0 && <p className="text-muted">אין שיחה קודמת</p>}

            {history.map((entry, index) => (
              <div key={index} className="mb-4">
                <div className="bg-light p-3 rounded border mb-1">
                  <strong>אתה:</strong> {entry.question}
                </div>
                <div className="bg-white p-3 rounded border">
                  <strong>AI:</strong> <ReactMarkdown>{entry.answer}</ReactMarkdown>
                </div>
                <div className="text-muted small text-end">
                  {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ChatAI;
