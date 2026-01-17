import { GoogleGenerativeAI } from "@google/generative-ai";
import { HealthMetrics } from "../types";

// Initialize the API
// Note: In a real app, you should proxy this through a backend or use strict controls.
// Ideally, the key should be loaded from import.meta.env.VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

const FALLBACK_QUOTES = [
  "大道至简，顺其自然。今日数据虽有波动，但亦是修行的一部分。（师尊闭关中）",
  "流水不腐，户枢不蠹。坚持每日修炼，道心自会稳固。（网络波动）",
  "静能生慧。若心浮气躁，不妨暂缓修炼，入定调息。（API 限流）",
  "千里之行，始于足下。灵气积累非一日之功，切勿急躁。（师尊神游太虚）",
  "万物皆有律，身心亦如是。顺应身体节律，方得长生。（天机暂时蒙蔽）"
];

export const AICoachService = {
  async getMasterAdvice(metrics: HealthMetrics): Promise<string> {
    if (!API_KEY) {
      return "道友，请先在 .env.local 中配置 GEMINI_API_KEY，方可聆听师尊教诲。";
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        You are a wise Taoist Master (师尊) guiding a cultivator (the user) in their fitness journey (Daoist Cultivation).
        Analyze the following health metrics and give brief, mystical but practical advice in Chinese (max 50 words).
        
        Metrics:
        - Heart Rate: ${metrics.heartRate} bpm
        - HRV: ${metrics.hrv} ms
        - Sleep: ${metrics.sleepHours} hours
        - Daily Calories/Qi: ${metrics.calories}
        - Stress Level: ${metrics.stress}

        If stress is high (>60) or HRV low (<30), advise rest (meditation).
        If metrics are good, encourage breakthrough.
        Use terms like "Qi (气)", "Dan Tian (丹田)", "Dao Heart (道心)".
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Master is silent (API Error), using fallback:", error);
      // Return a random fallback quote
      const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
      return FALLBACK_QUOTES[randomIndex];
    }
  }
};
