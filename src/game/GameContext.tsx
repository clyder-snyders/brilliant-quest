import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AvatarId, GameState, LevelProgress } from './types';
import { loadGameState, savePlayerProfile, saveLevelProgress, hasProfile } from './storage';
import { isValidLevelId } from './validation';

type Action =
  | { type: 'SET_SCREEN'; screen: string }
  | { type: 'SET_LEVEL'; levelId: number }
  | { type: 'SET_PROFILE'; name: string; avatar: AvatarId }
  | { type: 'SET_PRACTICE'; practice: boolean }
  | { type: 'COMPLETE_LEVEL'; levelId: number; progress: LevelProgress }
  | { type: 'LOAD_STATE'; state: Partial<GameState> };

const initialState: GameState = {
  currentScreen: 'welcome',
  currentLevel: 1,
  playerName: '',
  avatar: 'spark',
  practiceMode: false,
  levelProgress: {},
  totalStars: 0,
  streak: 0,
  lastPlayDate: '',
};

// Valid screen names
const VALID_SCREENS = ['welcome', 'setup', 'levelMap', 'game', 'result', 'about'] as const;

function isValidScreen(screen: unknown): screen is string {
  return typeof screen === 'string' && VALID_SCREENS.includes(screen as any);
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_SCREEN': {
      if (!isValidScreen(action.screen)) {
        console.warn(`[GameContext] Invalid screen: ${action.screen}, defaulting to welcome`);
        return { ...state, currentScreen: 'welcome' };
      }
      return { ...state, currentScreen: action.screen };
    }
    case 'SET_LEVEL': {
      // Validate level ID is within valid range, default to 1 if invalid
      const levelId = isValidLevelId(action.levelId) ? action.levelId : 1;
      return { ...state, currentLevel: levelId };
    }
    case 'SET_PROFILE': {
      // Validate profile data
      const trimmedName = action.name.trim();
      if (!trimmedName || trimmedName.length > 50) {
        console.warn('[GameContext] Invalid player name, keeping previous');
        return state;
      }
      savePlayerProfile(trimmedName, action.avatar);
      return { ...state, playerName: trimmedName, avatar: action.avatar };
    }
    case 'SET_PRACTICE':
      // Reset level to 1 when entering/exiting practice mode
      return { ...state, practiceMode: action.practice, currentLevel: 1 };
    case 'COMPLETE_LEVEL': {
      // Always update state so ResultScreen can detect completion
      // saveLevelProgress accepts practiceMode to avoid saving to localStorage in practice mode
      const newProgress = saveLevelProgress(action.levelId, action.progress, { ...state.levelProgress }, state.practiceMode);
      const totalStars = Object.values(newProgress).reduce((s, p) => s + p.stars, 0);
      return { ...state, levelProgress: newProgress, totalStars };
    }
    case 'LOAD_STATE':
      return { ...state, ...action.state };
    default:
      return state;
  }
}

const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = loadGameState();
    dispatch({ type: 'LOAD_STATE', state: saved });

    // If profile exists, skip setup and go to levelMap
    if (hasProfile()) {
      setTimeout(() => {
        dispatch({ type: 'SET_SCREEN', screen: 'levelMap' });
      }, 0);
    }
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
