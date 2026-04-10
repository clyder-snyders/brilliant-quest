# Brilliant OS - Development Roadmap

## 🎮 Game Completion Roadmap

### Phase 1: Core Game Completion (CRITICAL) - Est. 30-40 hours

#### 1.1 Complete All 50 Levels
**Status:** ❌ Only 21/50 defined  
**Location:** `src/game/levels.ts`

**What's Missing:**
- Levels 22-38 (Zone 2 completion + Zone 3)
- Levels 39-50 (Zone 4) 

**Level Design Requirements by Zone:**

**Zone 1 (Levels 1-12): Foundations** ✅ Complete
- Focus: Basic movement, turning, sequencing
- Commands: moveForward (1/2/3), turnLeft, turnRight, turnAround
- Difficulty: Easy, linear progressions
- ✅ Status: Complete

**Zone 2 (Levels 13-24): Builder** 🟡 Partial (13-21 done)
- Focus: Loops (repeat 2x-5x, repeatUntilGoal)
- Commands: All movement + repeat commands
- Levels 22-24: Teach "repeat until" in complex scenarios
- Difficulty: Medium, more maze-like layouts
- **MISSING Levels:** 22, 23, 24 (3 levels)

**Zone 3 (Levels 25-38): Architect** ❌ Not Started
- Focus: Conditional logic, variables
- Commands: if/else blocks, compare operations, set/change variables
- New Mechanic: Multi-path solutions, optimization challenges
- Difficulty: Hard, algorithmic thinking required
- Pattern Examples:
  - Level 25: Simple conditional (if path ahead → move)
  - Level 28: Variables (set counter, use in loop)
  - Level 32: Combined if/else + variables
  - Level 36: Nested conditions
  - Level 38: Complex optimization challenge
- **MISSING Levels:** All 14 (25-38)

**Zone 4 (Levels 39-50): Master** ❌ Not Started
- Focus: Functions, advanced algorithms, optimization puzzles
- Commands: defineFunction, callFunction, all previous
- New Mechanic: Parameter passing, recursion, code reuse
- Difficulty: Very Hard, computer science concepts
- Pattern Examples:
  - Level 39: Simple function definition
  - Level 42: Function with parameters
  - Level 45: Recursive function challenge
  - Level 48: Multi-function solution required
  - Level 50: Ultimate optimization (par 5 commands for complex maze)
- **MISSING Levels:** All 12 (39-50)

**Implementation Steps:**
1. Design grid layouts for Levels 22-50 (use `fillGrid()`, `setPath()` helpers)
2. Define par times and commands for each
3. Write level hints and concept descriptions
4. Test each level vs its par requirements
5. Verify difficulty progression

**Timeline:** 15-20 hours

---

#### 1.2 Implement Conditional Logic Engine
**Status:** ❌ Not Implemented  
**Location:** `src/screens/GameScreen.tsx` (runSequence function)

**Required Features:**
```
Commands to Implement:
- ifPathAhead (already partially done)
- ifWallAhead (inverse check)
- ifGoalAhead (already done)
- ifElse blocks
- Comparison operators: ==, <, >, <=, >=
- Logical operators: AND (&&), OR (||), NOT (!)
```

**Architecture:**
```typescript
// Execution context for conditions
interface ExecutionContext {
  position: {x, y}
  direction: Direction
  variables: Record<string, number>
  gridState: TileType[][]
}

// Parse if/else blocks
function parseIfBlock(cmd: string): {
  condition: string,
  ifBody: string[],
  elseBody?: string[]
}

// Evaluate conditions
function evaluateCondition(condition: string, context: ExecutionContext): boolean
```

**Implementation Steps:**
1. Create condition parser 
2. Implement condition evaluator
3. Update runSequence to handle if/else blocks
4. Add UI for building if/else blocks (visual editor)
5. Test with Levels 22-26

**Timeline:** 12-18 hours

---

#### 1.3 Implement Variable System  
**Status:** ❌ Not Implemented  
**Location:** `src/screens/GameScreen.tsx`

**Required Features:**
```
Commands to Implement:
- setVariable (var_name = value)
- changeVariable (var_name += or -= amount)
- compareVariable (if var > value)
- Use in conditions and loops
```

**Architecture:**
```typescript
// Add to execution context:
variables: {
  [varName: string]: number
}

// Operations:
- setVariable("counter", 0)
- changeVariable("counter", 1) // increment
- compareVariable("counter", ">", 10) // condition
```

