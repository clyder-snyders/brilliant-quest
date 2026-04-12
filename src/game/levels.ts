import { LevelData } from './types';

// Helper: create grid filled with a value
const fillGrid = (size: number, val: number = 0): number[][] =>
  Array.from({ length: size }, () => Array(size).fill(val));

const setPath = (grid: number[][], cells: [number, number][], val: number = 0) => {
  cells.forEach(([r, c]) => { grid[r][c] = val; });
  return grid;
};

// Complexity Score Calculator: (Grid Cells) × (Turns Required) × (Decision Points) / (Available Blocks)
const calcScore = (gridSize: number, turns: number, decisions: number, blocks: number): number => {
  return Math.round((gridSize * gridSize * turns * decisions) / Math.max(blocks, 1));
};

// Generate all 50 levels with Blockly Maze progression
function createLevels(): LevelData[] {
  const levels: LevelData[] = [];

  // ===== PHASE 1: FOUNDATIONS (Levels 1-10) - BLOCKLY MAZE ALIGNED =====
  // L1: Move forward 1 step (trivial - just show you can move)
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1]]);
    g[2][0] = 3; g[2][1] = 2;
    levels.push({ 
      id:1, name:"Move Forward 1", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:10, parCommands:1, 
      availableCommands:['moveForward1'], 
      maxCommands:3, hint:"Move forward one space to reach the goal.", 
      conceptTaught:"Basic Movement", zone:1,
      requiredTurns:0, decisionPoints:0, complexityScore: 2
    });
  })();

  // L2: Move forward 2 steps
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1],[2,2]]);
    g[2][0] = 3; g[2][2] = 2;
    levels.push({ 
      id:2, name:"Move Forward 2", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:15, parCommands:1, 
      availableCommands:['moveForward1'], 
      maxCommands:3, hint:"Move forward twice to reach the goal.", 
      conceptTaught:"Repeated Movement", zone:1,
      requiredTurns:0, decisionPoints:0, complexityScore: 3
    });
  })();

  // L3: Move forward 3 steps
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3]]);
    g[2][0] = 3; g[2][3] = 2;
    levels.push({ 
      id:3, name:"Move Forward 3", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:15, parCommands:1, 
      availableCommands:['moveForward1'], 
      maxCommands:4, hint:"Move forward three times to reach the goal.", 
      conceptTaught:"Multiple Steps", zone:1,
      requiredTurns:0, decisionPoints:0, complexityScore: 3
    });
  })();

  // L4: Move forward 4 times (must use 4 move blocks)
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4]]);
    g[2][0] = 3; g[2][4] = 2;
    levels.push({ 
      id:4, name:"Move Forward 4", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:15, parCommands:1, 
      availableCommands:['moveForward1'], 
      maxCommands:5, hint:"Move forward four times to reach the goal.", 
      conceptTaught:"Extended Sequencing", zone:1,
      requiredTurns:0, decisionPoints:0, complexityScore: 4
    });
  })();

  // L5: Turn right then move forward
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1],[2,2],[3,2],[4,2]]);
    g[2][0] = 3; g[4][2] = 2;
    levels.push({ 
      id:5, name:"Turn Right", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:20, parCommands:3, 
      availableCommands:['moveForward1','turnRight'], 
      maxCommands:6, hint:"Turn right then move forward.", 
      conceptTaught:"Turning Right", zone:1,
      requiredTurns:1, decisionPoints:0, complexityScore: 4
    });
  })();

  // L6: Turn left then move forward
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1],[2,2],[1,2],[0,2]]);
    g[2][0] = 3; g[0][2] = 2;
    levels.push({ 
      id:6, name:"Turn Left", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:20, parCommands:3, 
      availableCommands:['moveForward1','turnLeft'], 
      maxCommands:6, hint:"Turn left then move forward.", 
      conceptTaught:"Turning Left", zone:1,
      requiredTurns:1, decisionPoints:0, complexityScore: 4
    });
  })();

  // L7: L-shaped path (right+down)
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4]]);
    g[2][0] = 3; g[4][4] = 2;
    levels.push({ 
      id:7, name:"L-Shape 1", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:25, parCommands:5, 
      availableCommands:['moveForward1','turnRight','turnLeft'], 
      maxCommands:8, hint:"Move right, then turn right, then move down.", 
      conceptTaught:"Complex Path", zone:1,
      requiredTurns:1, decisionPoints:0, complexityScore: 5
    });
  })();

  // L8: L-shaped path (down+right)
  (() => {
    const g = fillGrid(5, 1);
    setPath(g, [[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]]);
    g[2][0] = 3; g[4][4] = 2;
    levels.push({ 
      id:8, name:"L-Shape 2", phase:1, gridSize:5, grid:g as any, 
      robotStart:{x:0,y:2,direction:'down'}, parTime:25, parCommands:5, 
      availableCommands:['moveForward1','turnRight','turnLeft'], 
      maxCommands:8, hint:"Move down, then turn right, then move right.", 
      conceptTaught:"Path Variation", zone:1,
      requiredTurns:1, decisionPoints:0, complexityScore: 5
    });
  })();

  // L9: Introduce Repeat (4 identical moves)
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4]]);
    g[2][0] = 3; g[2][4] = 2;
    levels.push({ 
      id:9, name:"Repeat Introduction", phase:1, gridSize:6, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:20, parCommands:2, 
      availableCommands:['moveForward1','repeat4','repeat5','turnLeft','turnRight'], 
      maxCommands:6, hint:"Use Repeat 4× [Move Forward] to reach the goal.", 
      conceptTaught:"Repeat Loops", zone:1,
      requiredTurns:0, decisionPoints:0, complexityScore: 5
    });
  })();

  // L10: Phase 1 Boss - Repeat + turns
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[3,3],[4,3],[4,2],[4,1],[4,0]]);
    g[2][0] = 3; g[4][0] = 2;
    levels.push({ 
      id:10, name:"Foundations Boss", phase:1, gridSize:6, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:35, parCommands:4, 
      availableCommands:['moveForward1','repeat3','repeat4','repeat5','turnLeft','turnRight'], 
      maxCommands:8, hint:"Use loops and turns to navigate around the obstacle.", 
      conceptTaught:"Foundations Mastery", zone:1,
      requiredTurns:2, decisionPoints:0, complexityScore: 8
    });
  })();

  // ===== PHASE 2: BUILDER (Levels 11-25) =====
  // Introduce fixed-count loops with turns, nested loops, Until Wall sensor, If Path Ahead conditionals

  // L11: Repeat 2x with Turn (corridor pattern)
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[3,4],[4,4],[5,4],[6,4]]);
    g[3][0] = 3; g[6][4] = 2;
    levels.push({ 
      id:11, name:"Repeat 2x Turn", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:28, parCommands:4, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeatUntilGoal','turnLeft','turnRight','turnAround'],
      maxCommands:12, hint:"Move forward, turn right, move again. Use Repeat 2x to simplify.", 
      conceptTaught:"Repeat with Turns", zone:2,
      requiredTurns:1, decisionPoints:0, complexityScore: 10
    });
  })();

  // L12: Repeat 2x with multiple turns
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[2,0],[2,1],[3,1],[4,1],[4,2],[4,3],[4,4],[4,5]]);
    g[2][0] = 3; g[4][5] = 2;
    levels.push({ 
      id:12, name:"Repeat Turn Pattern", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:32, parCommands:5, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeatUntilGoal','turnLeft','turnRight','turnAround'],
      maxCommands:14, hint:"Identify the repeating [Move-Turn-Move] pattern.", 
      conceptTaught:"Pattern Recognition", zone:2,
      requiredTurns:2, decisionPoints:0, complexityScore: 12
    });
  })();

  // L13: Repeat 3x with turn sequence
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[1,0],[1,1],[1,2],[2,2],[3,2],[3,1],[3,0],[4,0],[5,0],[5,1],[5,2],[6,2],[6,3]]);
    g[1][0] = 3; g[6][3] = 2;
    levels.push({ 
      id:13, name:"Repeat 3x Sequence", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:38, parCommands:6, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeatUntilGoal','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Use Repeat 3x to execute the same sequence three times.", 
      conceptTaught:"Repeat 3x", zone:2,
      requiredTurns:3, decisionPoints:0, complexityScore: 14
    });
  })();

  // L14: Nested loops intro (loop inside loop)
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[1,1],[1,2],[1,3],[2,3],[3,3],[3,2],[3,1],[4,1],[5,1],[5,2],[5,3]]);
    g[1][1] = 3; g[5][3] = 2;
    levels.push({ 
      id:14, name:"Nested Loops Start", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:1,y:1,direction:'right'}, parTime:40, parCommands:7, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','turnLeft','turnRight','turnAround'],
      maxCommands:18, hint:"Put one repeat loop inside another for 2x2 patterns.", 
      conceptTaught:"Nested Loops", zone:2,
      requiredTurns:3, decisionPoints:0, complexityScore: 16
    });
  })();

  // L15: Nested loops pattern
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[2,0],[2,1],[2,2],[3,2],[4,2],[4,1],[4,0],[5,0],[6,0],[6,1],[6,2]]);
    g[2][0] = 3; g[6][2] = 2;
    levels.push({ 
      id:15, name:"Grid Pattern", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:42, parCommands:8, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','turnLeft','turnRight','turnAround'],
      maxCommands:20, hint:"Create a 3x3 grid pattern with nested repeats.", 
      conceptTaught:"Nested Loop Patterns", zone:2,
      requiredTurns:4, decisionPoints:0, complexityScore: 18
    });
  })();

  // L16: Nested loops complex
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3]]);
    g[0][0] = 3; g[4][3] = 2;
    levels.push({ 
      id:16, name:"Nested Loop Mastery", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:45, parCommands:9, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','turnLeft','turnRight','turnAround'],
      maxCommands:22, hint:"Layer nested repeats to create complex movement patterns.", 
      conceptTaught:"Advanced Nesting", zone:2,
      requiredTurns:3, decisionPoints:0, complexityScore: 20
    });
  })();

  // L17: Until Wall sensor intro
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]);
    g[4][0] = 3; g[4][7] = 2;
    levels.push({ 
      id:17, name:"Until Wall", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:4,direction:'right'}, parTime:30, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','turnLeft','turnRight','turnAround'],
      maxCommands:10, hint:"Use 'Repeat Until Wall' to move forward until hitting a wall.", 
      conceptTaught:"Until Wall Sensor", zone:2,
      requiredTurns:0, decisionPoints:0, complexityScore: 12
    });
  })();

  // L18: Until Wall with turn
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[3,4],[4,4],[5,4],[6,4],[7,4]]);
    g[3][0] = 3; g[7][4] = 2;
    levels.push({ 
      id:18, name:"Until Wall Turn", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:32, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','turnLeft','turnRight','turnAround'],
      maxCommands:12, hint:"Move until wall, turn, then move again.", 
      conceptTaught:"Wall Detection + Turn", zone:2,
      requiredTurns:1, decisionPoints:0, complexityScore: 14
    });
  })();

  // L19: Until Wall with complex path
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[3,5],[4,5],[5,5],[5,6],[5,7]]);
    g[1][0] = 3; g[5][7] = 2;
    levels.push({ 
      id:19, name:"Wall Maze", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:40, parCommands:5, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Combine Until Wall with turns to navigate the corridor.", 
      conceptTaught:"Wall Sensors + Navigation", zone:2,
      requiredTurns:2, decisionPoints:0, complexityScore: 16
    });
  })();

  // L20: Until Wall spiral pattern
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7],[7,6],[7,5],[7,4],[7,3],[7,2],[7,1]]);
    g[0][0] = 3; g[7][1] = 2;
    levels.push({ 
      id:20, name:"Spiral Wall", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:50, parCommands:8, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','turnLeft','turnRight','turnAround'],
      maxCommands:20, hint:"Use Until Wall with repeat turns to spiral outward.", 
      conceptTaught:"Wall-Following Basics", zone:2,
      requiredTurns:4, decisionPoints:0, complexityScore: 20
    });
  })();

  // L21: If Path Ahead intro
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]]);
    g[3][0] = 3; g[3][5] = 2;
    levels.push({ 
      id:21, name:"If Path Ahead", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:25, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','turnLeft','turnRight','turnAround'],
      maxCommands:12, hint:"Use 'If Path Ahead' to move only when the way is clear.", 
      conceptTaught:"If Path Ahead Conditional", zone:2,
      requiredTurns:0, decisionPoints:1, complexityScore: 12
    });
  })();

  // L22: If Path Ahead with repeat
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6]]);
    g[2][0] = 3; g[2][6] = 2;
    levels.push({ 
      id:22, name:"Repeat If Path", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:28, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','turnLeft','turnRight','turnAround'],
      maxCommands:12, hint:"Repeat the 'If Path Ahead' check to move safely.", 
      conceptTaught:"Repeat If Paths", zone:2,
      requiredTurns:0, decisionPoints:1, complexityScore: 13
    });
  })();

  // L23: If Path Ahead with branching
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,4],[2,5],[3,5],[4,5],[4,6],[4,7]]);
    g[0][0] = 3; g[4][7] = 2;
    levels.push({ 
      id:23, name:"Path Decision", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:35, parCommands:4, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','turnLeft','turnRight','turnAround'],
      maxCommands:14, hint:"Check if paths exist before deciding which way to turn.", 
      conceptTaught:"Conditional Navigation", zone:2,
      requiredTurns:2, decisionPoints:2, complexityScore: 16
    });
  })();

  // L24: If Path Ahead complex maze
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[1,0],[1,1],[1,2],[2,2],[3,2],[3,1],[3,0],[4,0],[5,0],[5,1],[5,2],[5,3],[5,4]]);
    g[1][0] = 3; g[5][4] = 2;
    levels.push({ 
      id:24, name:"Smart Navigation", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:40, parCommands:6, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Use multiple path checks to navigate autonomously.", 
      conceptTaught:"Multi-Path Conditionals", zone:2,
      requiredTurns:3, decisionPoints:3, complexityScore: 18
    });
  })();

  // L25: Phase 2 Boss - All Builder concepts
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[5,3],[6,3],[6,4],[6,5],[6,6]]);
    g[0][0] = 3; g[6][6] = 2;
    levels.push({ 
      id:25, name:"Builder Boss", phase:2, gridSize:8, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:55, parCommands:10, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','turnLeft','turnRight','turnAround'],
      maxCommands:24, hint:"Combine loops, wall sensing, and path conditionals.", 
      conceptTaught:"Builder Mastery", zone:2,
      requiredTurns:4, decisionPoints:3, complexityScore: 22
    });
  })();

  // ===== PHASE 3: ARCHITECT (Levels 26-40) =====
  // Wall-following with If Wall Left/Right, If-Else blocks, nested conditionals

  // L26: If Wall Left/Right intro
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7]]);
    g[5][0] = 3; g[5][7] = 2;
    levels.push({ 
      id:26, name:"Wall Sensor Left", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:5,direction:'right'}, parTime:28, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:14, hint:"Detect walls on the left side without turning.", 
      conceptTaught:"Wall Left Sensor", zone:3,
      requiredTurns:0, decisionPoints:1, complexityScore: 14
    });
  })();

  // L27: If Wall Right sensor
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]);
    g[2][0] = 3; g[2][9] = 2;
    levels.push({ 
      id:27, name:"Wall Sensor Right", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:28, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:14, hint:"Use 'If Wall Right' to detect walls on the right.", 
      conceptTaught:"Wall Right Sensor", zone:3,
      requiredTurns:0, decisionPoints:1, complexityScore: 14
    });
  })();

  // L28: If Goal Ahead sensor
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]);
    g[0][0] = 3; g[0][9] = 2;
    levels.push({ 
      id:28, name:"Goal Sensor", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:25, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:12, hint:"Use 'If Goal Ahead' to detect when the goal is in front.", 
      conceptTaught:"Goal Ahead Sensor", zone:3,
      requiredTurns:0, decisionPoints:1, complexityScore: 12
    });
  })();

  // L29: Wall-following corridor
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8],[3,9]]);
    g[3][0] = 3; g[3][9] = 2;
    levels.push({ 
      id:29, name:"Follow the Wall", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:30, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Follow the wall on your left or right to navigate.", 
      conceptTaught:"Wall Following", zone:3,
      requiredTurns:0, decisionPoints:1, complexityScore: 15
    });
  })();

  // L30: If-Else block intro
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6]]);
    g[2][0] = 3; g[2][6] = 2;
    levels.push({ 
      id:30, name:"If-Else Intro", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:32, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Use If-Else: if condition is true do X, else do Y.", 
      conceptTaught:"If-Else Conditional", zone:3,
      requiredTurns:0, decisionPoints:2, complexityScore: 16
    });
  })();

  // L31: If-Else with paths
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[4,5],[4,6],[4,7]]);
    g[1][0] = 3; g[4][7] = 2;
    levels.push({ 
      id:31, name:"Conditional Paths", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:38, parCommands:5, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:18, hint:"Use If-Else to choose between two different paths.", 
      conceptTaught:"Path Conditionals", zone:3,
      requiredTurns:1, decisionPoints:2, complexityScore: 18
    });
  })();

  // L32: Nested If-Else blocks
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8]]);
    g[0][0] = 3; g[4][8] = 2;
    levels.push({ 
      id:32, name:"Nested If-Else", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:42, parCommands:7, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:20, hint:"Put If-Else blocks inside other If-Else blocks.", 
      conceptTaught:"Nested Conditionals", zone:3,
      requiredTurns:2, decisionPoints:4, complexityScore: 22
    });
  })();

  // L33: Complex wall-following
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,5],[3,5],[4,5],[4,4],[4,3],[4,2],[4,1],[5,1],[6,1],[6,2],[6,3]]);
    g[1][0] = 3; g[6][3] = 2;
    levels.push({ 
      id:33, name:"Corridor Maze", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:45, parCommands:8, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:22, hint:"Navigate corridors using wall sensors and conditionals.", 
      conceptTaught:"Wall Maze Navigation", zone:3,
      requiredTurns:3, decisionPoints:4, complexityScore: 24
    });
  })();

  // L34: Multi-sensor navigation
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4],[3,4],[4,4],[5,4],[5,5],[5,6],[5,7],[6,7],[7,7],[7,8],[7,9]]);
    g[2][0] = 3; g[7][9] = 2;
    levels.push({ 
      id:34, name:"Multi-Sensor", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:48, parCommands:9, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','turnLeft','turnRight','turnAround'],
      maxCommands:24, hint:"Combine multiple sensors for intelligent navigation.", 
      conceptTaught:"Multi-Sensor Logic", zone:3,
      requiredTurns:3, decisionPoints:5, complexityScore: 26
    });
  })();

  // L35: Variables intro
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]);
    g[0][0] = 3; g[0][9] = 2;
    levels.push({ 
      id:35, name:"Set Variable", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:30, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Create and set a variable to track your progress.", 
      conceptTaught:"Set Variable", zone:3,
      requiredTurns:0, decisionPoints:1, complexityScore: 15
    });
  })();

  // L36: Change variable in loop
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8]]);
    g[3][0] = 3; g[3][8] = 2;
    levels.push({ 
      id:36, name:"Counter Loop", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:35, parCommands:4, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','turnLeft','turnRight','turnAround'],
      maxCommands:18, hint:"Increment a counter variable each time you move.", 
      conceptTaught:"Change Variable", zone:3,
      requiredTurns:0, decisionPoints:1, complexityScore: 16
    });
  })();

  // L37: Compare variable conditionally
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9]]);
    g[1][0] = 3; g[4][9] = 2;
    levels.push({ 
      id:37, name:"Variable Compare", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:42, parCommands:6, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','turnLeft','turnRight','turnAround'],
      maxCommands:20, hint:"Use compareVariable to make decisions based on variable values.", 
      conceptTaught:"Compare Variable", zone:3,
      requiredTurns:1, decisionPoints:2, complexityScore: 20
    });
  })();

  // L38: Variables + sensors combined
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[4,6],[5,6],[5,7],[5,8],[5,9]]);
    g[0][0] = 3; g[5][9] = 2;
    levels.push({ 
      id:38, name:"Smart Variables", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:48, parCommands:8, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','turnLeft','turnRight','turnAround'],
      maxCommands:24, hint:"Track movement progress with variables and sensors.", 
      conceptTaught:"Variables + Sensors", zone:3,
      requiredTurns:2, decisionPoints:3, complexityScore: 24
    });
  })();

  // L39: Complex nested conditionals
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[3,3],[4,3],[4,2],[4,1],[4,0],[5,0],[6,0],[6,1],[6,2],[7,2],[8,2],[9,2]] );
    g[2][0] = 3; g[9][2] = 2;
    levels.push({ 
      id:39, name:"Nested Complexity", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:52, parCommands:10, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','turnLeft','turnRight','turnAround'],
      maxCommands:26, hint:"Layer nested conditionals with variables for complex logic.", 
      conceptTaught:"Advanced Logic", zone:3,
      requiredTurns:3, decisionPoints:5, complexityScore: 28
    });
  })();

  // L40: Phase 3 Boss - Architect mastery
  (() => {
    const g = fillGrid(10, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[2,3],[3,3],[4,3],[4,4],[4,5],[5,5],[6,5],[6,6],[6,7],[6,8],[6,9],[7,9],[8,9],[9,9]]);
    g[1][0] = 3; g[9][9] = 2;
    levels.push({ 
      id:40, name:"Architect Boss", phase:3, gridSize:10, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:60, parCommands:12, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','turnLeft','turnRight','turnAround'],
      maxCommands:28, hint:"Master all Architect concepts for this final challenge.", 
      conceptTaught:"Architect Mastery", zone:3,
      requiredTurns:4, decisionPoints:6, complexityScore: 32
    });
  })();

  // ===== PHASE 4: MASTER (Levels 41-50) =====
  // Variables, function definitions, AND/OR/NOT logic

  // L41: Define function intro
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],[5,11]]);
    g[5][0] = 3; g[5][11] = 2;
    levels.push({ 
      id:41, name:"Define Function", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:5,direction:'right'}, parTime:35, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:18, hint:"Define a GoForward function and call it to move.", 
      conceptTaught:"Define + Call Function", zone:4,
      requiredTurns:0, decisionPoints:1, complexityScore: 18
    });
  })();

  // L42: Call function multiple times
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[3,6],[3,7],[3,8]]);
    g[3][0] = 3; g[3][8] = 2;
    levels.push({ 
      id:42, name:"Function Reuse", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:32, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Define a function and call it multiple times.", 
      conceptTaught:"Function Reuse", zone:4,
      requiredTurns:0, decisionPoints:1, complexityScore: 18
    });
  })();

  // L43: Function with conditions
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[2,0],[2,1],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[4,7]]);
    g[2][0] = 3; g[4][7] = 2;
    levels.push({ 
      id:43, name:"Smart Functions", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:2,direction:'right'}, parTime:40, parCommands:5, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:20, hint:"Create a function with conditional logic inside.", 
      conceptTaught:"Functions with Logic", zone:4,
      requiredTurns:1, decisionPoints:2, complexityScore: 22
    });
  })();

  // L44: AND operator intro
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]]);
    g[6][0] = 3; g[6][9] = 2;
    levels.push({ 
      id:44, name:"AND Logic", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:6,direction:'right'}, parTime:35, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:18, hint:"Use AND: both conditions must be true to move.", 
      conceptTaught:"AND Operator", zone:4,
      requiredTurns:0, decisionPoints:1, complexityScore: 18
    });
  })();

  // L45: OR operator intro
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]);
    g[1][0] = 3; g[1][7] = 2;
    levels.push({ 
      id:45, name:"OR Logic", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:32, parCommands:3, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:18, hint:"Use OR: either condition can be true to proceed.", 
      conceptTaught:"OR Operator", zone:4,
      requiredTurns:0, decisionPoints:1, complexityScore: 18
    });
  })();

  // L46: NOT operator
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7],[4,8]]);
    g[4][0] = 3; g[4][8] = 2;
    levels.push({ 
      id:46, name:"NOT Logic", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:4,direction:'right'}, parTime:30, parCommands:2, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:16, hint:"Use NOT: move if wall is NOT ahead.", 
      conceptTaught:"NOT Operator", zone:4,
      requiredTurns:0, decisionPoints:1, complexityScore: 16
    });
  })();

  // L47: Combined logic operators
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[4,6],[5,6],[5,7],[5,8],[5,9]]);
    g[0][0] = 3; g[5][9] = 2;
    levels.push({ 
      id:47, name:"Combined Logic", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:0,direction:'right'}, parTime:48, parCommands:7, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:22, hint:"Combine AND, OR, NOT for complex decision logic.", 
      conceptTaught:"Logic Combinations", zone:4,
      requiredTurns:2, decisionPoints:4, complexityScore: 26
    });
  })();

  // L48: Functions + logic combined
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[3,0],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[5,6],[6,6],[7,6],[7,7],[7,8],[8,8],[9,8],[10,8],[11,8]]);
    g[3][0] = 3; g[11][8] = 2;
    levels.push({ 
      id:48, name:"Logic Functions", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:3,direction:'right'}, parTime:55, parCommands:9, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:26, hint:"Define functions that use AND/OR/NOT logic.", 
      conceptTaught:"Functions with Logic", zone:4,
      requiredTurns:3, decisionPoints:4, complexityScore: 30
    });
  })();

  // L49: Advanced algorithm challenge
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[6,0],[6,1],[6,2],[6,3],[5,3],[4,3],[4,4],[4,5],[3,5],[2,5],[2,6],[2,7],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[8,9],[8,10],[8,11]]);
    g[6][0] = 3; g[8][11] = 2;
    levels.push({ 
      id:49, name:"Algorithm Master", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:6,direction:'right'}, parTime:70, parCommands:14, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:36, hint:"Master all programming concepts in this complex maze.", 
      conceptTaught:"Advanced Algorithms", zone:4,
      requiredTurns:4, decisionPoints:6, complexityScore: 36
    });
  })();

  // L50: Phase 4 Boss - Ultimate puzzle (Final Challenge)
  (() => {
    const g = fillGrid(12, 1);
    setPath(g, [[1,0],[1,1],[1,2],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[4,0],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[6,5],[7,5],[7,4],[7,3],[7,2],[7,1],[8,1],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8],[9,9],[9,10],[9,11],[10,11],[11,11]]);
    g[1][0] = 3; g[11][11] = 2;
    levels.push({ 
      id:50, name:"Brilliant OS", phase:4, gridSize:12, grid:g as any, 
      robotStart:{x:0,y:1,direction:'right'}, parTime:120, parCommands:18, 
      availableCommands:['moveForward1','moveForward2','moveForward3','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal','repeatUntilWall','ifPathAhead','ifWallLeft','ifWallRight','ifGoalAhead','ifElse','setVariable','changeVariable','compareVariable','defineFunction','callFunction','andOp','orOp','notOp','turnLeft','turnRight','turnAround'],
      maxCommands:48, hint:"Everything you've learned combined: loops, conditions, functions, variables, and logic operators.",
      conceptTaught:"Master Challenge", zone:4,
      requiredTurns:6, decisionPoints:8, complexityScore: 48
    });
  })();

  return levels;
}

export const levelData = createLevels();
