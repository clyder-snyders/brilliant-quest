# Blockly Maze Redesign - Implementation Guide

**STATUS**: 50 levels redesigned ✅ | Remaining components: UI & Game Logic

## ✅ Completed
1. **types.ts** - Updated with phase, complexityScore, decision tracking
2. **levels.ts** - Complete 50-level progression with Blockly Maze structure
   - Phase 1 (L1-10): Foundations (5×5, 6×6 grids)
   - Phase 2 (L11-25): Builder (8×8 grids)
   - Phase 3 (L26-40): Architect (10×10 grids)
   - Phase 4 (L41-50): Master (12×12 grids)

## 🔧 Remaining Implementation Tasks

### 1. Constants Updates (constants.ts)
Add phase-based configuration:
```typescript
COMMAND_AVAILABILITY = {
  phase1: ['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'],
  phase2: [...phase1, 'repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall'],
  phase3: [...phase2, 'ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse'],
  phase4: [...phase3, 'setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp'],
}

STAR_THRESHOLDS = {
  1: { parBlocks: 5, timeLimit: 30 },      // 3 stars if ≤ parBlocks in parTime
  2: { parBlocks: 10, timeLimit: 50 },     // varies by level
  ...
}

COMPLEXITY_RANGES = {
  easy: [5, 15],      // Phase 1
  builder: [15, 40],  // Phase 2
  architect: [40, 80], // Phase 3
  master: [80, 150],  // Phase 4
}
```

### 2. GameContext Updates (GameContext.tsx)
```typescript
// Add to GameState interface
interface GameState {
  // Existing...
  phase: Phase; // Track current phase
  unlockedLevels: number[]; // Dynamically unlock
  levelMetadata: Record<number, {
    complexity: number;
    parBlocks: number;
    minBlocks?: number; // 1 star
    optimalBlocks?: number; // 2 stars
  }>;
}

// Add new methods
- getAvailableCommandsForLevel(levelId): string[]
- unlockLevel(levelId, reason): void
- calculateStars(levelId, commandsUsed, timeSpent): number
- canStartLevel(levelId): boolean (checks 2-star on previous)
```

### 3. GameScreen UI Enhancements (GameScreen.tsx)
```typescript
// Command Palette Reorganization
// Left Sidebar: Organize by category
<CommandPalette>
  <Category name="Movement" phase={1}>
    <Block>Move 1</Block>
    <Block>Move 2</Block>
    <Block>Move 3</Block>
    <Block>Turn Left</Block>
    <Block>Turn Right</Block>
  </Category>
  <Category name="Loops" phase={2}>
    <Block>Repeat 2×</Block> ...
  </Category>
  <Category name="Conditionals" phase={3}>
    <Block>If Path Ahead</Block> ...
  </Category>
  <Category name="Variables" phase={4}>
    <Block>Set Variable</Block> ...
  </Category>
</CommandPalette>

// Visual indicator of phase progress
<PhaseIndicator>
  Phase {level..phase}/4 - {phase_name}
  Complexity Score: {level.complexityScore}/150
</PhaseIndicator>

// Block counter with star system
<BlockCounter>
  Blocks Used: {blocksUsed}}/{level.maxCommands}
  ⭐ 1 Star: ≤ {parCommands}
  ⭐⭐ 2 Stars: ≤ {parCommands * 0.7}
  ⭐⭐⭐ 3 Stars: ≤ {parCommands * 0.5}
</BlockCounter>

// Progressive unlock indicator
<LevelLock>
  [LOCKED] Complete level {prevLevel} with 2+ stars to unlock
</LevelLock>
```

### 4. Game Engine Updates (GameContext.tsx execution logic)
```typescript
// Add Until Wall sensor
if (command === 'repeatUntilWall') {
  while (!isWallAhead(robot)) {
    robot.move();
    stepsExecuted++;
    if (stepsExecuted > MAX_STEPS) break; // safety
  }
}

// Add Wall detection sensors
const isWallLeft = (robot) => /* check grid to left */;
const isWallRight = (robot) => /* check grid to right */;
const isWallAhead = (robot) => /* check grid ahead */;

// Condition evaluation
if (condition === 'ifWallLeft') {
  if (isWallLeft(robot)) { executeBlock(thenBlock); }
  else if (elseBlock) { executeBlock(elseBlock); }
}

// Variables tracking
const variables: Record<string, number> = { 
  steps: 0, 
  turns: 0, 
  moves: 0 
};

function executeSetVariable(varName, value) {
  variables[varName] = value;
}

function executeChangeVariable(varName, delta) {
  variables[varName] += delta;
}

function evaluateCompareVariable(varName, operator, value): boolean {
  switch(operator) {
    case '=': return variables[varName] === value;
    case '>': return variables[varName] > value;
    case '<': return variables[varName] < value;
    case '>=': return variables[varName] >= value;
    case '<=': return variables[varName] <= value;
  }
}
```

