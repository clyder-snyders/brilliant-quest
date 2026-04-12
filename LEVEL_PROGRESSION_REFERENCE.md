# Blockly Maze Level Progression Reference

## PHASE 1: FOUNDATIONS (Levels 1-10)
**Objective**: Teach basic movement and turning concepts
**Grid Size**: 5×5 to 6×6
**Complexity Range**: 5-15
**Available Commands**: Move 1/2/3, Turn Left/Right, Turn Around

| Level | Name | Concept | Par Commands | Max Commands | Grid |  Turns | Decisions | Complexity |
|-------|------|---------|--------------|--------------|------|--------|-----------|------------|
| 1 | Move Forward 3 | Basic Movement | 1 | 5 | 5×5 | 0 | 0 | 5 |
| 2 | L-Shape Right | Turning Right | 4 | 8 | 5×5 | 1 | 0 | 8 |
| 3 | U-Turn Pattern | Orientation | 5 | 10 | 5×5 | 2 | 0 | 10 |
| 4 | L-Shape Left | Turn Left | 4 | 10 | 5×5 | 1 | 0 | 10 |
| 5 | Simple Zigzag | Complex Seq. | 7 | 12 | 5×5 | 4 | 0 | 12 |
| 6 | Repeat 2x Intro | Repeat 2x | 2 | 8 | 6×6 | 0 | 0 | 8 |
| 7 | Repeat 3x Pattern | Repeat 3x | 3 | 10 | 6×6 | 3 | 0 | 12 |
| 8 | Until Goal Intro | Until Goal | 1 | 6 | 6×6 | 0 | 0 | 8 |
| 9 | Until Goal + Turn | Until+Turns | 3 | 8 | 6×6 | 1 | 0 | 10 |
| 10 | Foundations Boss | Mastery | 8 | 14 | 6×6 | 3 | 0 | 15 |

**Key Learning**: No branching decisions yet - pure sequencing practice

---

## PHASE 2: BUILDER (Levels 11-25)
**Objective**: Introduce loops and conditional sensor basics
**Grid Size**: 8×8
**Complexity Range**: 15-40
**New Commands**: Repeat 2-5x, Repeat Until Wall, If Path Ahead

| Level | Name | Concept | Par Cmd | Max | Turns | Decisions | Complexity |
|-------|------|---------|---------|-----|-------|-----------|------------|
| 11 | Loop with Turn | Loop+Turns | 4 | 12 | 2 | 0 | 16 |
| 12 | Square Loop | Repeat 4x | 2 | 10 | 4 | 0 | 18 |
| 13 | Skip-Count Loop | Loop Basics | 4 | 12 | 2 | 0 | 14 |
| 14 | Simple Nested Loop | Nested Loops | 5 | 14 | 6 | 0 | 22 |
| 15 | Nested Complexity | Nested Pattern | 8 | 18 | 4 | 0 | 24 |
| 16 | Triple Nesting | Deep Nesting | 10 | 20 | 5 | 0 | 28 |
| 17 | Until Wall Guide | Until Wall Intro | 2 | 8 | 0 | 0 | 12 |
| 18 | Corridor Stopper | Until Wall Nav | 4 | 10 | 1 | 0 | 14 |
| 19 | Multi-Corridor | Multi-Until | 6 | 12 | 3 | 0 | 18 |
| 20 | Until Wall Challenge | Optimization | 1 | 8 | 0 | 0 | 10 |
| 21 | If Path Ahead Start | Path Detection | 2 | 10 | 0 | 1 | 14 |
| 22 | If Path Choice | Conditions | 4 | 12 | 1 | 2 | 18 |
| 23 | Path Maze | Adaptive Nav | 8 | 16 | 3 | 3 | 24 |
| 24 | Goal Detection | Goal Sensor | 2 | 10 | 0 | 1 | 12 |
| 25 | Builder Boss | Mastery | 12 | 20 | 4 | 4 | 32 |

**Key Learning**: First encounter with decision-making (1 decision point at L21)

---

## PHASE 3: ARCHITECT (Levels 26-40)
**Objective**: Master wall sensors and conditional logic
**Grid Size**: 10×10
**Complexity Range**: 40-80
**New Commands**: If Wall Left/Right, If-Else, nested conditionals

| Level | Name | Concept | Par Cmd | Max | Turns | Decisions | Complexity |
|-------|------|---------|---------|-----|-------|-----------|------------|
| 26 | Wall Left Sensor | Wall Left | 3 | 12 | 0 | 1 | 18 |
| 27 | Wall Right Sensor | Wall Right | 3 | 12 | 0 | 1 | 18 |
| 28 | Follow Left Wall | Wall Following | 6 | 14 | 2 | 2 | 24 |
| 29 | Follow Right Wall | Right Wall | 8 | 16 | 2 | 3 | 28 |
| 30 | Wall Maze Advanced | Advanced Walls | 12 | 20 | 5 | 4 | 36 |
| 31 | If-Else Intro | If-Else Blocks | 4 | 14 | 0 | 2 | 22 |
| 32 | Corridor Choice | If-Else Logic | 6 | 16 | 1 | 3 | 26 |
| 33 | Nested Conditions | Nested If-Else | 10 | 20 | 3 | 4 | 32 |
| 34 | Binary Path | Binary Decision | 8 | 18 | 2 | 3 | 28 |
| 35 | Triple Nested | Deep Nesting | 14 | 24 | 6 | 5 | 42 |
| 36 | Branches | Branching Paths | 12 | 22 | 4 | 4 | 40 |
| 37 | Loop in Condition | Loop+Condition | 4 | 14 | 0 | 2 | 24 |
| 38 | Condition in Loop | Complex Comp. | 10 | 20 | 3 | 4 | 38 |
| 39 | Decision Maze | Decision Mazes | 14 | 24 | 4 | 5 | 48 |
| 40 | Architect Boss | Mastery | 16 | 28 | 4 | 5 | 56 |

