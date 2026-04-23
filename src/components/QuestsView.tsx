import { ListTodo, CheckCircle2, ChevronRight, Gift } from 'lucide-react';
import { motion } from 'motion/react';

export default function QuestsView() {
  const quests = [
    { id: 1, title: "Celestial Harvester", description: "Forge 50 celestial runes", progress: 12, total: 50, reward: 500, color: "text-sky-400" },
    { id: 2, title: "Master Merger", description: "Perform 20 merges", progress: 8, total: 20, reward: 200, color: "text-purple-400" },
    { id: 3, title: "Power Surge", description: "Reach production of 100/s", progress: 45, total: 100, reward: 1000, color: "text-emerald-400" },
  ];

  return (
    <div className="h-full flex flex-col p-4 bg-slate-950/40 overflow-y-auto pb-20">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-display font-bold text-white mb-1">Cosmic Quests</h2>
          <p className="text-slate-400 text-sm italic">Complete tasks for rare rewards.</p>
        </div>
        <div className="bg-emerald-950/50 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center space-x-2">
           <Gift size={14} className="text-emerald-400" />
           <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Bonus Ready</span>
        </div>
      </div>

      <div className="space-y-4">
        {quests.map((quest) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className={`font-bold ${quest.color} leading-none mb-1`}>{quest.title}</h4>
                <p className="text-xs text-slate-400">{quest.description}</p>
              </div>
              <ChevronRight size={16} className="text-slate-700" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end text-[10px] font-bold uppercase">
                <span className="text-slate-500">Progress</span>
                <span className="text-white">{quest.progress} / {quest.total}</span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                  className={`h-full bg-slate-400 rounded-full`}
                  style={{ backgroundColor: quest.color.replace('text-', '') }}
                />
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between items-center">
               <div className="flex items-center space-x-1">
                  <CheckCircle2 size={12} className="text-slate-600" />
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Reward</span>
               </div>
               <span className="text-xs font-bold text-white tracking-widest">+{quest.reward} AETHER</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-2xl border-dashed">
         <p className="text-center text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">New quests in 14h 22m</p>
      </div>
    </div>
  );
}
