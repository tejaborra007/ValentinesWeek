import React, { useState } from 'react';
import { ValentineDay, LoveMessage } from '../types.ts';
import { generateLoveMessage } from '../services/geminiService.ts';

interface Props {
  day: ValentineDay;
}

const ValentineCard: React.FC<Props> = ({ day }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(true);
  const [aiMessage, setAiMessage] = useState<LoveMessage | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleFlip = async (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.back-btn')) {
      setIsFlipped(false);
      return;
    }

    if (!isFlipped && !aiMessage) {
      setLoading(true);
      const message = await generateLoveMessage(day.name);
      setAiMessage(message);
      setLoading(false);
    }
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="w-full h-[520px] perspective-1000 group cursor-pointer" 
      onClick={handleFlip}
    >
      <div className={`relative w-full h-full transition-all duration-700 preserve-3d shadow-2xl rounded-3xl ${isFlipped ? 'rotate-y-180' : 'hover:rotate-y-6 hover:rotate-x-2'}`}>
        
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden">
          <div className="h-full w-full bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/40 flex flex-col shadow-inner">
            <div className="h-[65%] overflow-hidden relative bg-gray-100">
              {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-pink-50">
                  <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
                </div>
              )}
              <img 
                src={imgError ? `https://placehold.co/400x600/FFF5F7/E11D48?text=${encodeURIComponent(day.name)}` : day.imageUrl} 
                alt={day.name} 
                onLoad={() => setImgLoading(false)}
                onError={() => {
                  setImgError(true);
                  setImgLoading(false);
                }}
                className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
              />
              <div className={`absolute top-4 right-4 ${day.color} text-white px-4 py-1.5 rounded-full text-xs font-black shadow-lg z-20 tracking-wider`}>
                {day.date}
              </div>
              <div className="absolute bottom-4 left-4 text-4xl bg-white/90 backdrop-blur-md w-14 h-14 flex items-center justify-center rounded-2xl shadow-xl z-20 animate-bounce-subtle">
                {day.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>
            
            <div className="p-6 flex flex-col justify-between flex-grow">
              <div>
                <h3 className="text-2xl font-black text-gray-800 mb-2 group-hover:text-pink-600 transition-colors uppercase tracking-tight">{day.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{day.description}</p>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${day.color} w-full opacity-30`}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Click to reveal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          <div className={`h-full w-full ${day.color} text-white rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden shadow-2xl`}>
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="grid grid-cols-5 grid-rows-8 h-full w-full">
                {Array.from({ length: 40 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-center text-2xl rotate-12">✨</div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">💝</div>
                </div>
                <p className="text-2xl font-cursive font-bold">Whispering to AI...</p>
              </div>
            ) : aiMessage ? (
              <div className="z-10 animate-fade-in flex flex-col h-full w-full items-center">
                <div className="text-6xl mb-6 drop-shadow-2xl animate-bounce-subtle">💖</div>
                <p className="font-cursive text-3xl mb-8 leading-tight px-2 drop-shadow-sm">
                  "{aiMessage.quote}"
                </p>
                
                <div className="space-y-4 w-full">
                  <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 shadow-lg transform transition-all hover:scale-105">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-white/90">Heart's Philosophy</h4>
                    <p className="text-sm font-semibold leading-relaxed">{aiMessage.reason}</p>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg transform transition-all hover:scale-105">
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] mb-2 text-white/80">Celebrate Like This</h4>
                    <p className="text-sm italic leading-relaxed">"{aiMessage.suggestion}"</p>
                  </div>
                </div>

                <button 
                   className="back-btn mt-auto py-2 px-6 rounded-full bg-white/20 border border-white/40 text-xs font-black uppercase tracking-widest hover:bg-white/40 transition-all active:scale-90"
                >
                  Flip Back
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValentineCard;