import { RuneType } from './types';

export const GRID_SIZE = {
  ROWS: 8,
  COLS: 6
};

export const INITIAL_ENERGY = 100;
export const ENERGY_REGEN_TIME = 240000; // 4 minutes per energy, 400 mins for full (roughly 6.6 hours)

export const RUNE_TYPES: RuneType[] = ['celestial', 'void', 'inferno', 'abyssal', 'arcane'];

export const RUNE_COLORS: Record<RuneType, string> = {
  celestial: '#38bdf8', // sky-400
  void: '#a855f7',      // purple-500
  inferno: '#f87171',   // red-400
  abyssal: '#10b981',   // emerald-500
  arcane: '#facc15'     // yellow-400
};

export const HERO_NAMES = [
  "Aether Knight", "Void Seer", "Solar Warden", "Lunar Herald",
  "Cosmic Entity", "Star Drifter", "Galactic Monarch", "Nebula Weaver"
];

export const FORGE_UPGRADE_BASE_COST = 500;
export const RUNE_SPAWN_COST = 10;