**Use Cases (From Levels):**
- Loop N times (set counter, decrease each iteration)
- Count steps until goal
- Track wall collisions

**Implementation Steps:**
1. Add variable storage to execution context
2. Create set/change/compare variable handlers
3. Update condition evaluator to check variables
4. Update score calculation (bonus for variable usage)
5. Test with Levels 25-30

**Timeline:** 10-15 hours

---

#### 1.4 Implement Function System
**Status:** ❌ Not Implemented  
**Location:** `src/screens/GameScreen.tsx`

**Required Features:**
```
Commands to Implement:
- defineFunction (define myFunc { ... })
- callFunction (call myFunc)
- Parameters (optional: advanced)
- Return values (optional: advanced)
```

**Use Cases:**
- Avoid code repetition
- Solve problems with DRY principle
- Teach abstraction and modularity

**Implementation Steps:**
1. Add function definitions storage
2. Parse defineFunction blocks
3. Handle callFunction by substituting function body
4. Support recursive calls
5. Update scoring for function usage
6. Test with Levels 35-40

**Timeline:** 10-15 hours

---

### Phase 2: Gameplay & UX Improvements (HIGH) - Est. 20-30 hours

#### 2.1 Improve Zone Unlock Logic
**Status:** 🟡 Needs redesign
**Location:** `src/screens/LevelMapScreen.tsx` (Lines 26-32)

**Current Issue:**
```typescript
// CURRENT: Requires 100% completion
const isZoneAccessible = (zoneId: number) => {
  const zoneLevels = levelData.filter(l => l.zone === zoneId - 1);
  return zoneLevels.every(l => state.levelProgress[l.id]?.completed); // ALL must complete
};
```

**Better Options:**

Option A: Flexible Completion Threshold
```typescript
const isZoneAccessible = (zoneId: number) => {
  if (zoneId === 1) return true;
  const zoneLevels = levelData.filter(l => l.zone === zoneId - 1);
  const completedCount = zoneLevels.filter(l => state.levelProgress[l.id]?.completed).length;
  return completedCount >= zoneLevels.length * 0.7; // 70% completion
};
```

Option B: Unlock First Level of Next Zone Early
```typescript
const isLevelUnlocked = (levelId: number) => {
  if (levelId === 1) return true;
  const prevLevel = levelId - 1;
  return state.levelProgress[prevLevel]?.completed === true;
};

// But show "Recommended: Complete previous zone first"
```

**Timeline:** 2-3 hours

---

#### 2.2 Add Error Boundaries & Data Validation
**Status:** ❌ Not Implemented

**Add React Error Boundary:**
```typescript
class ErrorBoundary extends React.Component {
  // Catch and display errors gracefully
}
```

**Validate Level Data:**
```typescript
function validateLevelData(level: LevelData): {valid: boolean, errors: string[]} {
  const errors = [];
  if (!level.grid || !Array.isArray(level.grid)) errors.push("Grid required");
  if (level.grid.some(row => row.length !== level.gridSize)) errors.push("Grid dimensions mismatch");
  // ... more checks
  return {valid: errors.length === 0, errors};
}
```

**Validate localStorage:**
```typescript
function recoverCorruptedData() {
  // Attempt to salvage uncorrupted fields
  // Show notification to user if data was lost
}
```

**Timeline:** 5-8 hours

---

#### 2.3 Add Progressive Hint System  
**Status:** 🟡 Exists but basic

**Current:** Hints are just plain text

**Improvements:**
- **Tier 1:** Concept reminder ("This level teaches Loops")
- **Tier 2:** Strategy hint ("Focus on moving right first")
- **Tier 3:** Partial solution revealed (grid with suggested path)
- **Visual Aid:** Show path on grid with semi-transparent overlay

**Implementation:**
```typescript
interface Hint {
  tier1: string; // Concept
  tier2: string; // Strategy
  tier3: {
    suggestedMoves: number,
    partialSequence: string[]
  };
}
```

**Timeline:** 8-12 hours

---

#### 2.4 Better Mobile Responsiveness  
**Status:** 🔴 Broken on mobile

**Issues:**
- Left panel hidden on mobile
- Right panel always 260px (no room for grid)
- Grid text too small
- Touch controls not optimized

**Solutions:**
- Stack panels vertically on mobile
- Hide command list by default, show expandable menu
- Increase touch-friendly button sizes
- Use swipe gestures for command selection

