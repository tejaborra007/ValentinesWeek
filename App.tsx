
import React from 'react';
import { VALENTINE_DAYS } from './constants';
import ValentineCard from './components/ValentineCard';
import FloatingHearts from './components/FloatingHearts';

const App: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center">
      {/* Visual background layers */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-rose-50 -z-10" />
      <FloatingHearts />

      {/* Hero Section */}
      <header className="w-full max-w-6xl px-6 py-12 md:py-20 text-center relative z-10">
        <div className="inline-block mb-4 px-4 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-bold tracking-widest uppercase">
          Celebrate Love
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 drop-shadow-sm">
          A Week of <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600 font-cursive">Pure Romance</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Explore the journey of love from February 7th to 14th.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="#rose-day" className="px-8 py-3 bg-rose-600 text-white rounded-full font-bold shadow-lg hover:bg-rose-700 transition transform hover:-translate-y-1">
            Start the Journey
          </a>
        </div>
      </header>

      {/* Days Grid */}
      <main className="w-full max-w-7xl px-4 pb-24 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALENTINE_DAYS.map((day) => (
            <div id={day.id} key={day.id} className="scroll-mt-24">
              <ValentineCard day={day} />
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-white border-t border-pink-100 relative z-10">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center space-x-2 text-2xl mb-4">
            {VALENTINE_DAYS.map(d => <span key={d.id}>{d.icon}</span>)}
          </div>
          <h2 className="text-2xl font-cursive text-rose-500 mb-4">Love is in the air</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart."
          </p>
          <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-400 uppercase tracking-widest">
            Made with ❤️ for You
          </div>
        </div>
      </footer>

      {/* Decorative Blur Spheres */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rose-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-200 rounded-full blur-[120px] opacity-30 pointer-events-none" />
    </div>
  );
};

export default App;
