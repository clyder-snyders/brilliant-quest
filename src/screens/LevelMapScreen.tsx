import React, { useState, useMemo } from 'react';
import { useGame } from '../game/GameContext';
import { AvatarDisplay } from '../game/avatars';
import { levelData } from '../game/levels';
import { getRankTitle, getLeaderboard, clearLeaderboard } from '../game/storage';
import { IconStar, IconStarEmpty, IconTrophy, IconFlame, IconTarget, IconCheck, IconLock } from '../components/Icons';

const zones = [
  { id: 1, name: 'Easy — Foundations', range: 'Levels 1–12', color: 'hsl(168, 76%, 40%)', gradientFrom: '#14B8A6', gradientTo: '#0D9488' },
  { id: 2, name: 'Difficult — Builder', range: 'Levels 13–24', color: 'hsl(217, 91%, 60%)', gradientFrom: '#3B82F6', gradientTo: '#2563EB' },
  { id: 3, name: 'Complex — Architect', range: 'Levels 25–38', color: 'hsl(258, 90%, 66%)', gradientFrom: '#8B5CF6', gradientTo: '#7C3AED' },
  { id: 4, name: 'University — Master', range: 'Levels 39–50', color: 'hsl(217, 33%, 17%)', gradientFrom: '#1E293B', gradientTo: '#0F172A' },
];

const ZoneIcon = ({ zone }: { zone: number }) => {
  const s = 24;
  switch (zone) {
    case 1: return <svg width={s} height={s} viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></svg>;
    case 2: return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="2" fill="white" /><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /></svg>;
    case 3: return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M12 2C8 6 4 9 4 13a8 8 0 0016 0c0-4-4-7-8-11z" /><path d="M10 16c0-1 1-2 2-3s2-2 2-3" /></svg>;
    case 4: return <svg width={s} height={s} viewBox="0 0 24 24" fill="white"><path d="M12 3L2 9l10 6 10-6-10-6z" opacity="0.8" /><path d="M2 9v6l10 6 10-6V9" fill="none" stroke="white" strokeWidth="1.5" /></svg>;
    default: return null;
  }
};

function getDailyChallenge(): { levelId: number; dateKey: string } {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const levelId = (seed % levelData.length) + 1;
  return { levelId, dateKey };
}

function isDailyChallengeCompleted(dateKey: string): boolean {
  try { return localStorage.getItem(`brilliantOS_daily_${dateKey}`) === 'true'; } catch { return false; }
}

function completeDailyChallenge(dateKey: string) {
  try { localStorage.setItem(`brilliantOS_daily_${dateKey}`, 'true'); } catch {}
}

