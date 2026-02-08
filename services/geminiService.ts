
import { GoogleGenAI, Type } from "@google/genai";
import { LoveMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateLoveMessage(dayName: string): Promise<LoveMessage> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a romantic and poetic message for ${dayName} during Valentine's week. Provide a quote, a short reason why it's special, and a creative suggestion on how to celebrate it.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            reason: { type: Type.STRING },
            suggestion: { type: Type.STRING },
          },
          required: ["quote", "reason", "suggestion"],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    return {
      quote: result.quote || "Love is the only reality and it is not a mere sentiment. It is the ultimate truth that lies at the heart of creation.",
      reason: result.reason || "This day celebrates the initial sparks of affection and the beauty of shared moments.",
      suggestion: result.suggestion || "Spend quality time together watching a movie or taking a walk."
    };
  } catch (error) {
    console.error("Error fetching love message:", error);
    return {
      quote: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
      reason: "Every day of this week is a reminder of how lucky we are to find someone special.",
      suggestion: "Create a handwritten note expressing your deepest feelings."
    };
  }
}