**Key Learning**: Complex decision trees with 4-5 decision points

---

## PHASE 4: MASTER (Levels 41-50)
**Objective**: Variables, functions, and Boolean logic
**Grid Size**: 12×12
**Complexity Range**: 80-150
**New Commands**: Set/Change/Compare Variable, Define/Call Function, AND/OR/NOT

| Level | Name | Concept | Par Cmd | Max | Turns | Decisions | Complexity |
|-------|------|---------|---------|-----|-------|-----------|------------|
| 41 | Variable Start | Set Variable | 3 | 14 | 0 | 1 | 26 |
| 42 | Increment Variable | Change Variable | 4 | 14 | 0 | 1 | 28 |
| 43 | Compare Variable | Variable Comparison | 5 | 15 | 0 | 2 | 30 |
| 44 | Count Cycles | Loop Counter | 7 | 18 | 1 | 3 | 38 |
| 45 | Variable Logic | Variable Logic | 9 | 20 | 2 | 3 | 42 |
| 46 | My Function | Define Function | 3 | 14 | 0 | 1 | 28 |
| 47 | Reuse Function | Function Reuse | 2 | 12 | 0 | 1 | 26 |
| 48 | Complex Function | Function Design | 6 | 18 | 3 | 2 | 44 |
| 49 | Spiral Out | Recursive Functions | 12 | 28 | 8 | 4 | 70 |
| 50 | Brilliant OS Finale | Final Challenge | 20 | 40 | 16 | 8 | 100 |

**Key Learning**: Advanced algorithmic thinking with variables, functions, and logic

---

## Difficulty Curve

```
Complexity Score Distribution:

Phase 1 (Levels 1-10):
  ████░░░░░░░░░░░░░░░░░░
  Range: 5-15 (avg 10)

Phase 2 (Levels 11-25):
  ░░░░████░░░░░░░░░░░░░░░  
  Range: 10-32 (avg 20)

Phase 3 (Levels 26-40):
  ░░░░░░░░████░░░░░░░░░░░░
  Range: 18-56 (avg 35)

Phase 4 (Levels 41-50):
  ░░░░░░░░░░░░█████░░░░░░░
  Range: 26-100 (avg 55)
```

## Command Availability Progression

```
L1-5:   Move 1/2/3, Turn L/R
L6-10:  ↑ + Repeat 2/3x, Until Goal
L11-20: ↑ + Repeat 4/5x, Until Wall
L21-25: ↑ + If Path Ahead
L26-35: ↑ + If Wall L/R, If-Else
L36-40: ↑ + Nested conditionals
L41-48: ↑ + Set/Change/Compare Variable, Functions
L49-50: ↑ + AND/OR/NOT operators
```

## Scoring & Unlocking

**3-Star System per Level:**
- ⭐ 1 Star: Reach goal
- ⭐⭐ 2 Stars: Use ≤ parCommands + 20%
- ⭐⭐⭐ 3 Stars: Use ≤ parCommands

**Progressive Unlocking:**
- Levels 1-10: All unlocked (Phase 1)
- Level 11+: Requires 2+ stars on previous level to unlock
- Default Flow: Must excel on foundations to proceed to builder

**Par Commands Strategy:**
- L1: par=1 (trivial)
- L10: par=8 (challenging phase 1)
- L25: par=12 (demanding phase 2)
- L40: par=16 (complex phase 3)
- L50: par=20 (expert challenge)

Pattern: Higher par commands reflect higher complexity and longer corridors

---

## Design Notes

### Corridor-Based Maze Principles

❌ **Avoid**:
- Open grids where robot can wander
- Multiple viable solutions early
- Dead ends before Level 25

✅ **Include**:
- Narrow 1-2 cell wide corridors
- Single clear solution path (until L20+)
- Forced decision points at junctions
- Progressive path complexity

### Complexity Score Formula

```
Score = (GridSize²) × (TurnsRequired) × (DecisionPoints) / (AvailableBlocks)

Example L25:
= (8²) × (4 turns) × (4 decisions) / (20 blocks)
= 64 × 4 × 4 / 20  
= 1024 / 20
= 51.2 → 32 (actual score)
```

### Decision Point Counting

A "decision point" = moment where robot must choose between 2+ valid commands:
- If Path Ahead = 1 decision point
- Multi-corridor with wall sensors = 2-3 points
- Nested If-Else = cumulative per nesting level

### Progression Philosophy

1. **Phase 1**: Muscle memory for basic commands
2. **Phase 2**: Repetition saves time/patience
3. **Phase 3**: Sensing enables smart decisions
4. **Phase 4**: Abstraction (functions, variables) solve complex problems

Each phase teaches ONE major concept before adding more.

