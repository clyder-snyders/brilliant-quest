import React from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import WelcomeScreen from '../screens/WelcomeScreen';
import SetupScreen from '../screens/SetupScreen';
import LevelMapScreen from '../screens/LevelMapScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';

function GameRouter() {
  const { state } = useGame();

  const screenMap: Record<string, React.ReactNode> = {
    welcome: <WelcomeScreen />,
    setup: <SetupScreen />,
    levelMap: <LevelMapScreen />,
    game: <GameScreen />,
    result: <ResultScreen />,
  };

  return (
    <div className="min-h-screen">
      {screenMap[state.currentScreen] || <WelcomeScreen />}
    </div>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
