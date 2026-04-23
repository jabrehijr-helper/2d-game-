/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Board from './components/Board';
import HeroesView from './components/HeroesView';
import QuestsView from './components/QuestsView';
import SplashScreen from './components/SplashScreen';
import { TopBar } from './components/TopBar';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Swords, ListTodo } from 'lucide-react';
import { useGame } from './context/GameContext';

export type Tab = 'merge' | 'heroes' | 'quests';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('merge');
  const { resetGame } = useGame();

  if (!hasStarted) {
    return <SplashScreen onStart={() => setHasStarted(true)} />;
  }

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-slate-950 font-sans text-slate-100 flex flex-col">
      <TopBar onReset={resetGame} onNewGame={resetGame} />
      
      {/* Background Stars */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity }}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <Star size={Math.random() * 3 + 1} fill="white" className="text-white" />
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'merge' && (
            <motion.div
              key="merge"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <Board />
            </motion.div>
          )}
          {activeTab === 'heroes' && (
            <motion.div
              key="heroes"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <HeroesView />
            </motion.div>
          )}
          {activeTab === 'quests' && (
            <motion.div
              key="quests"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <QuestsView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="relative z-20 h-20 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/50 flex items-center justify-around px-6 pb-2">
        <button 
          onClick={() => setActiveTab('merge')}
          className={`flex flex-col items-center transition-all ${activeTab === 'merge' ? 'text-sky-400 scale-110' : 'text-slate-500'}`}
        >
          <div className={`p-2 rounded-xl mb-1 ${activeTab === 'merge' ? 'bg-sky-400/10' : ''}`}>
            <Star size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Merge</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('heroes')}
          className={`flex flex-col items-center transition-all ${activeTab === 'heroes' ? 'text-purple-400 scale-110' : 'text-slate-500'}`}
        >
          <div className={`p-2 rounded-xl mb-1 ${activeTab === 'heroes' ? 'bg-purple-400/10' : ''}`}>
            <Swords size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Heroes</span>
        </button>

        <button 
          onClick={() => setActiveTab('quests')}
          className={`flex flex-col items-center transition-all ${activeTab === 'quests' ? 'text-emerald-400 scale-110' : 'text-slate-500'}`}
        >
          <div className={`p-2 rounded-xl mb-1 ${activeTab === 'quests' ? 'bg-emerald-400/10' : ''}`}>
            <ListTodo size={24} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tighter">Quests</span>
        </button>
      </nav>
    </div>
  );
}
