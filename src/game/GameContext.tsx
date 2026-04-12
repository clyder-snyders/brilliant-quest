import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AvatarId, GameState, LevelProgress } from './types';
import { loadGameState, savePlayerProfile, saveLevelProgress, hasProfile, addToLeaderboard } from './storage';
import { isValidLevelId } from './validation';

type Action =
  | { type: 'SET_SCREEN'; screen: string }
  | { type: 'SET_LEVEL'; levelId: number }
  | { type: 'SET_PROFILE'; name: string; avatar: AvatarId }
  | { type: 'SET_PRACTICE'; practice: boolean }
  | { type: 'COMPLETE_LEVEL'; levelId: number; progress: LevelProgress }
  | { type: 'RESET_PROFILE' }
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

const VALID_SCREENS = ['welcome', 'setup', 'levelMap', 'game', 'result', 'about'] as const;

function isValidScreen(screen: unknown): screen is string {
  return typeof screen === 'string' && VALID_SCREENS.includes(screen as any);
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_SCREEN': {
      if (!isValidScreen(action.screen)) {
        return { ...state, currentScreen: 'welcome' };
      }
      return { ...state, currentScreen: action.screen };
    }
    case 'SET_LEVEL': {
      const levelId = isValidLevelId(action.levelId) ? action.levelId : 1;
      return { ...state, currentLevel: levelId };
    }
    case 'SET_PROFILE': {
      const trimmedName = action.name.trim();
      if (!trimmedName || trimmedName.length > 50) return state;
      savePlayerProfile(trimmedName, action.avatar);
      return { ...state, playerName: trimmedName, avatar: action.avatar };
    }
    case 'SET_PRACTICE':
      return { ...state, practiceMode: action.practice, currentLevel: 1 };
    case 'COMPLETE_LEVEL': {
      const newProgress = saveLevelProgress(action.levelId, action.progress, { ...state.levelProgress }, state.practiceMode);
      const totalStars = Object.values(newProgress).reduce((s, p) => s + p.stars, 0);
      const totalScore = Object.values(newProgress).reduce((s, p) => s + p.bestScore, 0);
      const bestLevel = Math.max(...Object.keys(newProgress).map(Number), 0);

      // Auto-update leaderboard on every level completion
      if (!state.practiceMode && state.playerName) {
        addToLeaderboard({
          name: state.playerName,
          avatar: state.avatar,
          totalStars,
          bestLevel,
          totalScore,
        });
      }

      return { ...state, levelProgress: newProgress, totalStars };
    }
    case 'RESET_PROFILE':
      return { ...initialState, currentScreen: 'welcome' };
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

    // If profile exists, skip welcome/setup and go straight to level map
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
