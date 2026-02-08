import { GoogleGenAI, Type } from "@google/genai";
import { LoveMessage } from "../types.ts";

export async function generateLoveMessage(dayName: string): Promise<LoveMessage> {
  const apiKey = (window as any).process?.env?.API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key not found. Using romantic fallbacks.");
    return getFallbackMessage(dayName);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
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
      quote: result.quote || "Love is the only reality and it is not a mere sentiment.",
      reason: result.reason || "This day celebrates the beauty of shared moments.",
      suggestion: result.suggestion || "Spend quality time together."
    };
  } catch (error) {
    console.error("Error fetching love message:", error);
    return getFallbackMessage(dayName);
  }
}

function getFallbackMessage(dayName: string): LoveMessage {
  const fallbacks: Record<string, LoveMessage> = {
    'Rose Day': {
      quote: "A rose speaks of love silently, in a language known only to the heart.",
      reason: "Roses are nature's most beautiful way to say 'I care'.",
      suggestion: "Surprise them with a single red rose."
    },
    'Propose Day': {
      quote: "Grow old with me! The best is yet to be.",
      reason: "Today is about being brave enough to share your heart.",
      suggestion: "Tell them what they truly mean to you."
    },
    'Chocolate Day': {
      quote: "All you need is love. But a little chocolate doesn't hurt.",
      reason: "Sweetness is the secret ingredient to a bond.",
      suggestion: "Gift their favorite chocolates."
    },
    'Teddy Day': {
      quote: "Sometimes all you need is a hug from a teddy bear.",
      reason: "A soft reminder that you're always there.",
      suggestion: "Gift a small cuddly teddy."
    },
    'Promise Day': {
      quote: "Promises are the unique human way of ordering the future.",
      reason: "Trust is the foundation of every love story.",
      suggestion: "Make a sincere promise for the year."
    },
    'Hug Day': {
      quote: "A hug is like a boomerang - you get it back far away.",
      reason: "Physical warmth can heal the soul.",
      suggestion: "Give a long, warm embrace."
    },
    'Kiss Day': {
      quote: "A kiss is a lovely trick to stop speech when words become superfluous.",
      reason: "The ultimate expression of intimacy.",
      suggestion: "Plan a romantic moment under the stars."
    },
    'Valentine\'s Day': {
      quote: "Love is not just looking at each other, it's looking in the same direction.",
      reason: "A day to celebrate your soul connection.",
      suggestion: "Visit the first place you ever met."
    }
  };

  return fallbacks[dayName] || {
    quote: "Love is about how much you love each other every single day.",
    reason: "Every day is a reminder of how lucky we are.",
    suggestion: "Create a handwritten note."
  };
}