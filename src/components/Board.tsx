import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { RuneSlot } from './RuneSlot';
import { GRID_SIZE } from '../constants';
import { Zap, Coins, Flame, Gem, Diamond, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Board() {
  const { state, spawnRune, mergeRunes, moveRune } = useGame();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSlotClick = (index: number) => {
    // If we click the same slot, deselect
    if (selectedIndex === index) {
      setSelectedIndex(null);
      return;
    }

    // If nothing was selected, select if slot has a rune
    if (selectedIndex === null) {
      if (state.board[index]) {
        setSelectedIndex(index);
      }
      return;
    }

    // A rune was already selected, now we handle the target
    const sourceRune = state.board[selectedIndex];
    const targetRune = state.board[index];

    if (sourceRune) {
      if (targetRune && sourceRune.tier === targetRune.tier && sourceRune.type === targetRune.type) {
        mergeRunes(selectedIndex, index);
        setSelectedIndex(null);
      } else if (!targetRune) {
        moveRune(selectedIndex, index);
        setSelectedIndex(null);
      } else {
        // Target is another rune, just switch selection
        setSelectedIndex(index);
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    setSelectedIndex(index); // Also select on drag
    e.dataTransfer.setData('text/plain', index.toString());
    
    // Create an invisible drag image or handle custom drag shadow if needed
    // Native drag is still there for PC users
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const sourceIndexString = e.dataTransfer.getData('text/plain');
    const sourceIndex = parseInt(sourceIndexString, 10);
    
    if (isNaN(sourceIndex)) return;

    const sourceRune = state.board[sourceIndex];
    const targetRune = state.board[targetIndex];

    if (sourceRune && targetRune && sourceRune.tier === targetRune.tier && sourceRune.type === targetRune.type) {
      mergeRunes(sourceIndex, targetIndex);
    } else {
      moveRune(sourceIndex, targetIndex);
    }
    setDraggedIndex(null);
    setSelectedIndex(null);
  };

  const incomePerSec = state.heroes.reduce((acc, h) => acc + h.income, 0);

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 py-2 space-y-3 select-none overflow-y-auto pb-24 touch-pan-y">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-2 shrink-0">
        <div className="bg-slate-800/80 border border-slate-700/50 p-2 rounded-2xl flex flex-col items-center">
          <div className="flex items-center space-x-1 text-sky-400 mb-0.5">
            <Coins size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Aether</span>
          </div>
          <span className="text-base font-display font-bold leading-tight">{Math.floor(state.aether).toLocaleString()}</span>
          <span className="text-[8px] text-slate-500 font-medium leading-tight">+{incomePerSec}/s</span>
        </div>
        
        <div className="bg-slate-800/80 border border-slate-700/50 p-2 rounded-2xl flex flex-col items-center relative overflow-hidden">
          <div className="flex items-center space-x-1 text-emerald-400 mb-0.5">
            <Zap size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Energy</span>
          </div>
          <span className="text-base font-display font-bold leading-tight">{state.energy}/{state.maxEnergy}</span>
          <div className="w-full bg-slate-900 h-1 mt-0.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${(state.energy / state.maxEnergy) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/80 border border-slate-700/50 p-2 rounded-2xl flex flex-col items-center">
          <div className="flex items-center space-x-1 text-red-500 mb-0.5">
            <Flame size={12} />
            <span className="text-[8px] font-bold uppercase tracking-wider">Streak</span>
          </div>
          <span className="text-base font-display font-bold leading-tight">{state.streak}D</span>
          <span className="text-[8px] text-slate-500 font-medium leading-tight">x{Math.min(7, state.streak)}</span>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-2 rounded-2xl relative shrink-0">
        <div className="grid grid-cols-6 gap-1.5 md:gap-2">
          {state.board.map((rune, i) => (
            <RuneSlot 
              key={i} 
              index={i} 
              rune={rune}
              isSelected={selectedIndex === i}
              onClick={() => handleSlotClick(i)}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </div>

      {/* Controls - Fixed reachability by using shrink-0 and manageable padding */}
      <div className="flex justify-between items-center bg-slate-800/40 p-3 rounded-2xl border border-slate-700/30 shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">Cosmic Forge</span>
          <div className="flex items-center space-x-1">
             <Gem size={14} className="text-yellow-500" />
             <span className="font-bold text-xs uppercase">LVL {state.forgeLevel}</span>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={spawnRune}
          disabled={state.aether < 10}
          className="bg-gradient-to-br from-sky-500 to-indigo-600 px-6 py-2.5 rounded-xl shadow-lg shadow-sky-900/20 font-bold flex items-center space-x-2 disabled:opacity-50 disabled:grayscale transition-all text-sm active:shadow-none"
        >
          <Diamond size={16} />
          <span>Forge Rune</span>
          <span className="text-[10px] opacity-70 ml-0.5">(10)</span>
        </motion.button>
      </div>

      {/* Aether Realm Preview (Condensed for Board) */}
      <div className="flex-1 min-h-[100px] overflow-hidden bg-slate-800/20 rounded-2xl p-3 border border-slate-700/20 relative shrink-0">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Aether Realm</h3>
          <span className="text-[8px] font-bold text-sky-400 bg-sky-950 px-1.5 py-0.5 rounded-full">
            {state.heroes.length} Active
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {state.heroes.slice(0, 4).map((hero) => (
            <div
              key={hero.id}
              className="bg-slate-800/60 p-1.5 rounded-lg flex items-center space-x-1.5 border border-slate-700/30"
            >
              <Sparkles size={10} className="text-indigo-400 shrink-0" />
              <span className="text-[9px] text-emerald-400 font-bold tracking-tight">+{hero.income}/s</span>
            </div>
          ))}
          {state.heroes.length === 0 && (
            <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest text-center w-full mt-2">Merging required to summon guardians</p>
          )}
          {state.heroes.length > 4 && (
            <div className="bg-slate-800/40 px-2 py-1 rounded-lg flex items-center border border-slate-700/20">
               <span className="text-[9px] text-slate-500 font-bold">+{state.heroes.length - 4} more</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
