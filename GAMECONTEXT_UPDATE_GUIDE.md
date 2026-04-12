# GameContext Updates for Blockly Maze Redesign

This file documents the required updates to `GameContext.tsx` and `GameScreen.tsx` to fully implement the Blockly Maze progression system.

## 1. GameContext.tsx enhancements

### Add Helper Functions

```typescript
// At the top of GameContext.tsx, add these utilities:

import { PHASE_COMMANDS, LEVEL_UNLOCK_STAR_REQUIREMENT } from './constants';

/**
 * Get available commands for a specific level
 * Returns only the commands that should be available for that level
 */
export function getAvailableCommandsForLevel(levelId: number): string[] {
  const level = levelData.find(l => l.id === levelId);
  if (!level) return [];
  return level.availableCommands;
}

/**
 * Get available commands by phase
 */
export function getCommandsByPhase(phase: 1 | 2 | 3 | 4): string[] {
  return PHASE_COMMANDS[phase];
}

/**
 * Check if a level is unlocked based on progression rules
 * Level 1 is always unlocked
 * Other levels require 2+ stars on the previous level
 */
export function isLevelUnlocked(levelId: number, levelProgress: Record<number, LevelProgress>): boolean {
  // Level 1 is always unlocked
  if (levelId === 1) return true;
  
  // Check if previous level has 2+ stars
  const previousLevel = levelData.find(l => l.id === levelId - 1);
  if (!previousLevel) return false;
  
  const prevProgress = levelProgress[previousLevel.id];
  if (!prevProgress) return false;
  
  return prevProgress.stars >= LEVEL_UNLOCK_STAR_REQUIREMENT;
}

/**
 * Calculate stars earned based on efficiency
 * 1 star: Reached goal
 * 2 stars: Used ≤ parCommands + 20%
 * 3 stars: Used ≤ parCommands - 20% or less
 */
export function calculateStarsEarned(
  level: LevelData,
  commandsUsed: number
): number {
  // 1 star for completing the level
  let stars = 1;
  
  // 2 stars for reasonable efficiency
  if (commandsUsed <= Math.ceil(level.parCommands * 1.2)) {
    stars = 2;
  }
  
  // 3 stars for mastery
  if (commandsUsed <= Math.max(level.parCommands - 1, Math.floor(level.parCommands * 0.8))) {
    stars = 3;
  }
  
  return Math.min(3, stars);
}

/**
 * Get list of unlocked levels based on current progress
 */
export function getUnlockedLevels(levelProgress: Record<number, LevelProgress>): number[] {
  return levelData
    .filter(level => isLevelUnlocked(level.id, levelProgress))
    .map(level => level.id);
}

/**
 * Get the unlock requirement message for a locked level
 */
export function getUnlockMessage(levelId: number): string {
  if (levelId === 1) return '';
  
  const previousLevel = levelData.find(l => l.id === levelId - 1);
  if (!previousLevel) return `Complete Level ${levelId - 1} to unlock`;
  
  return `Complete Level ${levelId - 1} with 2+ ⭐ to unlock`;
}

/**
 * Get next locked level that can be unlocked
 */
export function getNextLockedLevel(levelProgress: Record<number, LevelProgress>): number | null {
  for (let i = 1; i < levelData.length; i++) {
    const level = levelData[i];
    if (!isLevelUnlocked(level.id, levelProgress)) {
      return level.id;
    }
  }
  return null;
}
```

### Update Execution Logic to Support New Sensors

Add to the game execution/simulation logic:

```typescript
/**
 * Check if there's a wall ahead of the robot
 */
function isWallAhead(robot: RobotState, grid: TileType[][]): boolean {
  const { x, y, direction } = robot;
  const [nextX, nextY] = getForwardPosition(x, y, direction);
  return isWall(nextX, nextY, grid);
}

/**
 * Check if there's a wall to the left of the robot
 */
function isWallLeft(robot: RobotState, grid: TileType[][]): boolean {
  const { x, y, direction } = robot;
  const leftDirection = turnLeft(direction);
  const [nextX, nextY] = getForwardPosition(x, y, leftDirection);
  return isWall(nextX, nextY, grid);
}

/**
 * Check if there's a wall to the right of the robot
 */
function isWallRight(robot: RobotState, grid: TileType[][]): boolean {
  const { x, y, direction } = robot;
  const rightDirection = turnRight(direction);
  const [nextX, nextY] = getForwardPosition(x, y, rightDirection);
  return isWall(nextX, nextY, grid);
}

/**
 * Check if the goal is ahead
 */
function isGoalAhead(robot: RobotState, grid: TileType[][]): boolean {
  const { x, y, direction } = robot;
  const [nextX, nextY] = getForwardPosition(x, y, direction);
  return grid[nextY]?.[nextX] === 2; // 2 = goal
}

/**
 * Check if the goal is reachable via any direction
 */
function isGoalNearby(robot: RobotState, grid: TileType[][]): boolean {
  return isGoalAhead(robot, grid) ||
         isWallLeft(robot, grid) === false ||
         isWallRight(robot, grid) === false;
}

/**
 * Helper: Get position in front of robot
 */
function getForwardPosition(x: number, y: number, direction: Direction): [number, number] {
  switch (direction) {
    case 'right': return [x + 1, y];
    case 'left': return [x - 1, y];
    case 'down': return [x, y + 1];
    case 'up': return [x, y - 1];
  }
}

/**
 * Helper: Check if position is a wall
 */
function isWall(x: number, y: number, grid: TileType[][]): boolean {
  if (x < 0 || y < 0 || y >= grid.length || x >= grid[0].length) return true;
  return grid[y][x] === 1; // 1 = wall
}

/**
 * Helper: Turn left (rotate 90° counter-clockwise)
 */
function turnLeft(direction: Direction): Direction {
  const turns = { right: 'down', down: 'left', left: 'up', up: 'right' };
  return turns[direction];
}

/**
 * Helper: Turn right (rotate 90° clockwise)
 */
function turnRight(direction: Direction): Direction {
  const turns = { right: 'up', up: 'left', left: 'down', down: 'right' };
  return turns[direction];
}

/**
 * Execute a command sequence with sensor evaluation
 * (Existing execution code, enhanced to support new sensors)
 */
export async function executeCommands(
  commands: any[],
  level: LevelData,
  onProgress?: (robot: RobotState, executedCount: number) => void
): Promise<ExecutionResult> {
  const grid = level.grid;
  const robot = { ...level.robotStart };
  let commandsUsed = 0;
  let stepsExecuted = 0;
  let wallHits = 0;
  const timeStart = Date.now();
  
  // Variables state for level execution
  const variables: Record<string, number> = {};
  
  for (const command of commands) {
    // Check if wall ahead and abort if we would hit
    if (command === 'moveForward1' || command === 'moveForward2' || command === 'moveForward3') {
      const steps = parseInt(command.replace('moveForward', ''));
      for (let i = 0; i < steps; i++) {
        if (isWallAhead(robot, grid)) {
          wallHits++;
          break; // Stop moving if wall detected
        }
        const [nextX, nextY] = getForwardPosition(robot.x, robot.y, robot.direction);
        robot.x = nextX;
        robot.y = nextY;
        stepsExecuted++;
      }
    }
    
    // New: Until Wall loop
    else if (command === 'repeatUntilWall') {
      let loopCount = 0;
      while (!isWallAhead(robot, grid) && loopCount < level.parTime) {
        const [nextX, nextY] = getForwardPosition(robot.x, robot.y, robot.direction);
        robot.x = nextX;
        robot.y = nextY;
        stepsExecuted++;
        loopCount++;
      }
    }
    
    // New: Sensor conditions
    else if (command === 'ifWallLeft:move') {
      if (isWallLeft(robot, grid)) {
        const [nextX, nextY] = getForwardPosition(robot.x, robot.y, robot.direction);
        if (!isWallAhead(robot, grid)) {
          robot.x = nextX;
          robot.y = nextY;
          stepsExecuted++;
        }
      }
    }
    
    // New: Set variable
    else if (command.startsWith('set:')) {
      const [varName, value] = command.slice(4).split('=');
      variables[varName] = parseInt(value);
    }
    
    // ... continue with other commands ...
    
    commandsUsed++;
    
    // Check if reached goal
    if (grid[robot.y]?.[robot.x] === 2) {
      break; // Success!
    }
    
    // Progress callback for visualization
    onProgress?.(robot, commandsUsed);
  }
  
  return {
    success: grid[robot.y]?.[robot.x] === 2,
    commandsUsed,
    stepsExecuted,
    wallHits,
    timeSpent: Date.now() - timeStart,
    finalPosition: { x: robot.x, y: robot.y },
    variables
  };
}
```

