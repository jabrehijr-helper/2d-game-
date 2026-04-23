export type RuneType = 'celestial' | 'void' | 'inferno' | 'abyssal' | 'arcane';

export interface Rune {
  id: string;
  tier: number;
  type: RuneType;
}

export interface Hero {
  id: string;
  name: string;
  tier: number;
  power: number;
  income: number;
  description: string;
}

export interface GameState {
  aether: number;
  energy: number;
  maxEnergy: number;
  lastLogin: number;
  streak: number;
  board: (Rune | null)[]; // Flattened for easier manipulation
  heroes: Hero[];
  forgeLevel: number;
  lastSaveAt: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
}
