export type Direction = 'up' | 'down' | 'left' | 'right';

export type TileType = 0 | 1 | 2 | 3 | 4 | 5;
// 0=empty, 1=wall, 2=goal, 3=start, 4=special-blue, 5=bonus

export interface LevelData {
  id: number;
  name: string;
  zone: 1 | 2 | 3 | 4;
  gridSize: 6 | 8 | 10 | 12;
  grid: TileType[][];
  robotStart: { x: number; y: number; direction: Direction };
  parTime: number;
  parCommands: number;
  availableCommands: string[];
  maxCommands: number;
  hint: string;
  conceptTaught: string;
}

export interface LevelProgress {
  completed: boolean;
  stars: number;
  bestScore: number;
  bestTime: number;
}

export type AvatarId = 'spark' | 'nova' | 'bolt' | 'pixel' | 'orbit' | 'ghost';

export interface GameState {
  currentScreen: string;
  currentLevel: number;
  playerName: string;
  avatar: AvatarId;
  practiceMode: boolean;
  levelProgress: Record<number, LevelProgress>;
  totalStars: number;
  streak: number;
  lastPlayDate: string;
}

export interface LeaderboardEntry {
  name: string;
  avatar: AvatarId;
  totalStars: number;
  bestLevel: number;
  totalScore: number;
}
