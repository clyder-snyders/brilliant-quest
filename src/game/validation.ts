import { LevelData, TileType } from './types';

/**
 * Validates a LevelData object for proper structure and values
 * @param level The level to validate
 * @returns {valid: boolean, errors: string[]}
 */
export function validateLevelData(level: LevelData | undefined): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!level) {
    errors.push('Level data is undefined');
    return { valid: false, errors };
  }

  // Validate required fields
  if (typeof level.id !== 'number' || level.id < 1 || level.id > 50) {
    errors.push(`Invalid level ID: ${level.id}. Must be 1-50`);
  }

  if (!level.name || typeof level.name !== 'string') {
    errors.push('Level name is required');
  }

  if (!level.grid || !Array.isArray(level.grid)) {
    errors.push('Grid is required and must be an array');
    return { valid: errors.length === 0, errors };
  }

  // Validate grid dimensions
  if (level.grid.length !== level.gridSize) {
    errors.push(`Grid has ${level.grid.length} rows but gridSize is ${level.gridSize}`);
  }

  level.grid.forEach((row, rowIdx) => {
    if (!Array.isArray(row)) {
      errors.push(`Grid row ${rowIdx} is not an array`);
      return;
    }
    if (row.length !== level.gridSize) {
      errors.push(`Grid row ${rowIdx} has ${row.length} columns but gridSize is ${level.gridSize}`);
    }
    row.forEach((cell, colIdx) => {
      if (![0, 1, 2, 3, 4, 5].includes(cell as number)) {
        errors.push(`Invalid tile type at [${rowIdx},${colIdx}]: ${cell}. Must be 0-5`);
      }
    });
  });

  // Validate robot start position
  if (!level.robotStart || typeof level.robotStart.x !== 'number' || typeof level.robotStart.y !== 'number') {
    errors.push('Robot start position is invalid');
  } else if (
    level.robotStart.x < 0 ||
    level.robotStart.x >= level.gridSize ||
    level.robotStart.y < 0 ||
    level.robotStart.y >= level.gridSize
  ) {
    errors.push(`Robot start position [${level.robotStart.x},${level.robotStart.y}] is outside grid`);
  }

  // Validate par times
  if (typeof level.parTime !== 'number' || level.parTime < 0) {
    errors.push(`Invalid par time: ${level.parTime}`);
  }

  if (typeof level.parCommands !== 'number' || level.parCommands < 0) {
    errors.push(`Invalid par commands: ${level.parCommands}`);
  }

  if (typeof level.maxCommands !== 'number' || level.maxCommands < level.parCommands) {
    errors.push(`Max commands ${level.maxCommands} should be >= par commands ${level.parCommands}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates localStorage data and attempts recovery
 */
export function validateAndRecoverStorageData(key: string, fallbackValue: unknown): unknown {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallbackValue;

    const parsed = JSON.parse(data);
    return parsed || fallbackValue;
  } catch (error) {
    console.error(`[Storage Error] Failed to parse ${key}:`, error);
    // Log error and notify user
    localStorage.setItem(`${key}_error`, new Date().toISOString());
    return fallbackValue;
  }
}

/**
 * Validates leaderboard entry integrity
 */
export function validateLeaderboardEntry(entry: unknown): boolean {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.name === 'string' &&
    typeof e.totalStars === 'number' &&
    typeof e.bestLevel === 'number' &&
    typeof e.totalScore === 'number' &&
    e.totalStars >= 0 &&
    e.totalStars <= 150 && // Max stars = 50 levels * 3 stars
    e.bestLevel >= 1 &&
    e.bestLevel <= 50 &&
    e.totalScore >= 0
  );
}

/**
 * Creates a checksum for leaderboard data (simple validation)
 */
export function createLeaderboardChecksum(entries: unknown[]): string {
  const data = JSON.stringify(entries);
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}

/**
 * Validates that a level ID is within valid range
 * @param levelId The level ID to validate
 * @returns Whether the level ID is valid (1-50)
 */
export function isValidLevelId(levelId: unknown): levelId is number {
  return typeof levelId === 'number' && levelId >= 1 && levelId <= 50;
}