export default function LevelMapScreen() {
  const { state, dispatch } = useGame();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);

  // Defensive check for levelData
  if (!levelData || levelData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'hsl(220, 27%, 98%)' }}>
        <div className="text-center p-4">
          <p style={{ color: 'hsl(217, 33%, 17%)' }} className="font-bold mb-2">Error Loading Levels</p>
          <p style={{ color: 'hsl(215, 16%, 47%)' }} className="text-sm">Level data is not available.</p>
          <button className="btn-primary mt-4" onClick={() => window.location.reload()}>
            Reload Game
          </button>
        </div>
      </div>
    );
  }

  const dailyChallenge = useMemo(() => getDailyChallenge(), []);
  const dailyLevel = levelData.find(l => l.id === dailyChallenge.levelId);
  const dailyCompleted = isDailyChallengeCompleted(dailyChallenge.dateKey);

  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return !!state.levelProgress[levelId - 1]?.completed;
  };

  const isZoneAccessible = (zoneId: number) => {
    if (zoneId === 1) return true;
    const zoneLevels = levelData.filter(l => l.zone === zoneId);
    const completedCount = zoneLevels.filter(l => state.levelProgress[l.id]?.completed).length;
    const threshold = Math.ceil(zoneLevels.length * 0.7);
    return completedCount >= threshold;
  };

  const startLevel = (levelId: number) => {
    dispatch({ type: 'SET_LEVEL', levelId });
    dispatch({ type: 'SET_SCREEN', screen: 'game' });
  };

  const startDailyChallenge = () => {
    setShowDailyChallenge(false);
    completeDailyChallenge(dailyChallenge.dateKey);
    startLevel(dailyChallenge.levelId);
  };

  if (showLeaderboard) {
    const lb = getLeaderboard();
    return (
      <div className="min-h-screen" style={{ background: 'hsl(220, 27%, 98%)' }}>
        <div className="sticky top-0 z-10 flex items-center h-14 px-4 border-b" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
          <button className="btn-secondary py-2 px-3 text-sm" onClick={() => setShowLeaderboard(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <h2 className="flex-1 text-center font-bold text-lg flex items-center justify-center gap-2">
            <IconTrophy size={20} color="hsl(43, 96%, 56%)" /> Leaderboard
          </h2>
          <div className="w-16" />
        </div>
        <div className="max-w-[600px] mx-auto p-4">
          {lb.length === 0 ? (
            <p className="text-center py-12" style={{ color: 'hsl(215, 16%, 47%)' }}>No entries yet. Complete levels to appear here!</p>
          ) : (
            <div className="space-y-2">
              {lb.map((e, i) => (
                <div key={i} className="game-card flex items-center gap-3 !p-3">
                  <span className="font-bold text-lg w-8 text-center" style={{ color: i < 3 ? 'hsl(43, 96%, 56%)' : 'hsl(215, 16%, 47%)' }}>#{i + 1}</span>
                  <AvatarDisplay avatarId={e.avatar} size={32} />
                  <span className="font-bold flex-1 truncate">{e.name}</span>
                  <span className="text-sm flex items-center gap-1" style={{ color: 'hsl(215, 16%, 47%)' }}><IconStar size={14} /> {e.totalStars}</span>
                  <span className="font-bold" style={{ color: 'hsl(217, 91%, 60%)' }}>{e.totalScore.toLocaleString()} pts</span>
                </div>
              ))}
            </div>
          )}
          <button className="btn-secondary w-full mt-6 text-sm" onClick={() => { clearLeaderboard(); setShowLeaderboard(false); }}>Clear Leaderboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'hsl(220, 27%, 98%)' }}>
      {/* Daily Challenge Modal */}
      {showDailyChallenge && dailyLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowDailyChallenge(false)}>
          <div className="game-card w-full max-w-[400px] text-center" onClick={e => e.stopPropagation()}>
            <IconTarget size={40} color="hsl(217, 91%, 60%)" className="mx-auto mb-3" />
            <h2 className="text-xl font-extrabold mb-1" style={{ color: 'hsl(217, 33%, 17%)' }}>Daily Challenge</h2>
            <p className="text-sm mb-4" style={{ color: 'hsl(215, 16%, 47%)' }}>{dailyChallenge.dateKey}</p>

            <div className="p-4 rounded-xl mb-4" style={{ background: 'hsl(220, 33%, 95%)' }}>
              <p className="font-bold text-lg" style={{ color: 'hsl(217, 33%, 17%)' }}>Level {dailyLevel.id}: {dailyLevel.name}</p>
              <p className="text-sm mt-1" style={{ color: 'hsl(215, 16%, 47%)' }}>Zone {dailyLevel.zone} — {dailyLevel.conceptTaught}</p>
              <p className="text-xs mt-2" style={{ color: 'hsl(215, 16%, 47%)' }}>
                Par: {dailyLevel.parTime}s — {dailyLevel.parCommands} {dailyLevel.parCommands === 1 ? 'command' : 'commands'}
              </p>
            </div>

            {dailyCompleted && (
              <div className="p-3 rounded-xl mb-4 flex items-center justify-center gap-2" style={{ background: 'hsl(168, 76%, 92%)', color: 'hsl(168, 76%, 30%)' }}>
                <IconCheck size={16} color="hsl(168, 76%, 30%)" />
                <div>
                  <p className="font-bold">Completed today!</p>
                  <p className="text-xs mt-0.5">Come back tomorrow for a new challenge.</p>
                </div>
              </div>
            )}

            <button className="btn-primary w-full py-3 mb-2" onClick={startDailyChallenge}>
              {dailyCompleted ? 'Play Again' : 'Start Challenge'}
            </button>
            <button className="btn-secondary w-full py-2" onClick={() => setShowDailyChallenge(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center h-14 px-3 md:px-4 border-b" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
        <button className="p-1 rounded-lg hover:bg-[hsl(220,33%,95%)] transition-colors" style={{ color: 'hsl(215, 16%, 47%)' }} onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'welcome' })}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <div className="flex items-center gap-2 flex-1 justify-center min-w-0">
          <AvatarDisplay avatarId={state.avatar} size={28} />
          <span className="font-bold truncate" style={{ color: 'hsl(217, 33%, 17%)' }}>{state.playerName || 'Player'}</span>
          <span className="text-xs px-2 py-0.5 rounded-full hidden sm:inline" style={{ background: 'hsl(220, 33%, 95%)', color: 'hsl(215, 16%, 47%)' }}>
            {getRankTitle(state.totalStars)}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm font-bold flex items-center gap-1"><IconStar size={14} /> {state.totalStars}</span>
          <span className="text-sm font-bold flex items-center gap-1"><IconFlame size={14} color="hsl(25, 95%, 53%)" /> {state.streak}</span>
        </div>
      </div>

      {/* Sub-header buttons */}
      <div className="max-w-[1100px] mx-auto px-4 pt-4 flex gap-2 flex-wrap">
        {state.practiceMode && (
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'hsl(25, 95%, 93%)', color: 'hsl(25, 95%, 53%)' }}>PRACTICE</span>
        )}
        <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1" onClick={() => setShowDailyChallenge(true)}>
          <IconTarget size={14} /> Daily Challenge {dailyCompleted ? <IconCheck size={12} color="hsl(168, 76%, 40%)" /> : null}
        </button>
        <button className="btn-secondary py-1.5 px-3 text-xs flex items-center gap-1" onClick={() => setShowLeaderboard(true)}>
          <IconTrophy size={14} /> Leaderboard
        </button>
      </div>

      {/* Zone sections */}
      <div className="max-w-[1100px] mx-auto p-4 space-y-8">
        {zones.map(zone => {
          const zoneLevels = levelData.filter(l => l.zone === zone.id);
          const accessible = isZoneAccessible(zone.id);

          return (
            <div key={zone.id}>
              <div className="rounded-[20px] p-4 md:p-5 mb-4 flex items-center gap-3 md:gap-4" style={{ background: `linear-gradient(135deg, ${zone.gradientFrom}, ${zone.gradientTo})` }}>
                <ZoneIcon zone={zone.id} />
                <div>
                  <h3 className="font-extrabold text-base md:text-lg" style={{ color: 'white' }}>{zone.name}</h3>
                  <p className="text-xs md:text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>{zone.range}</p>
                </div>
              </div>

              {!accessible ? (
                <div className="flex items-center justify-center gap-2 py-8 rounded-[20px] text-sm" style={{ background: 'hsl(220, 33%, 95%)', color: 'hsl(215, 16%, 47%)' }}>
                  <IconLock size={18} />
                  Complete Zone {zone.id - 1} to unlock
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3">
                  {zoneLevels.map(level => {
                    const unlocked = isLevelUnlocked(level.id);
                    const progress = state.levelProgress[level.id];

                    return (
                      <button
                        key={level.id}
                        onClick={() => unlocked && startLevel(level.id)}
                        disabled={!unlocked}
                        className="flex flex-col items-center justify-center p-2 rounded-[14px] transition-all duration-200"
                        style={{
                          background: unlocked ? 'white' : 'hsl(220, 33%, 95%)',
                          border: '1px solid hsl(214, 32%, 91%)',
                          boxShadow: unlocked ? 'var(--shadow-card)' : 'none',
                          cursor: unlocked ? 'pointer' : 'default',
                          opacity: unlocked ? 1 : 0.6,
                          minHeight: '80px',
                        }}
                      >
                        {unlocked ? (
                          <>
                            <span className="font-bold text-lg md:text-xl" style={{ color: 'hsl(217, 33%, 17%)' }}>{level.id}</span>
                            <div className="flex gap-0.5 my-0.5">
                              {[1, 2, 3].map(s => (
                                <span key={s}>
                                  {progress && progress.stars >= s
                                    ? <IconStar size={14} />
                                    : <IconStarEmpty size={14} color="hsl(215, 16%, 67%)" />}
                                </span>
                              ))}
                            </div>
                            {progress?.bestTime ? (
                              <span className="text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>{progress.bestTime}s</span>
                            ) : null}
                          </>
                        ) : (
                          <IconLock size={20} color="hsl(215, 16%, 67%)" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