## 2. GameScreen.tsx Enhancements

### Command Palette by Category

```typescript
// Add to GameScreen.tsx

import { COMMAND_CATEGORIES, getAvailableCommandsForLevel } from '../game/constants';

function CommandPalette({ levelId }: { levelId: number }) {
  const availableCommands = getAvailableCommandsForLevel(levelId);
  
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(COMMAND_CATEGORIES).map(([categoryId, category]) => {
        const categoryCommands = category.commands.filter(cmd => availableCommands.includes(cmd));
        
        if (categoryCommands.length === 0) return null; // Don't show categories with no available commands
        
        return (
          <div key={categoryId} className="border rounded-lg p-3">
            <h3 className={`text-sm font-semibold ${getCategoryColor(category.color)} mb-2`}>
              {category.name}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryCommands.map(cmdId => (
                <CommandBlock
                  key={cmdId}
                  id={cmdId}
                  label={getCommandLabel(cmdId)}
                  color={category.color}
                  onDrag={(e) => handleDragStart(e, cmdId)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function getCategoryColor(color: string): string {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    indigo: 'text-indigo-600',
    red: 'text-red-600'
  };
  return colors[color] || 'text-gray-600';
}
```

### Block Counter with Star Goals

```typescript
function BlockCounter({ level, blocksUsed }: { level: LevelData; blocksUsed: number }) {
  const parBlocks = level.parCommands;
  const twoStarThreshold = Math.ceil(parBlocks * 1.2);
  const threeStarThreshold = Math.max(parBlocks - 1, Math.floor(parBlocks * 0.8));
  
  return (
    <div className="text-sm text-gray-600 mt-2">
      <div className="font-semibold mb-2">Blocks: {blocksUsed}/{level.maxCommands}</div>
      <div className="space-y-1 text-xs">
        <div className={blocksUsed <= parBlocks ? 'text-green-600 font-semibold' : ''}>
          ⭐⭐⭐ Master: ≤ {threeStarThreshold} blocks
        </div>
        <div className={blocksUsed <= twoStarThreshold ? 'text-green-600 font-semibold' : ''}>
          ⭐⭐ Good: ≤ {twoStarThreshold} blocks
        </div>
        <div className={'text-green-600 font-semibold'}>
          ⭐ Complete: Reach the goal
        </div>
      </div>
    </div>
  );
}
```

### Level Lock Indicator

```typescript
function LevelLockIndicator({ levelId, isUnlocked, unlockMessage }: any) {
  if (isUnlocked) return null;
  
  return (
    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
      <div className="text-center text-white">
        <div className="text-2xl mb-2">🔒</div>
        <div className="text-sm">{unlockMessage}</div>
      </div>
    </div>
  );
}
```

### Step-by-Step Execution Visualizer

```typescript
function ExecutionVisualizer({ 
  blocks, 
  executingBlockIndex, 
  robot, 
  variables 
}: {
  blocks: any[];
  executingBlockIndex: number;
  robot: RobotState;
  variables: Record<string, number>;
}) {
  return (
    <div className="bg-gray-100 rounded-lg p-3 text-xs">
      <div className="font-semibold mb-2">Execution</div>
      <div className="space-y-1 mb-3">
        {blocks.map((block, idx) => (
          <div
            key={idx}
            className={`px-2 py-1 rounded ${
              idx === executingBlockIndex
                ? 'bg-yellow-300 font-semibold'
                : idx < executingBlockIndex
                ? 'bg-green-200 line-through'
                : 'bg-white'
            }`}
          >
            {block.label || block}
          </div>
        ))}
      </div>
      <div className="border-t pt-2">
        <div>Position: ({robot.x}, {robot.y})</div>
        <div>Direction: {robot.direction}</div>
        {Object.entries(variables).length > 0 && (
          <div className="mt-1">
            Variables: {JSON.stringify(variables)}
          </div>
        )}
      </div>
    </div>
  );
}
```

