import api from "./api";

export const askAI = (prompt) => api.post("/ai/ask", { prompt }); 
export const getAIHistory = () => api.get("/ai/history");
export const clearAIHistory = () => api.delete("/ai/clearHistory");