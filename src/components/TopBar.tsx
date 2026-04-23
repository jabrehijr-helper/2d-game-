import React, { useState } from 'react';
import { MoreVertical, Volume2, VolumeX, LogIn, RotateCcw, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { audioManager } from '../lib/audio';

interface TopBarProps {
  onReset: () => void;
  onNewGame: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onReset, onNewGame }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMute = () => {
    const newMute = !isMuted;
    setIsMuted(newMute);
    audioManager.init();
    audioManager.setMute(newMute);
    if (!newMute) audioManager.startBGM();
  };

  return (
    <div className="relative z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
      <button 
        onClick={toggleMute}
        className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
      >
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="text-sky-400" />}
      </button>

      <h1 className="text-lg font-display font-bold tracking-widest text-slate-100 uppercase">
        Aether <span className="text-sky-500">Merge</span>
      </h1>

      <div className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <MoreVertical size={20} />
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden shadow-black/50"
            >
              <div className="p-2 flex flex-col space-y-1">
                <button 
                  onClick={() => { setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 text-sm font-bold text-slate-300 transition-colors"
                >
                  <LogIn size={18} className="text-sky-400" />
                  <span>Sign In</span>
                </button>
                <button 
                  onClick={() => { onNewGame(); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-800 text-sm font-bold text-slate-300 transition-colors"
                >
                  <Plus size={18} className="text-emerald-400" />
                  <span>New Game</span>
                </button>
                <button 
                  onClick={() => { onReset(); setIsMenuOpen(false); }}
                  className="flex items-center space-x-3 p-3 rounded-xl hover:bg-red-950/30 text-sm font-bold text-red-400 transition-colors border-t border-slate-800 mt-1"
                >
                  <RotateCcw size={18} />
                  <span>Reset Data</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
