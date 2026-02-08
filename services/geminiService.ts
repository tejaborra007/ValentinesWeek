import { GoogleGenAI, Type } from "@google/genai";
import { LoveMessage } from "../types";

export async function generateLoveMessage(dayName: string): Promise<LoveMessage> {
  // On public hosting like GitHub Pages, process.env.API_KEY may be undefined
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("Gemini API Key not found. Please ensure process.env.API_KEY is configured. Using romantic fallbacks.");
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
      quote: result.quote || "Love is the only reality and it is not a mere sentiment. It is the ultimate truth that lies at the heart of creation.",
      reason: result.reason || "This day celebrates the initial sparks of affection and the beauty of shared moments.",
      suggestion: result.suggestion || "Spend quality time together watching a movie or taking a walk."
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
      reason: "Roses are nature's most beautiful way to say 'I care' and 'I respect you'.",
      suggestion: "Surprise them with a single long-stemmed red rose and a handwritten note."
    },
    'Propose Day': {
      quote: "Grow old with me! The best is yet to be.",
      reason: "Today is about being brave enough to share what's hidden in your heart.",
      suggestion: "Find a quiet spot at sunset and tell them what they truly mean to you."
    },
    'Chocolate Day': {
      quote: "All you need is love. But a little chocolate now and then doesn't hurt.",
      reason: "Sweetness is the secret ingredient to a long-lasting bond.",
      suggestion: "Prepare a handmade box of their favorite chocolates."
    },
    'Teddy Day': {
      quote: "Sometimes all you need is a hug from a teddy bear.",
      reason: "A soft reminder that you're always there to provide comfort.",
      suggestion: "Gift a small teddy with a scent of your favorite perfume."
    },
    'Promise Day': {
      quote: "Promises are the unique human way of ordering the future.",
      reason: "Building trust is the foundation of every great love story.",
      suggestion: "Write down three sincere promises for the coming year."
    },
    'Hug Day': {
      quote: "A hug is like a boomerang - you get it back far away.",
      reason: "Physical warmth can heal the soul and strengthen your connection.",
      suggestion: "Give a long, warm embrace when they least expect it."
    },
    'Kiss Day': {
      quote: "A kiss is a lovely trick designed by nature to stop speech when words become superfluous.",
      reason: "The ultimate expression of physical and emotional intimacy.",
      suggestion: "Plan a romantic dinner and share a magical moment under the stars."
    },
    'Valentine\'s Day': {
      quote: "Love is not just looking at each other, it's looking in the same direction.",
      reason: "A day to celebrate the partnership and soul connection you share.",
      suggestion: "Plan a 'memory lane' date, visiting the first place you ever met."
    }
  };

  return fallbacks[dayName] || {
    quote: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
    reason: "Every day of this week is a reminder of how lucky we are to find someone special.",
    suggestion: "Create a handwritten note expressing your deepest feelings."
  };
}
