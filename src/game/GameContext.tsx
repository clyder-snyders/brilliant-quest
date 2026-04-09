import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AvatarId, GameState, LevelProgress } from './types';
import { loadGameState, savePlayerProfile, saveLevelProgress } from './storage';

type Action =
  | { type: 'SET_SCREEN'; screen: string }
  | { type: 'SET_LEVEL'; level: number }
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

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'SET_SCREEN':
      return { ...state, currentScreen: action.screen };
    case 'SET_LEVEL':
      return { ...state, currentLevel: action.level };
    case 'SET_PROFILE':
      savePlayerProfile(action.name, action.avatar);
      return { ...state, playerName: action.name, avatar: action.avatar };
    case 'SET_PRACTICE':
      return { ...state, practiceMode: action.practice };
    case 'COMPLETE_LEVEL': {
      if (state.practiceMode) return state;
      const newProgress = saveLevelProgress(action.levelId, action.progress, { ...state.levelProgress });
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
