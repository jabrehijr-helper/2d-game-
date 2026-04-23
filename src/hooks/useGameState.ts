import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Rune, Hero, RuneType } from '../types';
import { GRID_SIZE, INITIAL_ENERGY, RUNE_TYPES, RUNE_SPAWN_COST } from '../constants';
import { audioManager } from '../lib/audio';

const SAVE_KEY = 'aether_merge_save_v1';

export function useGameState() {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - (parsed.lastSaveAt || now)) / 1000);
      const incomePerSec = parsed.heroes?.reduce((acc: number, h: Hero) => acc + h.income, 0) || 0;
      const offlineAether = incomePerSec * elapsedSeconds;
      
      return {
        ...parsed,
        aether: parsed.aether + Math.min(offlineAether, 100000), 
        lastSaveAt: now
      };
    }

    return getInitialState();
  });

  function getInitialState(): GameState {
    return {
      aether: 100,
      energy: INITIAL_ENERGY,
      maxEnergy: INITIAL_ENERGY,
      lastLogin: Date.now(),
      streak: 1,
      board: Array(GRID_SIZE.ROWS * GRID_SIZE.COLS).fill(null),
      heroes: [],
      forgeLevel: 1,
      lastSaveAt: Date.now()
    };
  }

  const resetGame = useCallback(() => {
    setState(getInitialState());
    localStorage.removeItem(SAVE_KEY);
  }, []);

  // Auto-save
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  // Passive Income Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const incomeValue = prev.heroes.reduce((acc, h) => acc + h.income, 0);
        return {
          ...prev,
          aether: prev.aether + incomeValue,
          lastSaveAt: Date.now()
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const spawnRune = useCallback(() => {
    if (state.aether < RUNE_SPAWN_COST) return;
    
    audioManager.init();
    audioManager.playForge();
    
    setState(prev => {
      const emptyIndices = prev.board.map((v, i) => v === null ? i : null).filter(v => v !== null) as number[];
      if (emptyIndices.length === 0) return prev;

      const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
      const newRune: Rune = {
        id: Math.random().toString(36).substr(2, 9),
        tier: 1,
        type: RUNE_TYPES[Math.floor(Math.random() * RUNE_TYPES.length)]
      };

      const newBoard = [...prev.board];
      newBoard[randomIndex] = newRune;

      return {
        ...prev,
        aether: prev.aether - RUNE_SPAWN_COST,
        board: newBoard
      };
    });
  }, [state.aether]);

  const mergeRunes = useCallback((indexA: number, indexB: number) => {
    if (indexA === indexB) return;
    
    setState(prev => {
      const runeA = prev.board[indexA];
      const runeB = prev.board[indexB];

      if (!runeA || !runeB || runeA.tier !== runeB.tier || runeA.type !== runeB.type) return prev;

      audioManager.init();
      audioManager.playMerge(runeB.tier);

      const newBoard = [...prev.board];
      newBoard[indexA] = null;
      
      const upgradedRune: Rune = {
        ...runeB,
        tier: runeB.tier + 1,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      newBoard[indexB] = upgradedRune;

      let newHeroes = [...prev.heroes];
      if (upgradedRune.tier >= 4 && Math.random() > 0.6) {
         const newHero: Hero = {
           id: Math.random().toString(36).substr(2, 9),
           name: `Cosmic Scout T${upgradedRune.tier}`,
           tier: upgradedRune.tier,
           power: upgradedRune.tier * 10,
           income: Math.pow(2, upgradedRune.tier - 1),
           description: "A cosmic guardian summoned through high-tier merging."
         };
         newHeroes.push(newHero);
      }

      return {
        ...prev,
        board: newBoard,
        heroes: newHeroes,
        aether: prev.aether + (upgradedRune.tier * 5 * prev.streak)
      };
    });
  }, []);

  const moveRune = useCallback((fromIndex: number, toIndex: number) => {
    setState(prev => {
      if (prev.board[toIndex] !== null) return prev; // Don't move to occupied slot
      
      const newBoard = [...prev.board];
      newBoard[toIndex] = newBoard[fromIndex];
      newBoard[fromIndex] = null;
      
      return { ...prev, board: newBoard };
    });
  }, []);

  return {
    state,
    spawnRune,
    mergeRunes,
    moveRune,
    resetGame
  };
}
