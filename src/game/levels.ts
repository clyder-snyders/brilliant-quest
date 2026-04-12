import { LevelData } from './types';

// Helper: create grid filled with a value
const fillGrid = (size: number, val: number = 0): number[][] =>
  Array.from({ length: size }, () => Array(size).fill(val));

const setPath = (grid: number[][], cells: [number, number][], val: number = 0) => {
  cells.forEach(([r, c]) => { grid[r][c] = val; });
  return grid;
};

// Generate all 50 levels
function createLevels(): LevelData[] {
  const levels: LevelData[] = [];

  // ===== ZONE 1: Easy — Foundations (6×6) =====
  // Level 1: First Steps — straight horizontal
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]);
    g[0][0] = 3; g[0][5] = 2;
    levels.push({ id:1, name:"First Steps", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:20, parCommands:3, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Move forward to reach the flag.", conceptTaught:"Sequencing" });
  })();

  // Level 2: Turn Right — L-shaped path right
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[2,5]]);
    g[0][0] = 3; g[2][5] = 2;
    levels.push({ id:2, name:"Turn Right", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:22, parCommands:4, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Go right, turn right, continue to the goal.", conceptTaught:"Turn Right" });
  })();

  // Level 3: Turn Left — unique path different from level 7
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0]]);
    g[0][0] = 3; g[3][0] = 2;
    levels.push({ id:3, name:"Turn Left", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:30, parCommands:5, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:12, hint:"Go right, turn right to go down, then turn right again to go left.", conceptTaught:"Turn Left" });
  })();

  // Level 4: The Corner — 2-turn path
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5]]);
    g[0][0] = 3; g[4][5] = 2;
    levels.push({ id:4, name:"The Corner", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:28, parCommands:6, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:14, hint:"Navigate two corners.", conceptTaught:"Multi-turn Sequencing" });
  })();

  // Level 5: Double Step
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5]]);
    g[0][0] = 3; g[2][5] = 2;
    levels.push({ id:5, name:"Double Step", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:25, parCommands:4, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Use Move 2 or 3 for efficiency.", conceptTaught:"Move Forward 2" });
  })();

  // Level 6: Triple Jump
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]]);
    g[0][0] = 3; g[5][5] = 2;
    levels.push({ id:6, name:"Triple Jump", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:22, parCommands:4, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Use Move 3 to cover ground quickly.", conceptTaught:"Move Forward 3" });
  })();

  // Level 7: Zigzag — UNIQUE path (different from level 3)
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4],[4,5]]);
    g[0][0] = 3; g[4][5] = 2;
    levels.push({ id:7, name:"Zigzag", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:45, parCommands:13, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:18, hint:"Alternate move and turn for the zigzag.", conceptTaught:"Multi-step Sequencing" });
  })();

  // Level 8: Around the Block
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[2,0]]);
    g[0][0] = 3; g[2][0] = 2;
    levels.push({ id:8, name:"Around the Block", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:32, parCommands:7, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight','turnAround'], maxCommands:14, hint:"Go around the block.", conceptTaught:"Turn Around" });
  })();

  // Level 9: Narrow Pass
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[1,0],[1,1],[1,2],[2,2],[3,2],[3,3],[3,4],[2,4],[1,4],[1,5]]);
    g[1][0] = 3; g[1][5] = 2;
    levels.push({ id:9, name:"Narrow Pass", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:1,direction:'right'}, parTime:30, parCommands:8, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:15, hint:"Navigate through the narrow corridor.", conceptTaught:"Precision Movement" });
  })();

  // Level 10: The S-Bend
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,3],[4,2]]);
    g[0][0] = 3; g[4][2] = 2;
    levels.push({ id:10, name:"The S-Bend", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:35, parCommands:8, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:16, hint:"Follow the S-shaped path with careful turns.", conceptTaught:"Complex Sequencing" });
  })();

  // Level 11: The Long Road
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[5,3],[5,2],[5,1],[5,0]]);
    g[0][0] = 3; g[5][0] = 2;
    levels.push({ id:11, name:"The Long Road", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:40, parCommands:8, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:16, hint:"U-shaped path. Use multi-step moves.", conceptTaught:"Full Sequencing" });
  })();

  // Level 12: Zone Boss
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[5,3],[5,2]]);
    g[0][0] = 3; g[5][2] = 2;
    levels.push({ id:12, name:"Zone Boss", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:40, parCommands:7, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight','turnAround'], maxCommands:16, hint:"Combine all your movement skills.", conceptTaught:"Sequencing Mastery" });
  })();

  // ===== ZONE 2: Difficult — Builder (8×8) =====
  const zone2Commands = ['moveForward1','moveForward2','moveForward3','turnLeft','turnRight','turnAround','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal'];

  // Level 13: Do It Again
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]);
    g[0][0] = 3; g[0][7] = 2;
    levels.push({ id:13, name:"Do It Again", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:30, parCommands:3, availableCommands:zone2Commands, maxCommands:12, hint:"Use Repeat to move forward multiple times.", conceptTaught:"Repeat 2×" });
  })();

  // Level 14: Three Times
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7]]);
    g[0][0] = 3; g[2][7] = 2;
    levels.push({ id:14, name:"Three Times", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:28, parCommands:4, availableCommands:zone2Commands, maxCommands:12, hint:"Use Repeat 3× with move forward.", conceptTaught:"Repeat 3×" });
  })();

  // Level 15: The Pattern
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[1,3],[1,4],[2,4],[2,5],[2,6],[3,6],[3,7]]);
    g[0][0] = 3; g[3][7] = 2;
    levels.push({ id:15, name:"The Pattern", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:35, parCommands:6, availableCommands:zone2Commands, maxCommands:16, hint:"Notice the repeating L-pattern.", conceptTaught:"Repeat Block + Sequence" });
  })();

  // Level 16: Loop the Block
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[7,3],[7,2],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1]]);
    g[1][1] = 3; g[2][1] = 2;
    levels.push({ id:16, name:"Loop the Block", zone:2, gridSize:8, grid:g as any, robotStart:{x:1,y:1,direction:'right'}, parTime:50, parCommands:8, availableCommands:zone2Commands, maxCommands:20, hint:"Walk around the block using repeat + turn right.", conceptTaught:"Repeat 4× with Turn" });
  })();

  // Level 17: Repeat Until
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 8; c++) g[3][c] = 0;
    g[3][0] = 3; g[3][7] = 2;
    levels.push({ id:17, name:"Repeat Until", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:3,direction:'right'}, parTime:25, parCommands:2, availableCommands:zone2Commands, maxCommands:10, hint:"Use 'Repeat Until Goal' with Move Forward.", conceptTaught:"Repeat Until Goal" });
  })();

  // Level 18: Wall Stopper
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 6; c++) g[0][c] = 0;
    g[0][0] = 3; g[0][5] = 2;
    levels.push({ id:18, name:"Wall Stopper", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:25, parCommands:3, availableCommands:zone2Commands, maxCommands:10, hint:"Move forward until you reach the goal.", conceptTaught:"Repeat Until Wall" });
  })();

  // Level 19: Spiral In
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 8; c++) g[0][c] = 0;
    for (let r = 0; r < 8; r++) g[r][7] = 0;
    for (let c = 7; c >= 1; c--) g[7][c] = 0;
    for (let r = 7; r >= 2; r--) g[r][1] = 0;
    for (let c = 1; c <= 5; c++) g[2][c] = 0;
    for (let r = 2; r <= 5; r++) g[r][5] = 0;
    for (let c = 5; c >= 3; c--) g[5][c] = 0;
    g[0][0] = 3; g[5][3] = 2;
    levels.push({ id:19, name:"Spiral In", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:60, parCommands:12, availableCommands:zone2Commands, maxCommands:24, hint:"Follow the spiral inward — use loops for straight segments.", conceptTaught:"Nested Repeat Logic" });
  })();

  // Level 20: Efficiency Test
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,4],[2,5],[2,6],[2,7]]);
    g[0][0] = 3; g[2][7] = 2;
    levels.push({ id:20, name:"Efficiency Test", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:30, parCommands:5, availableCommands:zone2Commands, maxCommands:14, hint:"Combine multi-step moves with loops.", conceptTaught:"Efficiency + Loops" });
  })();

  // Level 21: Maze Run
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[3,5],[2,5],[2,6],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]);
    g[0][0] = 3; g[7][7] = 2;
    levels.push({ id:21, name:"Maze Run", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:60, parCommands:12, availableCommands:zone2Commands, maxCommands:24, hint:"Navigate the maze — plan your turns.", conceptTaught:"Loops + Turns Combined" });
  })();

  // Level 22: Double Loop
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 4; c++) g[0][c] = 0;
    g[1][3] = 0; g[2][3] = 0;
    for (let c = 3; c < 8; c++) g[2][c] = 0;
    g[0][0] = 3; g[2][7] = 2;
    levels.push({ id:22, name:"Double Loop", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:45, parCommands:6, availableCommands:zone2Commands, maxCommands:14, hint:"Use two separate loop blocks.", conceptTaught:"Multiple Repeat Blocks" });
  })();

  // Level 23: Loop Bonus
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 8; c++) g[1][c] = 0;
    g[1][2] = 5; g[1][5] = 5;
    g[1][0] = 3; g[1][7] = 2;
    levels.push({ id:23, name:"Loop Bonus", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:1,direction:'right'}, parTime:50, parCommands:3, availableCommands:zone2Commands, maxCommands:12, hint:"Collect bonus tiles on your way!", conceptTaught:"Loops + Bonus Scoring" });
  })();

  // Level 24: Zone Boss
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 6; c++) g[0][c] = 0;
    for (let r = 0; r < 4; r++) g[r][5] = 0;
    for (let c = 5; c >= 2; c--) g[3][c] = 0;
    for (let r = 3; r < 7; r++) g[r][2] = 0;
    for (let c = 2; c < 8; c++) g[6][c] = 0;
    g[0][0] = 3; g[6][7] = 2;
    levels.push({ id:24, name:"Zone Boss", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:60, parCommands:10, availableCommands:zone2Commands, maxCommands:22, hint:"Combine all loop types for this serpentine path.", conceptTaught:"Loop Mastery" });
  })();

  // ===== ZONE 3: Complex — Architect (10×10) =====
  const zone3Commands = [...zone2Commands, 'ifPathAhead','ifWallTurnLeft','ifWallTurnRight','ifGoalAhead','ifElse'];

  const zone3Configs: { id: number; name: string; concept: string; parCmd: number; maxCmd: number; parTime: number; hint: string; path: [number,number][] }[] = [
    { id:25, name:"Fork in the Road", concept:"If Path Ahead", parCmd:6, maxCmd:20, parTime:35,
      hint:"Use 'If Path Ahead → Move' to navigate safely.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9]] },
    { id:26, name:"Wall Detector", concept:"If Wall → Turn", parCmd:6, maxCmd:22, parTime:35,
      hint:"Detect walls and turn automatically.",
      path:[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[2,3],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9]] },
    { id:27, name:"Goal Sensor", concept:"If Goal Ahead", parCmd:3, maxCmd:12, parTime:25,
      hint:"Use 'If Goal Ahead → Move' to reach the flag.",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]] },
    { id:28, name:"Blue Tile Rule", concept:"Color Conditionals", parCmd:8, maxCmd:24, parTime:40,
      hint:"When you see a blue tile, turn right.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[5,6],[6,6],[6,7],[6,8],[6,9]] },
    { id:29, name:"Safe Path", concept:"Safe Path Detection", parCmd:8, maxCmd:22, parTime:40,
      hint:"Only move forward when the path is clear.",
      path:[[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[3,7],[4,7],[5,7],[5,8],[5,9]] },
    { id:30, name:"Choose Wisely", concept:"If/Else Block", parCmd:8, maxCmd:22, parTime:45,
      hint:"Use If/Else to handle two different situations.",
      path:[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2],[3,3],[3,4],[4,4],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9]] },
    { id:31, name:"Two Choices", concept:"Nested If/Else", parCmd:10, maxCmd:28, parTime:50,
      hint:"Nest your conditionals for complex decisions.",
      path:[[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,2],[2,2],[2,3],[2,4],[2,5],[3,5],[4,5],[5,5],[6,5],[6,6],[6,7],[6,8],[6,9]] },
    { id:32, name:"While Blocked", concept:"While Loop", parCmd:8, maxCmd:20, parTime:45,
      hint:"Wait while the path is blocked, then move.",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]] },
    { id:33, name:"Sensor Array", concept:"Multiple Sensors", parCmd:10, maxCmd:26, parTime:55,
      hint:"Combine multiple sensor commands.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[2,5],[3,5],[4,5],[4,6],[4,7],[5,7],[6,7],[7,7],[7,8],[7,9]] },
    { id:34, name:"Color Maze", concept:"Color Conditionals", parCmd:10, maxCmd:28, parTime:55,
      hint:"Different colored tiles require different actions.",
      path:[[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,4],[2,5],[2,6],[3,6],[4,6],[4,7],[4,8],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9]] },
    { id:35, name:"Variables Enter", concept:"Set Variable", parCmd:10, maxCmd:28, parTime:50,
      hint:"Set a variable to track your progress.",
      path:[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[5,6],[6,6],[7,6],[8,6],[8,7],[8,8],[8,9]] },
    { id:36, name:"Count Steps", concept:"Change Variable", parCmd:10, maxCmd:24, parTime:50,
      hint:"Increment stepsTaken each time you move.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4],[4,5],[5,5],[6,5],[7,5],[7,6],[7,7],[7,8],[7,9]] },
    { id:37, name:"Conditional Var", concept:"Compare Variable", parCmd:12, maxCmd:28, parTime:60,
      hint:"Compare your variable to decide which way to go.",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[3,5],[3,6],[4,6],[5,6],[6,6],[6,7],[6,8],[7,8],[8,8],[9,8],[9,9]] },
    { id:38, name:"Zone Boss", concept:"Conditional Mastery", parCmd:14, maxCmd:32, parTime:65,
      hint:"Use everything you've learned about conditionals.",
      path:[[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[4,6],[5,6],[6,6],[6,7],[7,7],[8,7],[8,8],[9,8],[9,9]] },
  ];

  for (const cfg of zone3Configs) {
    const g = fillGrid(10, 1);
    setPath(g, cfg.path);
    if (cfg.id === 28 || cfg.id === 34) {
      for (let j = 3; j < cfg.path.length - 1; j += 4) {
        g[cfg.path[j][0]][cfg.path[j][1]] = 4;
      }
    }
    g[cfg.path[0][0]][cfg.path[0][1]] = 3;
    const last = cfg.path[cfg.path.length - 1];
    g[last[0]][last[1]] = 2;

    levels.push({
      id: cfg.id, name: cfg.name, zone: 3, gridSize: 10, grid: g as any,
      robotStart: { x: cfg.path[0][1], y: cfg.path[0][0], direction: 'right' },
      parTime: cfg.parTime, parCommands: cfg.parCmd,
      availableCommands: cfg.id >= 35 ? [...zone3Commands, 'setVariable', 'changeVariable', 'compareVariable'] : zone3Commands,
      maxCommands: cfg.maxCmd, hint: cfg.hint, conceptTaught: cfg.concept,
    });
  }

  // ===== ZONE 4: University — Master (12×12) =====
  const zone4Commands = [...zone3Commands, 'setVariable', 'changeVariable', 'compareVariable', 'defineFunction', 'callFunction', 'andOp', 'orOp', 'notOp'];

  const zone4Configs: { id: number; name: string; concept: string; parCmd: number; maxCmd: number; parTime: number; hint: string; path: [number,number][] }[] = [
    { id:39, name:"My First Function", concept:"Define + Call Function", parCmd:6, maxCmd:22, parTime:40,
      hint:"Define a GoStraight function and call it.",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],[5,11]] },
    { id:40, name:"Corner Routine", concept:"TurnCorner Function", parCmd:8, maxCmd:28, parTime:45,
      hint:"Create a function that turns a corner efficiently.",
      path:[[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[4,6],[5,6],[6,6],[6,7],[6,8],[6,9],[7,9],[8,9],[8,10],[8,11]] },
    { id:41, name:"Reuse It", concept:"Function Reuse", parCmd:7, maxCmd:24, parTime:40,
      hint:"Call the same function multiple times.",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[2,5],[2,6],[2,7],[2,8],[3,8],[4,8],[4,9],[4,10],[4,11]] },
    { id:42, name:"Escape Path", concept:"Complex Functions", parCmd:12, maxCmd:36, parTime:55,
      hint:"Build an escape function.",
      path:[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[1,3],[1,4],[2,4],[3,4],[3,5],[3,6],[2,6],[1,6],[1,7],[1,8],[2,8],[3,8],[3,9],[3,10],[3,11]] },
    { id:43, name:"AND Logic", concept:"AND Operator", parCmd:10, maxCmd:30, parTime:50,
      hint:"Both conditions must be true.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4],[4,5],[5,5],[6,5],[7,5],[7,6],[7,7],[8,7],[9,7],[9,8],[9,9],[9,10],[9,11]] },
    { id:44, name:"OR Logic", concept:"OR Operator", parCmd:10, maxCmd:32, parTime:50,
      hint:"Either condition works.",
      path:[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[6,3],[6,4],[6,5],[6,6],[7,6],[8,6],[8,7],[8,8],[9,8],[10,8],[10,9],[10,10],[10,11]] },
    { id:45, name:"NOT Logic", concept:"NOT Operator", parCmd:8, maxCmd:28, parTime:45,
      hint:"If NOT wall ahead, then move forward.",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],[11,11]] },
    { id:46, name:"Combo Logic", concept:"Combined Logic", parCmd:14, maxCmd:36, parTime:60,
      hint:"Combine AND, OR, NOT for complex decisions.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[5,6],[6,6],[6,7],[6,8],[7,8],[8,8],[8,9],[8,10],[9,10],[10,10],[11,10],[11,11]] },
    { id:47, name:"Nested Loops", concept:"Loop in Loop", parCmd:14, maxCmd:44, parTime:65,
      hint:"Put a loop inside another loop for 2D patterns.",
      path:[[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[4,2],[4,3],[5,3],[6,3],[6,2],[6,1],[7,1],[8,1],[8,2],[8,3],[8,4],[8,5],[9,5],[10,5],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],[11,11]] },
    { id:48, name:"Full Algorithm", concept:"All Concepts", parCmd:16, maxCmd:40, parTime:70,
      hint:"Functions + loops + conditions all together.",
      path:[[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[2,3],[1,3],[1,4],[1,5],[2,5],[3,5],[3,6],[3,7],[4,7],[5,7],[6,7],[6,8],[6,9],[7,9],[8,9],[8,10],[8,11],[9,11],[10,11],[11,11]] },
    { id:49, name:"Speed Run", concept:"Optimization", parCmd:8, maxCmd:26, parTime:35,
      hint:"Solve it with minimum commands!",
      path:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11],[1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11]] },
    { id:50, name:"Brilliant OS", concept:"Final Challenge", parCmd:20, maxCmd:52, parTime:120,
      hint:"Everything you've learned, in one grand puzzle.",
      path:[[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[1,4],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7],[3,7],[3,6],[3,5],[4,5],[5,5],[5,6],[5,7],[5,8],[5,9],[6,9],[7,9],[7,8],[7,7],[8,7],[9,7],[9,8],[9,9],[9,10],[9,11],[10,11],[11,11]] },
  ];

  for (const cfg of zone4Configs) {
    const g = fillGrid(12, 1);
    setPath(g, cfg.path);
    g[cfg.path[0][0]][cfg.path[0][1]] = 3;
    const last = cfg.path[cfg.path.length - 1];
    g[last[0]][last[1]] = 2;

    levels.push({
      id: cfg.id, name: cfg.name, zone: 4, gridSize: 12, grid: g as any,
      robotStart: { x: cfg.path[0][1], y: cfg.path[0][0], direction: 'right' },
      parTime: cfg.parTime, parCommands: cfg.parCmd,
      availableCommands: zone4Commands,
      maxCommands: cfg.maxCmd, hint: cfg.hint, conceptTaught: cfg.concept,
    });
  }

  return levels;
}

export const levelData = createLevels();