### 5. Step-by-Step Execution (new feature)
```typescript
// Visualization component
<ExecutionVisualizer>
  {blocks.map((block, idx) => (
    <Block 
      key={idx} 
      active={idx === executingBlockIndex}
      completed={idx < executingBlockIndex}
      highlight={idx === executingBlockIndex}
    >
      {block.label}
    </Block>
  ))}
  <RobotStateDisplay>
    Position: ({robot.x}, {robot.y})
    Direction: {robot.direction}
    Variables: {JSON.stringify(variables)}
  </RobotStateDisplay>
</ExecutionVisualizer>

// Step execution in GameContext
- Pause between blocks (MOVE_DELAY, TURN_DELAY)
- Highlight executing block in workspace
- Show robot position update in real-time
```

### 6. Level Selection / Progression Screen
```typescript
// Show visual progression
<LevelProgressMap>
  {phases.map(phase => (
    <PhaseRow>
      <PhaseLabel>{phase.name}</PhaseLabel>
      {phase.levels.map(level => (
        <LevelButton
          locked={!canAccessLevel(level.id)}
          stars={progressData[level.id]?.stars || 0}
          onClick={() => startLevel(level.id)}
        />
      ))}
    </PhaseRow>
  ))}
</LevelProgressMap>

// Unlock flow: Level 1 → 2 stars on L1 → unlock L2
// If don't have 2 stars: "Meet the challenge! Get 2+ stars to continue."
```

### 7. Update Result Screen (ResultScreen.tsx)
```typescript
// Enhanced scoring display
<ResultScreen>
  <LevelComplete>
    <div>Level {level.id} Complete!</div>
    <ComplexityScore>
      Difficulty Score: {level.complexityScore}/150
    </ComplexityScore>
    
    <StarRating>
      ⭐⭐⭐ {earnedStars}/3 Stars
      
      <StarBreakdown>
        💯 Par Blocks: {parCommands} → ⭐⭐⭐ 3 stars
        📊 Efficiency: {commandsUsed}/{level.maxCommands} → ⭐⭐ 2 stars
        ✅ Completed: {earnedStars > 0 ? '⭐' : 'Try Again'}
      </StarBreakdown>
    </StarRating>
    
    <UnlockMessage>
      {earnedStars >= 2 && `🔓 Level ${level.id + 1} Unlocked!`}
      {earnedStars < 2 && `🔒 Get 2+ stars to unlock next level`}
    </UnlockMessage>
  </LevelComplete>
</ResultScreen>
```

## 3-Star System Implementation

**Star Calculation:**
```
function calculateStars(level, commandsUsed, timeSpent) {
  let stars = 0;
  
  // Completion star
  if (reachGoal) stars = 1;
  
  // Efficiency star
  if (commandsUsed <= level.parCommands * 1.2) stars++;
  
  // Mastery star
  if (commandsUsed <= level.parCommands * 0.8 || commandsUsed <= level.parCommands - 1) {
    stars++;
  }
  
  return Math.min(3, stars);
}
```

## Progressive Unlocking Flow

```
Level 1 (Unlocked by default)
    ↓ (Earn 2+ stars)
    ↓
Level 2 (Unlocked)
    ↓ (Earn 2+ stars)
    ↓
Level 3 (Unlocked)
    ... continues ...

Alternative: Unlock all, but show lock UI for levels not yet earned
"Complete Level {n} with 2+ stars to unlock this level"
```

## Testing Checklist

- [ ] All 50 levels load without errors
- [ ] Command availability changes by level/phase
- [ ] 3-star calculation works for each level
- [ ] Progressive unlock shows/enforces correctly
- [ ] Until Wall sensor works in execution
- [ ] Wall left/right sensors work in conditions
- [ ] Variables can be set, changed, compared
- [ ] Complexity scores display correctly
- [ ] Step-by-step execution shows highlights
- [ ] Result screen shows stars and unlock messages
- [ ] GameScreen shows correct block palette per level

## Performance Considerations

- **Level Loading**: 50 levels with grids should load quickly (already cached)
- **Complexity Calculation**: Pre-computed in levelData, no runtime calculation
- **Execution Visualization**: Throttle block highlighting to MOVE_DELAY (350ms)
- **Storage**: levelProgress stored with level ID keys (efficient)

## Next Steps (Phase 2)
1. Implement GameContext updates for progressive unlocking
2. Update GameScreen command palette UI
3. Add step-by-step execution highlighting
4. Update ResultScreen with star system UI
5. Test all levels in each phase
6. Polish difficulty curve based on playtest feedback
