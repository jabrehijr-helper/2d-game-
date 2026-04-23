import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RuneType } from '../types';
import { RUNE_COLORS } from '../constants';
import { Sparkles, Diamond } from 'lucide-react';

interface RuneSlotProps {
  index: number;
  rune: { tier: number; type: RuneType; id: string } | null;
  isSelected?: boolean;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
}

export const RuneSlot: React.FC<RuneSlotProps> = ({ index, rune, isSelected, onClick, onDragStart, onDragEnd, onDrop, onDragOver }) => {
  return (
    <div 
      className={`aspect-square rounded-lg flex items-center justify-center border transition-all duration-200 relative overflow-hidden group ${
        isSelected ? 'bg-sky-500/20 border-sky-400/60 shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'bg-slate-800/40 border-slate-700/50'
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onClick={onClick}
      style={{ touchAction: 'none' }} // Prevents browser logic from delaying touch
    >
      <AnimatePresence mode="popLayout">
        {rune && (
          <motion.div
            key={rune.id}
            layoutId={rune.id}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            className={`w-full h-full flex items-center justify-center cursor-pointer active:cursor-grabbing z-10 ${isSelected ? 'scale-110' : ''}`}
          >
            <div 
              className="w-4/5 h-4/5 rounded-xl flex flex-col items-center justify-center relative shadow-xl"
              style={{ 
                backgroundColor: `${RUNE_COLORS[rune.type]}22`,
                border: `2px solid ${RUNE_COLORS[rune.type]}`
              }}
            >
              <Diamond 
                size={24} 
                style={{ color: RUNE_COLORS[rune.type] }}
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              />
              <span className="text-[10px] font-bold mt-1 text-white opacity-80">
                T{rune.tier}
              </span>
              
              {/* Particle effects for higher tiers */}
              {rune.tier >= 3 && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                     className="absolute -inset-2 opacity-30"
                   >
                     <Sparkles size={8} className="absolute top-0 left-1/2" style={{ color: RUNE_COLORS[rune.type] }} />
                     <Sparkles size={8} className="absolute bottom-0 left-1/2" style={{ color: RUNE_COLORS[rune.type] }} />
                   </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
