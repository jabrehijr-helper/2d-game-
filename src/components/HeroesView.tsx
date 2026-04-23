import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';
import { Sparkles, Swords, BrainCircuit, Shield } from 'lucide-react';

export default function HeroesView() {
  const { state } = useGame();

  const incomePerSec = state.heroes.reduce((acc, h) => acc + h.income, 0);

  return (
    <div className="h-full flex flex-col p-4 bg-slate-950/40 overflow-y-auto pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-white mb-1">Aether Realm</h2>
        <p className="text-slate-400 text-sm italic">Your cosmic guardians are gathering resources.</p>
      </div>

      <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl mb-6 flex justify-between items-center">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Total Production</span>
          <div className="text-2xl font-display font-bold">+{incomePerSec}/s</div>
        </div>
        <Swords className="text-slate-600" size={32} />
      </div>

      <div className="space-y-3">
        {state.heroes.map((hero) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={hero.id}
            className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                {hero.tier % 3 === 0 ? <BrainCircuit className="text-indigo-400" /> : <Shield className="text-indigo-400" />}
              </div>
              <div>
                <h4 className="font-bold text-white leading-tight">Tier {hero.tier} Guardian</h4>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Level {hero.tier * 2 + 1}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-emerald-400 font-bold">+{hero.income}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Aether/s</div>
            </div>
          </motion.div>
        ))}

        {state.heroes.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
              <Sparkles size={24} className="text-slate-600" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">The realm is empty</p>
            <p className="text-xs text-slate-600 mt-1">Merge runes to tier 4 to summon heroes</p>
          </div>
        )}
      </div>
    </div>
  );
}
