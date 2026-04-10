import React, { useEffect, useState } from 'react';
import { useGame } from '../game/GameContext';
import { levelData } from '../game/levels';
import { addToLeaderboard } from '../game/storage';
import { GAME_CONFIG } from '../game/constants';
import { isValidLevelId } from '../game/validation';

const CONFETTI_COLORS = {
  gold: ['#FBBF24', '#F59E0B', '#D97706'],
  silver: ['#E5E7EB', '#D1D5DB', '#9CA3AF'],
  bronze: ['#F97316', '#EA580C', '#DC2626'],
};

const getConfettiColors = (stars: number): string[] => {
  if (stars >= 3) return CONFETTI_COLORS.gold;
  if (stars === 2) return CONFETTI_COLORS.silver;
  return CONFETTI_COLORS.bronze;
};

const pluralize = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export default function ResultScreen() {
  const { state, dispatch } = useGame();

  if (!isValidLevelId(state.currentLevel)) {
    dispatch({ type: 'SET_SCREEN', screen: 'levelMap' });
    return null;
  }

  const level = levelData.find(l => l.id === state.currentLevel) || levelData[0];
  const progress = state.levelProgress[level.id];
  const success = !!progress?.completed;
  const stars = progress?.stars || 0;
  const score = progress?.bestScore || 0;
  const time = progress?.bestTime || 0;
  const commandsUsed = progress?.bestCommandsUsed || 0;

  const [showStars, setShowStars] = useState([false, false, false]);
  const [confetti, setConfetti] = useState<{ x: number; y: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    if (success) {
      const starDelay = GAME_CONFIG.TURN_DELAY;
      [0, 1, 2].forEach(i => {
        if (i < stars) {
          setTimeout(() => setShowStars(s => { const n = [...s]; n[i] = true; return n; }), starDelay + i * starDelay);
        }
      });

      const colors = getConfettiColors(stars);
      const pieces = Array.from({ length: 20 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * -20,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
      }));
      setConfetti(pieces);
    }
  }, [success, stars]);

  const nextLevel = () => {
    if (state.currentLevel >= 50) {
      dispatch({ type: 'SET_SCREEN', screen: 'levelMap' });
    } else {
      dispatch({ type: 'SET_LEVEL', levelId: state.currentLevel + 1 });
      dispatch({ type: 'SET_SCREEN', screen: 'game' });
    }
  };

  const replay = () => {
    dispatch({ type: 'SET_SCREEN', screen: 'game' });
  };

  useEffect(() => {
    if (success && !state.practiceMode) {
      const totalScore = Object.values(state.levelProgress).reduce((s, p) => s + p.bestScore, 0);
      addToLeaderboard({
        name: state.playerName || 'Player',
        avatar: state.avatar,
        totalStars: state.totalStars,
        bestLevel: state.currentLevel,
        totalScore,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const starMessage = stars === 3 ? "Perfect Run! Outstanding performance." : stars === 2 ? "Great job! Clean and efficient." : "Level cleared! Keep improving.";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F0F5FF 0%, #F7F9FC 100%)' }}>
      {/* Confetti */}
      {success && confetti.map((c, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            background: c.color,
            animation: `confettiDrop 2s ${c.delay}s ease-out forwards`,
          }}
        />
      ))}

      <div className="game-card w-full max-w-[480px] text-center relative z-10">
        {success ? (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-slow" style={{ background: 'hsl(168, 76%, 40%)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="white"><path d="M8 16l6 6 10-12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>

            <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'hsl(217, 33%, 17%)' }}>Level Complete! 🎉</h2>
            <p className="text-sm mb-6" style={{ color: 'hsl(215, 16%, 47%)' }}>Level {level.id} — {level.name}</p>

            {/* Stars */}
            <div className="flex justify-center gap-4 mb-2">
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className={`text-4xl ${showStars[i] ? 'animate-star-pop' : ''}`}
                  style={{ opacity: showStars[i] ? 1 : 0.2 }}
                >
                  {i < stars ? '⭐' : '☆'}
                </span>
              ))}
            </div>
            <p className="text-sm mb-6" style={{ color: 'hsl(215, 16%, 47%)' }}>{starMessage}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3 rounded-xl" style={{ background: 'hsl(220, 33%, 95%)' }}>
                <p className="text-lg mb-0.5">⏱</p>
                <p className="font-bold text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>{time}s</p>
                <p className="text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>Time</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'hsl(220, 33%, 95%)' }}>
                <p className="text-lg mb-0.5">📝</p>
                <p className="font-bold text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>
                  You used {pluralize(commandsUsed, 'command')}
                </p>
                <p className="text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>
                  Par is {pluralize(level.parCommands, 'command')}
                </p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'hsl(220, 33%, 95%)' }}>
                <p className="text-lg mb-0.5">🏆</p>
                <p className="font-bold text-lg" style={{ color: 'hsl(217, 91%, 60%)' }}>{score.toLocaleString()} pts</p>
                <p className="text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>Score</p>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'hsl(220, 33%, 95%)' }}>
                <p className="text-lg mb-0.5">💥</p>
                <p className="font-bold text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>{progress?.bestWallHits || 0}</p>
                <p className="text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>Wall Hits</p>
              </div>
            </div>

            {/* Concept badge */}
            <div className="inline-flex items-center gap-1 px-4 py-2 rounded-full mb-6 text-sm font-bold" style={{ background: 'hsl(168, 76%, 92%)', color: 'hsl(168, 76%, 30%)' }}>
              ✓ {level.conceptTaught} Mastered
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'hsl(25, 95%, 53%)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="white"><text x="16" y="22" textAnchor="middle" fontSize="20" fontWeight="bold">!</text></svg>
            </div>

            <h2 className="text-2xl font-extrabold mb-1" style={{ color: 'hsl(217, 33%, 17%)' }}>Not Quite!</h2>
            <p className="text-sm mb-4" style={{ color: 'hsl(215, 16%, 47%)' }}>
              You didn't complete all the required steps.
            </p>

            <div className="p-4 rounded-xl mb-6" style={{ background: 'hsl(43, 96%, 95%)', color: 'hsl(43, 96%, 30%)' }}>
              <p className="text-sm">💡 <strong>Tip:</strong> Check your turn commands and make sure you have enough moves to reach the goal.</p>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {success ? (
            <>
              <button className="btn-primary w-full py-3" onClick={nextLevel}>
                {state.currentLevel >= 50 ? 'All Done! 🎉' : 'Next Level →'}
              </button>
              <button className="btn-secondary w-full py-3" onClick={replay}>Replay</button>
            </>
          ) : (
            <button className="btn-primary w-full py-3" onClick={replay}>Try Again</button>
          )}
          <button className="btn-secondary w-full py-3" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'levelMap' })}>Back to Map</button>
        </div>
      </div>
    </div>
  );
}
