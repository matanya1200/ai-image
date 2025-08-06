import api from "./api";  // Axios instance עם token

// שליחת שאלה ל-AI
export const askAI = (prompt) => 
  api.post("/ai/ask", { prompt });

// קבלת היסטוריית שיחות
export const getAIHistory = () => 
  api.get("/ai/history");

// ניקוי היסטוריית שיחות
export const clearAIHistory = () =>
   api.delete("/ai/clearHistory");
