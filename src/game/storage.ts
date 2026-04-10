import { AvatarId, GameState, LeaderboardEntry, LevelProgress } from './types';
import { validateLeaderboardEntry, createLeaderboardChecksum } from './validation';

const KEYS = {
  playerName: 'brilliantOS_playerName',
  avatar: 'brilliantOS_avatar',
  levelProgress: 'brilliantOS_levelProgress',
  totalStars: 'brilliantOS_totalStars',
  streak: 'brilliantOS_streak',
  lastPlayDate: 'brilliantOS_lastPlayDate',
  leaderboard: 'brilliantOS_leaderboard',
};

export function calculateStreakAndPlayDate(): { streak: number; lastPlayDate: string } {
  const today = new Date().toISOString().split('T')[0];
  const lastPlayDate = localStorage.getItem(KEYS.lastPlayDate) || '';
  let streak = parseInt(localStorage.getItem(KEYS.streak) || '0');

  if (lastPlayDate === today) {
    return { streak, lastPlayDate };
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (lastPlayDate === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(KEYS.lastPlayDate, today);
  localStorage.setItem(KEYS.streak, String(streak));

  return { streak, lastPlayDate: today };
}

export function loadGameState(): Partial<GameState> {
  try {
    const { streak } = calculateStreakAndPlayDate();
    return {
      playerName: localStorage.getItem(KEYS.playerName) || '',
      avatar: (localStorage.getItem(KEYS.avatar) as AvatarId) || 'spark',
      levelProgress: JSON.parse(localStorage.getItem(KEYS.levelProgress) || '{}'),
      totalStars: parseInt(localStorage.getItem(KEYS.totalStars) || '0'),
      streak,
      lastPlayDate: localStorage.getItem(KEYS.lastPlayDate) || '',
    };
  } catch (error) {
    console.error('[Storage Error] Failed to load game state:', error);
    return {};
  }
}

export function savePlayerProfile(name: string, avatar: AvatarId) {
  localStorage.setItem(KEYS.playerName, name);
  localStorage.setItem(KEYS.avatar, avatar);
}

export function saveLevelProgress(levelId: number, progress: LevelProgress, allProgress: Record<number, LevelProgress>, practiceMode: boolean = false) {
  const existing = allProgress[levelId];
  if (existing) {
    allProgress[levelId] = {
      completed: true,
      stars: Math.max(existing.stars, progress.stars),
      bestScore: Math.max(existing.bestScore, progress.bestScore),
      bestTime: existing.bestTime > 0 ? Math.min(existing.bestTime, progress.bestTime) : progress.bestTime,
      bestCommandsUsed: existing.bestCommandsUsed ? Math.min(existing.bestCommandsUsed, progress.bestCommandsUsed || 99) : progress.bestCommandsUsed,
      bestWallHits: existing.bestWallHits !== undefined ? Math.min(existing.bestWallHits, progress.bestWallHits || 0) : progress.bestWallHits,
    };
  } else {
    allProgress[levelId] = progress;
  }

  if (!practiceMode) {
    localStorage.setItem(KEYS.levelProgress, JSON.stringify(allProgress));
    const totalStars = Object.values(allProgress).reduce((sum, p) => sum + p.stars, 0);
    localStorage.setItem(KEYS.totalStars, totalStars.toString());

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
  }

  return allProgress;
}

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(KEYS.leaderboard) || '[]';
    const entries = JSON.parse(data);
    return Array.isArray(entries) ? entries.filter(validateLeaderboardEntry) : [];
  } catch (error) {
    console.error('[Storage Error] Failed to load leaderboard:', error);
    return [];
  }
}

export function addToLeaderboard(entry: LeaderboardEntry) {
  try {
    if (!validateLeaderboardEntry(entry)) return [];

    const lb = getLeaderboard();
    const existingIdx = lb.findIndex(e => e.name === entry.name && e.avatar === entry.avatar);
    if (existingIdx !== -1) {
      const existing = lb[existingIdx];
      lb[existingIdx] = {
        ...entry,
        totalStars: Math.max(existing.totalStars, entry.totalStars),
        bestLevel: Math.max(existing.bestLevel, entry.bestLevel),
        totalScore: Math.max(existing.totalScore, entry.totalScore),
      };
    } else {
      lb.push(entry);
    }
    lb.sort((a, b) => b.totalScore - a.totalScore);
    const top10 = lb.slice(0, 10);
    localStorage.setItem(KEYS.leaderboard, JSON.stringify(top10));
    localStorage.setItem(`${KEYS.leaderboard}_checksum`, createLeaderboardChecksum(top10));
    return top10;
  } catch (error) {
    console.error('[Storage Error] Failed to add leaderboard entry:', error);
    return [];
  }
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
  wallCollisions: number,
  usedLoops: boolean,
  usedFunctions: boolean
): { score: number; stars: number } {
  let score = 1000;
  score += Math.min(300, Math.max(0, (parTime - timeSeconds) * 5));
  score += Math.min(200, Math.max(0, (parCommands - commandsUsed) * 20));
  if (wallCollisions === 0 && timeSeconds <= parTime && commandsUsed <= parCommands) {
    score += 100; // Perfect bonus
  }
  if (usedLoops) score += 40;
  if (usedFunctions) score += 60;
  score -= wallCollisions * 30;
  score = Math.max(0, score);

  let stars = 0;
  if (score >= 900) stars = 3;
  else if (score >= 600) stars = 2;
  else if (score >= 1) stars = 1;

  return { score, stars };
}
