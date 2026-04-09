import { AvatarId, GameState, LeaderboardEntry, LevelProgress } from './types';

const KEYS = {
  playerName: 'brilliantOS_playerName',
  avatar: 'brilliantOS_avatar',
  levelProgress: 'brilliantOS_levelProgress',
  totalStars: 'brilliantOS_totalStars',
  streak: 'brilliantOS_streak',
  lastPlayDate: 'brilliantOS_lastPlayDate',
  leaderboard: 'brilliantOS_leaderboard',
};

export function loadGameState(): Partial<GameState> {
  try {
    return {
      playerName: localStorage.getItem(KEYS.playerName) || '',
      avatar: (localStorage.getItem(KEYS.avatar) as AvatarId) || 'spark',
      levelProgress: JSON.parse(localStorage.getItem(KEYS.levelProgress) || '{}'),
      totalStars: parseInt(localStorage.getItem(KEYS.totalStars) || '0'),
      streak: parseInt(localStorage.getItem(KEYS.streak) || '0'),
      lastPlayDate: localStorage.getItem(KEYS.lastPlayDate) || '',
    };
  } catch { return {}; }
}

export function savePlayerProfile(name: string, avatar: AvatarId) {
  localStorage.setItem(KEYS.playerName, name);
  localStorage.setItem(KEYS.avatar, avatar);
}

export function saveLevelProgress(levelId: number, progress: LevelProgress, allProgress: Record<number, LevelProgress>) {
  const existing = allProgress[levelId];
  if (existing) {
    // Only update if better
    allProgress[levelId] = {
      completed: true,
      stars: Math.max(existing.stars, progress.stars),
      bestScore: Math.max(existing.bestScore, progress.bestScore),
      bestTime: existing.bestTime > 0 ? Math.min(existing.bestTime, progress.bestTime) : progress.bestTime,
    };
  } else {
    allProgress[levelId] = progress;
  }
  localStorage.setItem(KEYS.levelProgress, JSON.stringify(allProgress));

  // Recalculate total stars
  const totalStars = Object.values(allProgress).reduce((sum, p) => sum + p.stars, 0);
  localStorage.setItem(KEYS.totalStars, totalStars.toString());

  // Update streak
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(KEYS.lastPlayDate);
  if (lastDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const currentStreak = parseInt(localStorage.getItem(KEYS.streak) || '0');
    if (lastDate === yesterday) {
      localStorage.setItem(KEYS.streak, (currentStreak + 1).toString());
    } else if (lastDate !== today) {
      localStorage.setItem(KEYS.streak, '1');
    }
    localStorage.setItem(KEYS.lastPlayDate, today);
  }

  return allProgress;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.leaderboard) || '[]');
  } catch { return []; }
}

export function addToLeaderboard(entry: LeaderboardEntry) {
  const lb = getLeaderboard();
  lb.push(entry);
  lb.sort((a, b) => b.totalScore - a.totalScore);
  const top10 = lb.slice(0, 10);
  localStorage.setItem(KEYS.leaderboard, JSON.stringify(top10));
  return top10;
}

export function clearLeaderboard() {
  localStorage.removeItem(KEYS.leaderboard);
}

export function getRankTitle(totalStars: number): string {
  if (totalStars >= 131) return "Brilliant OS Master";
  if (totalStars >= 111) return "Systems Thinker";
  if (totalStars >= 81) return "Debug Specialist";
  if (totalStars >= 51) return "Code Builder";
  if (totalStars >= 31) return "Algorithm Apprentice";
  if (totalStars >= 16) return "Logic Learner";
  return "Beginner Coder";
}

export function calculateScore(
  timeSeconds: number,
  commandsUsed: number,
  parTime: number,
  parCommands: number,
  hintsUsed: number,
  wallCollisions: number,
  usedLoops: boolean,
  usedFunctions: boolean
): { score: number; stars: number } {
  let score = 1000;
  score += Math.min(300, Math.max(0, (parTime - timeSeconds) * 5));
  score += Math.min(200, Math.max(0, (parCommands - commandsUsed) * 20));
  if (hintsUsed === 0 && wallCollisions === 0 && timeSeconds <= parTime && commandsUsed <= parCommands) {
    score += 100; // Perfect bonus
  }
  if (usedLoops) score += 40;
  if (usedFunctions) score += 60;
  score -= hintsUsed * 50;
  score -= wallCollisions * 30;
  score = Math.max(0, score);

  let stars = 0;
  if (score >= 900) stars = 3;
  else if (score >= 600) stars = 2;
  else if (score >= 1) stars = 1;

  return { score, stars };
}
