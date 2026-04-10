import React from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { FeedbackButton } from '../components/FeedbackButton';
import WelcomeScreen from '../screens/WelcomeScreen';
import SetupScreen from '../screens/SetupScreen';
import LevelMapScreen from '../screens/LevelMapScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import AboutScreen from '../screens/AboutScreen';

function GameRouter() {
  const { state } = useGame();

  const screenMap: Record<string, React.ReactNode> = {
    welcome: <WelcomeScreen />,
    setup: <SetupScreen />,
    levelMap: <LevelMapScreen />,
    game: <GameScreen />,
    result: <ResultScreen />,
    about: <AboutScreen />,
  };

  return (
    <>
      <div className="min-h-screen">
        {screenMap[state.currentScreen] || <WelcomeScreen />}
      </div>
      {state.currentScreen !== 'game' && <FeedbackButton />}
    </>
  );
}

export default function Index() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
