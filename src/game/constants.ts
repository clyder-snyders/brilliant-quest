// Game Configuration Constants
export const GAME_CONFIG = {
  // Animation & Timing (milliseconds)
  MOVE_DELAY: 350,
  TURN_DELAY: 300,
  WALL_HIT_DELAY: 300,
  WALL_HIT_ANIMATION_DURATION: 300,
  MESSAGE_FADE_TIME: 500,
  
  // Grid Rendering
  GRID_CELL_SIZES: {
    small: 52,   // gridSize <= 6
    medium: 44,  // gridSize <= 8
    large: 38,   // gridSize <= 10
    xlarge: 32,  // gridSize > 10
  },

  // Game Rules
  MAX_REPEAT_CYCLES: 30,
  ZONE_UNLOCK_COMPLETION_THRESHOLD: 0.7, // 70% completion required to unlock next zone
  LEVEL_UNLOCK_STAR_REQUIREMENT: 2, // Must earn 2+ stars to unlock next level
  
  // Scoring
  WALL_HIT_PENALTY: 30,
  PERFECT_BONUS: 100,
  LOOP_BONUS: 40,
  FUNCTION_BONUS: 60,
  
  // Session Storage Keys
  SESSION_KEYS: {
    SEQUENCE: 'level_sequence',
    ROBOT_POS: 'robot_pos',
    ROBOT_DIR: 'robot_dir',
  },

  // Leaderboard
  MAX_LEADERBOARD_ENTRIES: 10,
} as const;

// Command Availability by Phase
export const PHASE_COMMANDS = {
  1: [
    'moveForward1', 'moveForward2', 'moveForward3',
    'turnLeft', 'turnRight', 'turnAround'
  ],
  2: [
    'moveForward1', 'moveForward2', 'moveForward3',
    'turnLeft', 'turnRight', 'turnAround',
    'repeat2', 'repeat3', 'repeat4', 'repeat5',
    'repeatUntilGoal', 'repeatUntilWall'
  ],
  3: [
    'moveForward1', 'moveForward2', 'moveForward3',
    'turnLeft', 'turnRight', 'turnAround',
    'repeat2', 'repeat3', 'repeat4', 'repeat5',
    'repeatUntilGoal', 'repeatUntilWall',
    'ifPathAhead', 'ifWallLeft', 'ifWallRight', 'ifGoalAhead', 'ifElse'
  ],
  4: [
    'moveForward1', 'moveForward2', 'moveForward3',
    'turnLeft', 'turnRight', 'turnAround',
    'repeat2', 'repeat3', 'repeat4', 'repeat5',
    'repeatUntilGoal', 'repeatUntilWall',
    'ifPathAhead', 'ifWallLeft', 'ifWallRight', 'ifGoalAhead', 'ifElse',
    'setVariable', 'changeVariable', 'compareVariable',
    'defineFunction', 'callFunction',
    'andOp', 'orOp', 'notOp'
  ]
} as const;

// Command Categories for UI Organization
export const COMMAND_CATEGORIES = {
  movement: {
    name: 'Movement',
    commands: ['moveForward1', 'moveForward2', 'moveForward3', 'turnLeft', 'turnRight', 'turnAround'],
    color: 'blue'
  },
  loops: {
    name: 'Loops',
    commands: ['repeat2', 'repeat3', 'repeat4', 'repeat5', 'repeatUntilGoal', 'repeatUntilWall'],
    color: 'green'
  },
  conditionals: {
    name: 'Conditionals',
    commands: ['ifPathAhead', 'ifWallLeft', 'ifWallRight', 'ifGoalAhead', 'ifElse'],
    color: 'yellow'
  },
  variables: {
    name: 'Variables',
    commands: ['setVariable', 'changeVariable', 'compareVariable'],
    color: 'purple'
  },
  functions: {
    name: 'Functions',
    commands: ['defineFunction', 'callFunction'],
    color: 'indigo'
  },
  logic: {
    name: 'Logic',
    commands: ['andOp', 'orOp', 'notOp'],
    color: 'red'
  }
} as const;

// Star Thresholds by Level ID (override defaults)
export const STAR_THRESHOLDS: Record<number, { par: number; timeLimit: number }> = {
  1: { par: 1, timeLimit: 20 },
  2: { par: 4, timeLimit: 25 },
  3: { par: 5, timeLimit: 28 },
  // ... auto-calculated from levelData.parCommands if not specified
};

// Complexity Ranges for Display
export const COMPLEXITY_RANGES = {
  foundations: { min: 5, max: 15, color: '#60a5fa' },      // Blue
  builder: { min: 15, max: 40, color: '#4ade80' },          // Green
  architect: { min: 40, max: 80, color: '#fbbf24' },        // Yellow
  master: { min: 80, max: 150, color: '#a78bfa' },          // Purple
};

// Get complexity level description
export function getComplexityLevel(score: number): string {
  if (score < COMPLEXITY_RANGES.foundations.max) return 'Foundations';
  if (score < COMPLEXITY_RANGES.builder.max) return 'Builder';
  if (score < COMPLEXITY_RANGES.architect.max) return 'Architect';
  return 'Master';
}

// Animation class names for Tailwind
export const ANIMATION_CLASSES = {
  FADE_IN_UP: 'animate-fade-in-up',
  PULSE_SLOW: 'animate-pulse-slow',
  BOUNCE_SLOW: 'animate-bounce-slow',
  STAR_POP: 'animate-star-pop',
  WALL_HIT: 'animate-wall-hit',
} as const;
