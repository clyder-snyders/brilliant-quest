import React, { useState, useCallback, useEffect } from 'react';
import { GameProvider, useGame } from '../game/GameContext';
import { FeedbackButton } from '../components/FeedbackButton';
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SetupScreen from '../screens/SetupScreen';
import LevelMapScreen from '../screens/LevelMapScreen';
import GameScreen from '../screens/GameScreen';
import ResultScreen from '../screens/ResultScreen';
import AboutScreen from '../screens/AboutScreen';

function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler as any);
    return () => window.removeEventListener('beforeinstallprompt', handler as any);
  }, []);

  if (!deferredPrompt || dismissed) return null;

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-fade-in-up">
      <div className="game-card flex items-center gap-3 !p-3" style={{ border: '2px solid hsl(217, 91%, 60%)' }}>
        <img src="/icon-192.png" alt="Brilliant OS" width={40} height={40} className="rounded-lg" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>Install Brilliant OS</p>
          <p className="text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>Play offline as an app</p>
        </div>
        <button className="btn-primary text-xs !py-2 !px-3" onClick={handleInstall}>Install</button>
        <button className="p-1 text-xs" style={{ color: 'hsl(215, 16%, 47%)' }} onClick={() => setDismissed(true)}>✕</button>
      </div>
    </div>
  );
}

function GameRouter() {
  const { state } = useGame();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);

  const screenMap: Record<string, React.ReactNode> = {
    welcome: <WelcomeScreen />,
    setup: <SetupScreen />,
    levelMap: <LevelMapScreen />,
    game: <GameScreen />,
    result: <ResultScreen />,
    about: <AboutScreen />,
  };

  // Default to welcome screen if current screen is invalid
  const currentScreen = screenMap[state.currentScreen] ? state.currentScreen : 'welcome';

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <div className="min-h-screen">
        {screenMap[currentScreen] || <WelcomeScreen />}
      </div>
      {state.currentScreen !== 'game' && <FeedbackButton />}
      <PWAInstallBanner />
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
