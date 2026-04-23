import React, { createContext, useContext, ReactNode } from 'react';
import { useGameState } from '../hooks/useGameState';
import { GameState } from '../types';

interface GameContextType {
  state: GameState;
  spawnRune: () => void;
  mergeRunes: (a: number, b: number) => void;
  moveRune: (a: number, b: number) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const game = useGameState();
  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
