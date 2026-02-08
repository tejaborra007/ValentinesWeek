import React, { useState, useMemo, useRef } from 'react';
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
  { id: 'rose-day', name: 'Rose Day', date: 'Feb 7', description: 'Share a rose to show respect and love. A single rose says a thousand words.', imageUrl: './images/rose-day.jpg', color: 'bg-rose-500', icon: '🌹' },
  { id: 'propose-day', name: 'Propose Day', date: 'Feb 8', description: 'The perfect time to express your feelings and ask for a lifetime together.', imageUrl: './images/propose-day.jpg', color: 'bg-indigo-500', icon: '💍' },
  { id: 'chocolate-day', name: 'Chocolate Day', date: 'Feb 9', description: 'Sweeten your relationship with delicious treats and heartfelt gratitude.', imageUrl: './images/chocolate-day.jpg', color: 'bg-amber-800', icon: '🍫' },
  { id: 'teddy-day', name: 'Teddy Day', date: 'Feb 10', description: 'Gift a cuddly companion to remind them of your warm presence.', imageUrl: './images/teddy-day.jpg', color: 'bg-orange-400', icon: '🧸' },
  { id: 'promise-day', name: 'Promise Day', date: 'Feb 11', description: 'Commit to a future built on trust, honesty, and unwavering support.', imageUrl: './images/promise-day.jpg', color: 'bg-pink-600', icon: '🤝' },
  { id: 'hug-day', name: 'Hug Day', date: 'Feb 12', description: 'Find comfort and warmth in a simple embrace that says everything.', imageUrl: './images/hug-day.jpg', color: 'bg-purple-500', icon: '🤗' },
  { id: 'kiss-day', name: 'Kiss Day', date: 'Feb 13', description: 'Seal your bond with a moment of pure physical and emotional closeness.', imageUrl: './images/kiss-day.jpg', color: 'bg-red-600', icon: '💋' },
  { id: 'valentine-day', name: "Valentine's Day", date: 'Feb 14', description: 'The ultimate celebration of love and companionship across the world.', imageUrl: './images/valentine-day.jpg', color: 'bg-red-500', icon: '❤️' }
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

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isError, setIsError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Ensure any pending play request is resolved before pausing
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch (e) {
          // Play was already rejected, safe to proceed
        }
      }
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsError(false);
        playPromiseRef.current = audioRef.current.play();
        await playPromiseRef.current;
        setIsPlaying(true);
      } catch (e) {
        console.error("Playback failed:", e);
        setIsError(true);
        setIsPlaying(false);
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] group">
      <audio 
        ref={audioRef} 
        loop 
        preload="auto"
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" 
      />
      <button 
        onClick={toggleMusic}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(225,29,72,0.4)] transition-all duration-500 transform hover:scale-110 active:scale-95 border-2 ${
          isPlaying 
            ? 'bg-rose-500 border-rose-400 scale-105' 
            : 'bg-white/80 backdrop-blur-md border-pink-100 text-rose-500'
        } ${isError ? 'ring-2 ring-red-400' : ''}`}
      >
        {isPlaying ? (
          <div className="flex items-end space-x-1 h-6">
            <div className="w-1 bg-white rounded-full animate-[bounce_0.6s_infinite] h-3"></div>
            <div className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite] h-5"></div>
            <div className="w-1 bg-white rounded-full animate-[bounce_0.5s_infinite] h-2"></div>
            <div className="w-1 bg-white rounded-full animate-[bounce_0.7s_infinite] h-4"></div>
          </div>
        ) : (
          <span className="text-3xl">{isError ? '⚠️' : '🎵'}</span>
        )}
        
        {/* Tooltip */}
        <div className="absolute right-20 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          {isError ? "Error: Interact with page first" : (isPlaying ? "Pause Romance" : "Play Romantic Music")}
        </div>
      </button>
      
      {/* Visual pulse behind button */}
      {isPlaying && (
        <div className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-20 -z-10"></div>
      )}
    </div>
  );
};

const HuggingAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-48 overflow-visible mb-12 select-none pointer-events-none flex items-center justify-center">
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-pink-50/50 to-transparent blur-3xl opacity-50"></div>
      <div className="absolute bottom-2 left-1/4 opacity-20 transform scale-x-[-1]">🌿</div>
      <div className="absolute bottom-2 right-1/4 opacity-20">🌿</div>
      <div className="relative w-full max-w-2xl h-full overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 animate-walk-left">
          <div className="text-7xl drop-shadow-2xl animate-bob filter contrast-125">
             <span className="grayscale-[0.2]">👦</span>
          </div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 animate-walk-right">
          <div className="text-7xl drop-shadow-2xl animate-bob filter contrast-125">
            <span className="grayscale-[0.2]">👧</span>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-hug-bloom">
          <div className="text-8xl drop-shadow-[0_20px_50px_rgba(225,29,72,0.3)]">
            👩‍❤️‍👨
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="absolute text-2xl animate-burst" style={{ animationDelay: `${5 + i*0.1}s`, left: `${(i-2)*15}px` }}>❤️</div>
           ))}
        </div>
      </div>
    </div>
  );
};

const FallingHearts: React.FC = () => {
  const hearts = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 20}s`,
    duration: `${10 + Math.random() * 15}s`,
    size: `${12 + Math.random() * 24}px`,
    opacity: 0.3 + Math.random() * 0.5,
    rotation: `${Math.random() * 360}deg`,
    color: Math.random() > 0.5 ? 'text-red-500' : 'text-rose-400'
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {hearts.map((h) => (
        <div
          key={h.id}
          className={`heart-particle ${h.color}`}
          style={{
            left: h.left,
            top: '-50px',
            fontSize: h.size,
            opacity: h.opacity,
            animationDelay: h.delay,
            animationDuration: h.duration,
            transform: `rotate(${h.rotation})`
          }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

const ValentineCard: React.FC<{ day: ValentineDay }> = ({ day }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<LoveMessage | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleFlip = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.flip-button')) {
      setIsFlipped(false);
      return;
    }
    if (!isFlipped && !aiMessage) {
      setLoading(true);
      const msg = await generateLoveMessage(day.name);
      setAiMessage(msg);
      setLoading(false);
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-[520px] perspective-1000 group cursor-pointer" onClick={handleFlip}>
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : 'hover:rotate-y-6'}`}>
        {/* Front */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full w-full bg-white rounded-3xl overflow-hidden border border-pink-100 flex flex-col">
            <div className="h-[65%] overflow-hidden relative bg-gradient-to-br from-pink-50 to-white flex items-center justify-center">
              <img 
                src={imgError ? `https://placehold.co/400x600/FFF5F7/E11D48?text=${encodeURIComponent(day.name)}` : day.imageUrl} 
                alt={day.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                onError={() => setImgError(true)}
              />
              <div className={`absolute top-4 right-4 ${day.color} text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg z-20 tracking-wider`}>{day.date}</div>
              <div className="absolute bottom-4 left-4 text-4xl bg-white/90 backdrop-blur-md w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl z-20 animate-bounce-subtle">{day.icon}</div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 uppercase tracking-tight group-hover:text-pink-600 transition-colors">{day.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{day.description}</p>
              </div>
              <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-4 animate-pulse text-center">Click to open 💌</p>
            </div>
          </div>
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className={`h-full w-full ${day.color} text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden`}>
             <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-4 grid-rows-6 h-full w-full">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center text-xl">💖</div>
                ))}
              </div>
            </div>
            
            {loading ? (
              <div className="animate-pulse flex flex-col items-center">
                <div className="text-6xl mb-4">✨</div>
                <p className="font-cursive text-2xl font-bold">Creating Magic...</p>
              </div>
            ) : aiMessage && (
              <div className="animate-fade-in flex flex-col h-full items-center z-10 w-full">
                <div className="text-5xl mb-6 drop-shadow-lg">💝</div>
                <p className="font-cursive text-2xl md:text-3xl mb-6 drop-shadow-sm leading-tight">"{aiMessage.quote}"</p>
                <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 mb-4 w-full border border-white/30 shadow-lg">
                  <p className="text-[10px] font-black uppercase mb-1 opacity-90 tracking-[0.2em]">Heart's Philosophy</p>
                  <p className="text-sm font-semibold leading-normal">{aiMessage.reason}</p>
                </div>
                <div className="bg-black/10 backdrop-blur-xl rounded-2xl p-4 w-full border border-white/10 shadow-lg">
                  <p className="text-[10px] font-black uppercase mb-1 opacity-80 tracking-[0.2em]">Celebrate This Way</p>
                  <p className="text-sm italic font-medium">"{aiMessage.suggestion}"</p>
                </div>
                <button className="flip-button mt-auto py-2 px-8 rounded-full bg-white/20 border border-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/40 transition-all">Close Message</button>
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
    <div className="min-h-screen relative flex flex-col items-center">
      <div className="fixed inset-0 bg-gradient-to-br from-[#fff5f7] via-white to-[#fff0f3] -z-10" />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-100 rounded-full blur-[150px] opacity-40 -z-5 pointer-events-none" />
      
      <FallingHearts />
      <MusicPlayer />
      
      <header className="pt-24 pb-12 px-6 text-center relative z-10 w-full max-w-5xl">
        <HuggingAnimation />
        
        <div className="inline-block mb-4 px-6 py-2 rounded-full bg-white/60 backdrop-blur-md text-pink-600 text-xs font-black tracking-widest uppercase shadow-sm border border-pink-100">
          The Eight Days of Love
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">
          Eternal <span className="font-cursive text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">Valentine</span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed italic">
          "A journey through the heart's most precious moments, inspired by your love story."
        </p>
      </header>

      <main className="max-w-7xl w-full mx-auto px-6 pb-32 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {VALENTINE_DAYS.map(day => <ValentineCard key={day.id} day={day} />)}
        </div>
      </main>

      <footer className="w-full py-20 text-center border-t border-pink-100 bg-white/60 backdrop-blur-md relative z-10">
        <div className="flex justify-center space-x-4 text-3xl mb-8">
          {VALENTINE_DAYS.map(d => (
            <span key={d.id} className="hover:scale-125 transition-transform cursor-default filter drop-shadow-md">{d.icon}</span>
          ))}
        </div>
        <h2 className="text-4xl font-cursive text-rose-500 mb-4">Love is everything</h2>
        <p className="text-gray-400 text-[11px] font-black uppercase tracking-[0.5em] opacity-80">
          Crafted with Passion & Intelligence ❤️
        </p>
      </footer>
    </div>
  );
};

// --- Render ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