## 3. ResultScreen.tsx Enhancements

```typescript
import { calculateStarsEarned, getUnlockMessage } from '../game/GameContext';

function ResultScreen({ level, commandsUsed, timeSpent }: any) {
  const earnedStars = calculateStarsEarned(level, commandsUsed);
  const nextLevelUnlocked = earnedStars >= 2;
  
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Level {level.id} Complete!</h1>
      
      <div className="text-center">
        <div className="text-5xl mb-2">
          {earnedStars === 3 ? '⭐⭐⭐' : earnedStars === 2 ? '⭐⭐' : '⭐'}
        </div>
        <div className="text-lg font-semibold">
          {earnedStars}/3 Stars
        </div>
      </div>
      
      <div className="text-sm text-gray-600 space-y-1">
        <div>Complexity Score: {level.complexityScore}/150</div>
        <div>Blocks Used: {commandsUsed}/{level.parCommands} optimal</div>
        <div>Time: {(timeSpent/1000).toFixed(1)}s</div>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        {nextLevelUnlocked ? (
          <div className="text-green-600 font-semibold">
            🔓 Level {level.id + 1} Unlocked!
          </div>
        ) : (
          <div className="text-orange-600 text-sm">
            {getUnlockMessage(level.id + 1)}
          </div>
        )}
      </div>
      
      <button onClick={() => nextLevel()}>
        Continue
      </button>
    </div>
  );
}
```

## 4. Level Selection Screen

```typescript
function LevelProgressMap({ levelProgress, onSelectLevel }: any) {
  const phases = [
    { phase: 1, name: 'Foundations', levels: levelData.filter(l => l.phase === 1) },
    { phase: 2, name: 'Builder', levels: levelData.filter(l => l.phase === 2) },
    { phase: 3, name: 'Architect', levels: levelData.filter(l => l.phase === 3) },
    { phase: 4, name: 'Master', levels: levelData.filter(l => l.phase === 4) },
  ];
  
  return (
    <div className="space-y-8">
      {phases.map(phase => (
        <div key={phase.phase}>
          <h2 className="text-xl font-bold mb-3">{phase.name}</h2>
          <div className="grid grid-cols-5 gap-3">
            {phase.levels.map(level => {
              const progress = levelProgress[level.id];
              const isUnlocked = isLevelUnlocked(level.id, levelProgress);
              
              return (
                <button
                  key={level.id}
                  onClick={() => onSelectLevel(level.id)}
                  disabled={!isUnlocked}
                  className={`
                    relative p-4 rounded-lg text-center font-semibold
                    ${isUnlocked 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }
                  `}
                >
                  <div>L{level.id}</div>
                  <div className="text-sm">
                    {progress?.stars ? '⭐'.repeat(progress.stars) : '○'}
                  </div>
                  {!isUnlocked && <LevelLockIndicator />}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

## Testing Checklist

After implementing these changes:

- [ ] Level 1 always unlocked
- [ ] Can select Level 1 and see correct commands
- [ ] Complete Level 1 with ≤ parCommands = 2+ stars
- [ ] After 2+ stars on L1, Level 2 unlocks
- [ ] Command palette changes when selecting different levels
- [ ] Block counter shows correct par/optimal thresholds
- [ ] Until Wall sensor works in execution
- [ ] If Wall Left/Right sensors work
- [ ] Variables persist during level execution
- [ ] Result screen shows stars correctly
- [ ] Result screen shows unlock/lock message

## Priority Order for Implementation

1. Helper functions and constants ✅
2. Execution logic updates (sensors, variables)
3. GameScreen command palette reorganization
4. Block counter with star thresholds
5. Level lock/unlock system
6. ResultScreen update with star display
7. LevelProgressMap visualization
8. Step-by-step execution visualizer (nice-to-have)
