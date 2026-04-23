import React from 'react';
import { motion } from 'motion/react';
import { Play, Sparkles, Diamond } from 'lucide-react';
import { audioManager } from '../lib/audio';

interface SplashScreenProps {
  onStart: () => void;
}

export default function SplashScreen({ onStart }: SplashScreenProps) {
  const handleStart = () => {
    audioManager.init();
    audioManager.startBGM();
    onStart();
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-slate-950">
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-500/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="mb-8 relative">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.4)] border-2 border-sky-300/30"
          >
            <Diamond size={48} className="text-white drop-shadow-glow" />
          </motion.div>
          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-4 -right-4 text-sky-300"
          >
            <Sparkles size={24} />
          </motion.div>
        </div>

        <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight">
          AETHER <span className="text-sky-400">MERGE</span>
        </h1>
        <p className="text-slate-400 text-lg font-medium tracking-widest uppercase mb-12 opacity-80">
          Merge. Summon. Rule the Cosmos.
        </p>

        <motion.button
          whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(56, 189, 248, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="group relative px-12 py-4 bg-white text-slate-950 rounded-2xl font-bold text-xl flex items-center space-x-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          <Play fill="currentColor" size={24} className="group-hover:translate-x-1 transition-transform" />
          <span>START GAME</span>
        </motion.button>

        <div className="mt-16 grid grid-cols-3 gap-8">
           <div className="flex flex-col items-center opacity-40">
             <div className="text-xl font-bold text-white">150+</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Heroes</div>
           </div>
           <div className="flex flex-col items-center opacity-40">
             <div className="text-xl font-bold text-white">∞</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Merges</div>
           </div>
           <div className="flex flex-col items-center opacity-40">
             <div className="text-xl font-bold text-white">24h</div>
             <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Idle</div>
           </div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-8 text-[10px] font-bold text-slate-700 tracking-[0.3em] uppercase">
        Ver 1.0.0 • Developed by AI Studio
      </div>
    </div>
  );
}
