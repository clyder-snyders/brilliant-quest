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
  
  // Scoring
  HINTS_PENALTY: 50,
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

// Animation class names for Tailwind
export const ANIMATION_CLASSES = {
  FADE_IN_UP: 'animate-fade-in-up',
  PULSE_SLOW: 'animate-pulse-slow',
  BOUNCE_SLOW: 'animate-bounce-slow',
  STAR_POP: 'animate-star-pop',
  WALL_HIT: 'animate-wall-hit',
} as const;