**Timeline:** 8-10 hours

---

#### 2.5 Add Session Persistence
**Status:** ❌ Not Implemented

**Feature:** Auto-save current sequence every 2 seconds to sessionStorage

**Benefit:** User doesn't lose work on accidental refresh

**Implementation:**
```typescript
// Save to sessionStorage every 2 seconds
useEffect(() => {
  const saves = setInterval(() => {
    sessionStorage.setItem(`level_${state.currentLevel}_sequence`, JSON.stringify(sequence));
  }, 2000);
  return () => clearInterval(saves);
}, [sequence, state.currentLevel]);

// Load on component mount
useEffect(() => {
  const saved = sessionStorage.getItem(`level_${state.currentLevel}_sequence`);
  if (saved) setSequence(JSON.parse(saved));
}, [state.currentLevel]);
```

**Timeline:** 2-3 hours

---

### Phase 3: Polish & Engagement (MEDIUM) - Est. 15-25 hours

#### 3.1 Achievement/Badge System
**Features:**
- Unlock badges for milestones
  - "Speedrunner" - Complete zone in < par time
  - "Perfect 3-Star Run" - Get 3 stars first try
  - "Master of Repeats" - Complete all loop-focused levels
  - "Algorithm Master" - Complete all conditional levels
  - Etc.

**Implementation:**
- Add achievements array to GameState
- Check on level completion
- Display in level map / leaderboard

**Timeline:** 8-10 hours

---

#### 3.2 Tutorial/Onboarding
**Features:**
- Interactive tutorial for Level 0.5
- Animated introduction to robot movement
- Guided walkthrough of interface
- Explain par system

**Timeline:** 8-10 hours

---

#### 3.3 Sound Effects & Music
**Features:**
- Background music (loopable, educational tone)
- SFX: Level complete, wall hit, goal reached
- Audio feedback for button clicks

**Implementation:**
- Use free assets from Freepik or Zapsplat  
- React Audio library for playback
- Settings to mute/unmute

**Timeline:** 5-8 hours

---

#### 3.4 Visual Polish
**Features:**
- Better confetti for 3-star completions
- Animated level difficulty indicators
- Smoother robot animations
- Hover effects on level buttons
- Loading states

**Timeline:** 5-8 hours

---

### Phase 4: Advanced Features (LOW) - Est. 20-40 hours

#### 4.1 Custom Level Editor
**Features:**
- Create custom levels
- Share level codes
- Community levels

#### 4.2 Multiplayer/Competitive Mode
**Features:**
- Head-to-head mode
- Speed runs
- Leaderboard categories

#### 4.3 Undo/Redo System
**Features:**
- Full command history
- Undo/redo unlimited

#### 4.4 Code Export
**Features:**
- Export solutions as Python/JavaScript

---

## 📋 Implementation Checklist

### BEFORE shipping game publicly:
- [ ] All 50 levels designed and tested
- [ ] Conditional logic working
- [ ] Variable system working
- [ ] Function system working
- [ ] Error boundaries in place
- [ ] Data validation implemented
- [ ] Mobile layout responsive
- [ ] Accessibility (ARIA labels) complete
- [ ] Level balance verified (par times)

### Nice-to-have (not blocking release):
- [ ] Progressive hints
- [ ] Achievement system
- [ ] Tutorial/Onboarding  
- [ ] Sound effects
- [ ] Visual polish
- [ ] Session persistence

---

## Time Estimate Summary

| Phase | Est. Hours | Blocking Release? |
|-------|-----------|------------------|
| **Phase 1: Core Completion** | 40-50 | ✅ YES |
| **Phase 2: UX/Stability** | 20-30 | ✅ YES (2.2) |
| **Phase 3: Polish** | 15-25 | ❌ NO |
| **Phase 4: Advanced** | 20-40 | ❌ NO |
| **TOTAL** | **95-145 hours** | - |

**Minimum for playable game:** ~60 hours (Phases 1.1-1.4, Phase 2.2)

---

## Questions to Answer

1. **Level Design:** Do you have difficulty curves/par times defined for all 50 levels?
2. **Monetization:** Will this be free-to-play, premium, or ads-supported?
3. **Platform:** Web only, or mobile app wrapping?
4. **Scope:** Full 50 levels or reduced set for MVP?
5. **Timeline:** When do you want to launch?

