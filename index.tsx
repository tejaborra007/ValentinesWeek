import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI, Type } from "@google/genai";

// --- Types ---
interface ValentineDay {
  id: string;
  name: string;
  date: string;
  description: string;
  imageUrl: string;
  color: string;
  icon: string;
}

interface LoveMessage {
  quote: string;
  reason: string;
  suggestion: string;
}

// --- Constants ---
const VALENTINE_DAYS: ValentineDay[] = [
  { id: 'rose-day', name: 'Rose Day', date: 'Feb 7', description: 'Share a rose to show respect and love. A single rose says a thousand words.', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800', color: 'bg-rose-500', icon: '🌹' },
  { id: 'propose-day', name: 'Propose Day', date: 'Feb 8', description: 'The perfect time to express your feelings and ask for a lifetime together.', imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800', color: 'bg-indigo-500', icon: '💍' },
  { id: 'chocolate-day', name: 'Chocolate Day', date: 'Feb 9', description: 'Sweeten your relationship with delicious treats and heartfelt gratitude.', imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=800', color: 'bg-amber-800', icon: '🍫' },
  { id: 'teddy-day', name: 'Teddy Day', date: 'Feb 10', description: 'Gift a cuddly companion to remind them of your warm presence.', imageUrl: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=800', color: 'bg-orange-400', icon: '🧸' },
  { id: 'promise-day', name: 'Promise Day', date: 'Feb 11', description: 'Commit to a future built on trust, honesty, and unwavering support.', imageUrl: 'https://images.unsplash.com/photo-1516589174184-c685eb016733?q=80&w=800', color: 'bg-pink-600', icon: '🤝' },
  { id: 'hug-day', name: 'Hug Day', date: 'Feb 12', description: 'Find comfort and warmth in a simple embrace that says everything.', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800', color: 'bg-purple-500', icon: '🤗' },
  { id: 'kiss-day', name: 'Kiss Day', date: 'Feb 13', description: 'Seal your bond with a moment of pure physical and emotional closeness.', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800', color: 'bg-red-600', icon: '💋' },
  { id: 'valentine-day', name: "Valentine's Day", date: 'Feb 14', description: 'The ultimate celebration of love and companionship across the world.', imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800', color: 'bg-red-500', icon: '❤️' }
];

// --- AI Service ---
async function generateLoveMessage(dayName: string): Promise<LoveMessage> {
  const apiKey = (window as any).process?.env?.API_KEY;
  if (!apiKey) return getFallbackMessage(dayName);

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
    return JSON.parse(response.text || '{}');
  } catch (e) { return getFallbackMessage(dayName); }
}

function getFallbackMessage(dayName: string): LoveMessage {
  const fallbacks: Record<string, LoveMessage> = {
    'Rose Day': { quote: "A rose speaks of love silently, in a language known only to the heart.", reason: "Roses are nature's way to say 'I care'.", suggestion: "Surprise them with a single red rose." },
    'Propose Day': { quote: "Grow old with me! The best is yet to be.", reason: "Today is about sharing your heart.", suggestion: "Tell them what they truly mean to you." },
    'Valentine\'s Day': { quote: "Love is not just looking at each other, it's looking in the same direction.", reason: "Celebrate your soul connection.", suggestion: "Visit the place you first met." }
  };
  return fallbacks[dayName] || { quote: "Love makes every day special.", reason: "Every moment together is a gift.", suggestion: "Write a handwritten note." };
}

// --- Components ---
const FloatingHearts: React.FC = () => {
  const hearts = useMemo(() => Array.from({ length: 15 }).map((_, i) => ({
    id: i, left: `${Math.random() * 100}%`, delay: `${Math.random() * 5}s`, duration: `${10 + Math.random() * 10}s`, size: `${15 + Math.random() * 20}px`, opacity: 0.1 + Math.random() * 0.3,
  })), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <div key={h.id} className="absolute text-pink-400 animate-float" style={{ left: h.left, bottom: '-50px', fontSize: h.size, opacity: h.opacity, animationDelay: h.delay, animationDuration: h.duration }}>❤️</div>
      ))}
    </div>
  );
};

const ValentineCard: React.FC<{ day: ValentineDay }> = ({ day }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<LoveMessage | null>(null);

  const handleFlip = async () => {
    if (!isFlipped && !aiMessage) {
      setLoading(true);
      const msg = await generateLoveMessage(day.name);
      setAiMessage(msg);
      setLoading(false);
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-[480px] perspective-1000 group cursor-pointer" onClick={handleFlip}>
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-xl rounded-3xl ${isFlipped ? 'rotate-y-180' : 'hover:rotate-y-6'}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full w-full bg-white rounded-3xl overflow-hidden border border-pink-100 flex flex-col">
            <div className="h-[60%] overflow-hidden relative">
              <img src={day.imageUrl} alt={day.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className={`absolute top-4 right-4 ${day.color} text-white px-3 py-1 rounded-full text-[10px] font-bold z-10 uppercase`}>{day.date}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 left-4 text-4xl">{day.icon}</div>
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-800 mb-2 uppercase">{day.name}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{day.description}</p>
              </div>
              <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mt-4">Tap to reveal magic</p>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className={`h-full w-full ${day.color} text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl`}>
            {loading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="text-5xl mb-4">✨</div>
                <p className="font-cursive text-xl">Writing your message...</p>
              </div>
            ) : aiMessage && (
              <div className="animate-fade-in flex flex-col h-full items-center">
                <div className="text-4xl mb-4">💖</div>
                <p className="font-cursive text-2xl mb-6">"{aiMessage.quote}"</p>
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 mb-4 w-full">
                  <p className="text-[10px] font-bold uppercase mb-1 opacity-80">Reason</p>
                  <p className="text-xs">{aiMessage.reason}</p>
                </div>
                <div className="bg-black/10 backdrop-blur-md rounded-xl p-4 w-full">
                  <p className="text-[10px] font-bold uppercase mb-1 opacity-80">Celebrate</p>
                  <p className="text-xs italic">"{aiMessage.suggestion}"</p>
                </div>
                <button className="mt-auto text-[10px] font-bold uppercase tracking-widest bg-white/20 px-4 py-2 rounded-full">Close</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-pink-50 relative">
      <FloatingHearts />
      <header className="pt-16 pb-12 px-6 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
          Eternal <span className="font-cursive text-rose-500">Valentine</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">A journey through the week of love. February 7th — 14th.</p>
      </header>
      <main className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALENTINE_DAYS.map(day => <ValentineCard key={day.id} day={day} />)}
        </div>
      </main>
      <footer className="py-12 text-center text-gray-400 text-[10px] uppercase tracking-[0.3em]">
        Made with Love & AI ❤️
      </footer>
    </div>
  );
};

// --- Render ---
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);