import { LevelData } from './types';

// Helper: create grid filled with a value
const fillGrid = (size: number, val: number = 0): number[][] =>
  Array.from({ length: size }, () => Array(size).fill(val));

// Helper: set cells in a grid
const setCell = (grid: number[][], r: number, c: number, val: number) => {
  grid[r][c] = val;
  return grid;
};

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
    levels.push({ id:1, name:"First Steps", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:20, parCommands:3, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Move forward to reach the flag at the end of the corridor.", conceptTaught:"Sequencing" });
  })();

  // Level 2: Turn Right — L-shaped path right
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[2,5]]);
    g[0][0] = 3; g[2][5] = 2;
    levels.push({ id:2, name:"Turn Right", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:22, parCommands:4, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Go right, then turn right and continue to the goal.", conceptTaught:"Turn Right" });
  })();

  // Level 3: Turn Left — L-shaped path left
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[2,0],[2,1],[2,2],[1,2],[0,2],[0,3],[0,4],[0,5]]);
    g[2][0] = 3; g[0][5] = 2;
    levels.push({ id:3, name:"Turn Left", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:2,direction:'right'}, parTime:22, parCommands:4, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Move right, turn left, then continue to the goal.", conceptTaught:"Turn Left" });
  })();

  // Level 4: The Corner — 2-turn path
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5]]);
    g[0][0] = 3; g[4][5] = 2;
    levels.push({ id:4, name:"The Corner", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:28, parCommands:6, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:12, hint:"Navigate two corners — turn right, go down, turn right again.", conceptTaught:"Multi-turn Sequencing" });
  })();

  // Level 5: Double Step
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5]]);
    g[0][0] = 3; g[2][5] = 2;
    levels.push({ id:5, name:"Double Step", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:25, parCommands:5, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Use Move Forward 2 or 3 to be more efficient.", conceptTaught:"Move Forward 2" });
  })();

  // Level 6: Triple Jump
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5]]);
    g[0][0] = 3; g[5][5] = 2;
    levels.push({ id:6, name:"Triple Jump", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:22, parCommands:4, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:10, hint:"Use Move Forward 3 to cover ground quickly.", conceptTaught:"Move Forward 3" });
  })();

  // Level 7: Zigzag
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[1,1],[1,2],[2,2],[2,3],[3,3],[3,4],[4,4],[4,5]]);
    g[0][0] = 3; g[4][5] = 2;
    levels.push({ id:7, name:"Zigzag", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:35, parCommands:8, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:14, hint:"Alternate between moving forward and turning for the zigzag.", conceptTaught:"Multi-step Sequencing" });
  })();

  // Level 8: Around the Block
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[2,0]]);
    g[0][0] = 3; g[2][0] = 2;
    levels.push({ id:8, name:"Around the Block", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:32, parCommands:7, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight','turnAround'], maxCommands:12, hint:"Go around the block — right, down, then left.", conceptTaught:"Turn Around" });
  })();

  // Level 9: Narrow Pass
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[1,0],[1,1],[1,2],[2,2],[3,2],[3,3],[3,4],[2,4],[1,4],[1,5]]);
    g[1][0] = 3; g[1][5] = 2;
    levels.push({ id:9, name:"Narrow Pass", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:1,direction:'right'}, parTime:30, parCommands:6, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:14, hint:"Navigate through the narrow corridor carefully.", conceptTaught:"Precision Movement" });
  })();

  // Level 10: The S-Bend
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,3],[4,2]]);
    g[0][0] = 3; g[4][2] = 2;
    levels.push({ id:10, name:"The S-Bend", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:35, parCommands:7, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:14, hint:"Follow the S-shaped path with careful turns.", conceptTaught:"Complex Sequencing" });
  })();

  // Level 11: The Long Road
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[5,3],[5,2],[5,1],[5,0]]);
    g[0][0] = 3; g[5][0] = 2;
    levels.push({ id:11, name:"The Long Road", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:40, parCommands:9, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight'], maxCommands:16, hint:"It's a long U-shaped path. Use multi-step moves.", conceptTaught:"Full Sequencing" });
  })();

  // Level 12: Zone Boss
  (() => {
    const g = fillGrid(6, 1);
    setPath(g, [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[1,3],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4],[5,3],[5,2]]);
    g[0][0] = 3; g[5][2] = 2;
    levels.push({ id:12, name:"Zone Boss", zone:1, gridSize:6, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:45, parCommands:10, availableCommands:['moveForward1','moveForward2','moveForward3','turnLeft','turnRight','turnAround'], maxCommands:18, hint:"Combine all your movement skills to navigate this complex path.", conceptTaught:"Sequencing Mastery" });
  })();

  // ===== ZONE 2: Difficult — Builder (8×8) =====
  const zone2Commands = ['moveForward1','moveForward2','moveForward3','turnLeft','turnRight','turnAround','repeat2','repeat3','repeat4','repeat5','repeatUntilGoal'];

  // Level 13: Do It Again
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]);
    g[0][0] = 3; g[0][7] = 2;
    levels.push({ id:13, name:"Do It Again", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:30, parCommands:4, availableCommands:zone2Commands, maxCommands:12, hint:"Use Repeat to move forward multiple times efficiently.", conceptTaught:"Repeat 2×" });
  })();

  // Level 14: Three Times
  (() => {
    const g = fillGrid(8, 1);
    // Create a simple path with 3 straight segments where user can practice Repeat 3×
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7]]);
    g[0][0] = 3; g[2][7] = 2;
    levels.push({ id:14, name:"Three Times", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:28, parCommands:4, availableCommands:zone2Commands, maxCommands:12, hint:"Use Repeat 3× with move forwards to solve efficiently.", conceptTaught:"Repeat 3×" });
  })();

  // Level 15: The Pattern
  (() => {
    const g = fillGrid(8, 1);
    // L-pattern repeated: right 2, down 1 × 3
    setPath(g, [[0,0],[0,1],[0,2],[1,2],[1,3],[1,4],[2,4],[2,5],[2,6],[3,6],[3,7]]);
    g[0][0] = 3; g[3][7] = 2;
    levels.push({ id:15, name:"The Pattern", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:35, parCommands:5, availableCommands:zone2Commands, maxCommands:14, hint:"Notice the repeating L-pattern? Use Repeat with a sequence.", conceptTaught:"Repeat Block + Sequence" });
  })();

  // Level 16: Loop the Block
  (() => {
    const g = fillGrid(8, 1);
    // Perfect square loop: 1-4 right, 4-7 down, 7-4 left, 4-1 up  
    setPath(g, [[1,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[7,3],[7,2],[7,1],[6,1],[5,1],[4,1],[3,1],[2,1]]);
    g[1][1] = 3; // Start
    g[2][1] = 2; // Goal is one cell to the right after the loop
    levels.push({ id:16, name:"Loop the Block", zone:2, gridSize:8, grid:g as any, robotStart:{x:1,y:1,direction:'right'}, parTime:50, parCommands:6, availableCommands:zone2Commands, maxCommands:14, hint:"Walk around the block — use Repeat 4×: move forward 3, turn right.", conceptTaught:"Repeat 4× with Turn" });
  })();

  // Level 17: Repeat Until
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 8; c++) g[3][c] = 0;
    g[3][0] = 3; g[3][7] = 2;
    levels.push({ id:17, name:"Repeat Until", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:3,direction:'right'}, parTime:25, parCommands:3, availableCommands:zone2Commands, maxCommands:10, hint:"Use 'Repeat Until Goal' with Move Forward.", conceptTaught:"Repeat Until Goal" });
  })();

  // Level 18: Wall Stopper
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 6; c++) g[0][c] = 0;
    g[0][0] = 3; g[0][5] = 2;
    levels.push({ id:18, name:"Wall Stopper", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:25, parCommands:3, availableCommands:zone2Commands, maxCommands:10, hint:"Move forward until you can't anymore.", conceptTaught:"Repeat Until Wall" });
  })();

  // Level 19: Spiral In
  (() => {
    const g = fillGrid(8, 1);
    // Outer spiral path
    for (let c = 0; c < 8; c++) g[0][c] = 0;
    for (let r = 0; r < 8; r++) g[r][7] = 0;
    for (let c = 7; c >= 1; c--) g[7][c] = 0;
    for (let r = 7; r >= 2; r--) g[r][1] = 0;
    for (let c = 1; c <= 5; c++) g[2][c] = 0;
    for (let r = 2; r <= 5; r++) g[r][5] = 0;
    for (let c = 5; c >= 3; c--) g[5][c] = 0;
    g[0][0] = 3; g[5][3] = 2;
    levels.push({ id:19, name:"Spiral In", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:45, parCommands:8, availableCommands:zone2Commands, maxCommands:16, hint:"Follow the spiral inward — use loops for each straight segment.", conceptTaught:"Nested Repeat Logic" });
  })();

  // Level 20: Efficiency Test
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,4],[2,5],[2,6],[2,7]]);
    g[0][0] = 3; g[2][7] = 2;
    levels.push({ id:20, name:"Efficiency Test", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:30, parCommands:5, availableCommands:zone2Commands, maxCommands:12, hint:"Combine multi-step moves with loops for maximum efficiency.", conceptTaught:"Efficiency + Loops" });
  })();

  // Level 21: Maze Run
  (() => {
    const g = fillGrid(8, 1);
    setPath(g, [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[3,5],[2,5],[2,6],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]);
    g[0][0] = 3; g[7][7] = 2;
    levels.push({ id:21, name:"Maze Run", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:50, parCommands:10, availableCommands:zone2Commands, maxCommands:18, hint:"Navigate the maze — plan your turns carefully.", conceptTaught:"Loops + Turns Combined" });
  })();

  // Level 22: Double Loop
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 4; c++) g[0][c] = 0;
    g[1][3] = 0; g[2][3] = 0;
    for (let c = 3; c < 8; c++) g[2][c] = 0;
    g[0][0] = 3; g[2][7] = 2;
    levels.push({ id:22, name:"Double Loop", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:45, parCommands:8, availableCommands:zone2Commands, maxCommands:14, hint:"Use two separate loop blocks for two straight segments.", conceptTaught:"Multiple Repeat Blocks" });
  })();

  // Level 23: Loop Bonus
  (() => {
    const g = fillGrid(8, 1);
    for (let c = 0; c < 8; c++) g[1][c] = 0;
    g[1][2] = 5; g[1][5] = 5; // bonus tiles
    g[1][0] = 3; g[1][7] = 2;
    levels.push({ id:23, name:"Loop Bonus", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:1,direction:'right'}, parTime:50, parCommands:9, availableCommands:zone2Commands, maxCommands:14, hint:"Collect the bonus tiles on your way to the goal!", conceptTaught:"Loops + Bonus Scoring" });
  })();

  // Level 24: Zone Boss
  (() => {
    const g = fillGrid(8, 1);
    // Complex path
    for (let c = 0; c < 6; c++) g[0][c] = 0;
    for (let r = 0; r < 4; r++) g[r][5] = 0;
    for (let c = 5; c >= 2; c--) g[3][c] = 0;
    for (let r = 3; r < 7; r++) g[r][2] = 0;
    for (let c = 2; c < 8; c++) g[6][c] = 0;
    g[0][0] = 3; g[6][7] = 2;
    levels.push({ id:24, name:"Zone Boss", zone:2, gridSize:8, grid:g as any, robotStart:{x:0,y:0,direction:'right'}, parTime:55, parCommands:10, availableCommands:zone2Commands, maxCommands:18, hint:"Combine all loop types to solve this serpentine path.", conceptTaught:"Loop Mastery" });
  })();

  // ===== ZONE 3: Complex — Architect (10×10) =====
  const zone3Commands = [...zone2Commands, 'ifPathAhead','ifWallTurnLeft','ifWallTurnRight','ifGoalAhead','ifElse'];

  for (let i = 25; i <= 38; i++) {
    const g = fillGrid(10, 1);
    // Create varied paths for each level
    const configs: Record<number, { name: string; concept: string; parCmd: number; parTime: number; hint: string }> = {
      25: { name:"Fork in the Road", concept:"If Path Ahead", parCmd:4, parTime:30, hint:"Use 'If Path Ahead → Move' to navigate safely." },
      26: { name:"Wall Detector", concept:"If Wall → Turn", parCmd:4, parTime:30, hint:"Detect walls and turn automatically." },
      27: { name:"Goal Sensor", concept:"If Goal Ahead", parCmd:3, parTime:25, hint:"Use 'If Goal Ahead → Move' to reach the flag." },
      28: { name:"Blue Tile Rule", concept:"Color Conditionals", parCmd:5, parTime:35, hint:"When you see a blue tile, turn right." },
      29: { name:"Safe Path", concept:"Safe Path Detection", parCmd:5, parTime:35, hint:"Only move forward when the path is clear." },
      30: { name:"Choose Wisely", concept:"If/Else Block", parCmd:6, parTime:40, hint:"Use If/Else to handle two different situations." },
      31: { name:"Two Choices", concept:"Nested If/Else", parCmd:8, parTime:45, hint:"Nest your conditionals for complex decisions." },
      32: { name:"While Blocked", concept:"While Loop", parCmd:6, parTime:40, hint:"Wait while the path is blocked, then move." },
      33: { name:"Sensor Array", concept:"Multiple Sensors", parCmd:9, parTime:50, hint:"Combine multiple sensor commands together." },
      34: { name:"Color Maze", concept:"Color Conditionals", parCmd:10, parTime:55, hint:"Different colored tiles require different actions." },
      35: { name:"Variables Enter", concept:"Set Variable", parCmd:8, parTime:45, hint:"Set a variable to track your progress." },
      36: { name:"Count Steps", concept:"Change Variable", parCmd:8, parTime:45, hint:"Increment stepsTaken each time you move." },
      37: { name:"Conditional Var", concept:"Compare Variable", parCmd:10, parTime:55, hint:"Compare your variable to decide which way to go." },
      38: { name:"Zone Boss", concept:"Conditional Mastery", parCmd:12, parTime:60, hint:"Use everything you've learned about conditionals." },
    };
    const cfg = configs[i];

    // Create unique paths for each level
    const pathSets: Record<number, [number,number][]> = {
      25: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[4,7],[4,8],[4,9]],
      26: [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[2,3],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[1,9]],
      27: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]],
      28: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[5,6],[6,6],[6,7],[6,8],[6,9]],
      29: [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[3,7],[4,7],[5,7],[5,8],[5,9]],
      30: [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2],[3,3],[3,4],[4,4],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9]],
      31: [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[3,2],[2,2],[2,3],[2,4],[2,5],[3,5],[4,5],[5,5],[6,5],[6,6],[6,7],[6,8],[6,9]],
      32: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]],
      33: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[2,5],[3,5],[4,5],[4,6],[4,7],[5,7],[6,7],[7,7],[7,8],[7,9]],
      34: [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,4],[2,5],[2,6],[3,6],[4,6],[4,7],[4,8],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9]],
      35: [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[4,3],[5,3],[5,4],[5,5],[5,6],[6,6],[7,6],[8,6],[8,7],[8,8],[8,9]],
      36: [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4],[4,5],[5,5],[6,5],[7,5],[7,6],[7,7],[7,8],[7,9]],
      37: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[3,5],[3,6],[4,6],[5,6],[6,6],[6,7],[6,8],[7,8],[8,8],[9,8],[9,9]],
      38: [[0,0],[0,1],[1,1],[2,1],[2,2],[2,3],[3,3],[4,3],[4,4],[4,5],[4,6],[5,6],[6,6],[6,7],[7,7],[8,7],[8,8],[9,8],[9,9]],
    };

    setPath(g, pathSets[i]);
    // Add some blue special tiles for conditional levels
    if (i === 28 || i === 34) {
      const path = pathSets[i];
      for (let j = 3; j < path.length - 1; j += 4) {
        g[path[j][0]][path[j][1]] = 4; // special-blue
      }
    }
    g[pathSets[i][0][0]][pathSets[i][0][1]] = 3;
    const last = pathSets[i][pathSets[i].length - 1];
    g[last[0]][last[1]] = 2;

    levels.push({
      id: i,
      name: cfg.name,
      zone: 3,
      gridSize: 10,
      grid: g as any,
      robotStart: { x: pathSets[i][0][1], y: pathSets[i][0][0], direction: 'right' },
      parTime: cfg.parTime,
      parCommands: cfg.parCmd,
      availableCommands: i >= 35 ? [...zone3Commands, 'setVariable', 'changeVariable', 'compareVariable'] : zone3Commands,
      maxCommands: cfg.parCmd + 6,
      hint: cfg.hint,
      conceptTaught: cfg.concept,
    });
  }

  // ===== ZONE 4: University — Master (12×12) =====
  const zone4Commands = [...zone3Commands, 'setVariable', 'changeVariable', 'compareVariable', 'defineFunction', 'callFunction', 'andOp', 'orOp', 'notOp'];

  for (let i = 39; i <= 50; i++) {
    const g = fillGrid(12, 1);
    const configs: Record<number, { name: string; concept: string; parCmd: number; parTime: number; hint: string }> = {
      39: { name:"My First Function", concept:"Define + Call Function", parCmd:5, parTime:35, hint:"Define a GoStraight function and call it." },
      40: { name:"Corner Routine", concept:"TurnCorner Function", parCmd:6, parTime:40, hint:"Create a function that turns a corner efficiently." },
      41: { name:"Reuse It", concept:"Function Reuse", parCmd:5, parTime:35, hint:"Call the same function multiple times." },
      42: { name:"Escape Path", concept:"Complex Functions", parCmd:8, parTime:45, hint:"Build an escape function that navigates complex turns." },
      43: { name:"AND Logic", concept:"AND Operator", parCmd:7, parTime:45, hint:"Both conditions must be true: path ahead AND not wall." },
      44: { name:"OR Logic", concept:"OR Operator", parCmd:7, parTime:45, hint:"Either condition works: goal ahead OR safe tile." },
      45: { name:"NOT Logic", concept:"NOT Operator", parCmd:6, parTime:40, hint:"If NOT wall ahead, then move forward." },
      46: { name:"Combo Logic", concept:"Combined Logic", parCmd:10, parTime:55, hint:"Combine AND, OR, and NOT for complex decisions." },
      47: { name:"Nested Loops", concept:"Loop in Loop", parCmd:9, parTime:55, hint:"Put a loop inside another loop for 2D patterns." },
      48: { name:"Full Algorithm", concept:"All Concepts", parCmd:12, parTime:65, hint:"Functions + loops + conditions all together." },
      49: { name:"Speed Run", concept:"Optimization", parCmd:8, parTime:30, hint:"Solve it with minimum commands — think before you code!" },
      50: { name:"Brilliant OS", concept:"Final Challenge", parCmd:15, parTime:90, hint:"Everything you've learned, in one grand puzzle." },
    };
    const cfg = configs[i];

    // Create complex paths for university levels
    const pathSets: Record<number, [number,number][]> = {
      39: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,6],[5,7],[5,8],[5,9],[5,10],[5,11]],
      40: [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,4],[3,5],[3,6],[4,6],[5,6],[6,6],[6,7],[6,8],[6,9],[7,9],[8,9],[8,10],[8,11]],
      41: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[2,5],[2,6],[2,7],[2,8],[3,8],[4,8],[4,9],[4,10],[4,11]],
      42: [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[1,3],[1,4],[2,4],[3,4],[3,5],[3,6],[2,6],[1,6],[1,7],[1,8],[2,8],[3,8],[3,9],[3,10],[3,11]],
      43: [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[4,2],[4,3],[4,4],[4,5],[5,5],[6,5],[7,5],[7,6],[7,7],[8,7],[9,7],[9,8],[9,9],[9,10],[9,11]],
      44: [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2],[3,3],[4,3],[5,3],[6,3],[6,4],[6,5],[6,6],[7,6],[8,6],[8,7],[8,8],[9,8],[10,8],[10,9],[10,10],[10,11]],
      45: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],[11,11]],
      46: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[3,4],[4,4],[4,5],[4,6],[5,6],[6,6],[6,7],[6,8],[7,8],[8,8],[8,9],[8,10],[9,10],[10,10],[11,10],[11,11]],
      47: [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[4,2],[4,3],[5,3],[6,3],[6,2],[6,1],[7,1],[8,1],[8,2],[8,3],[8,4],[8,5],[9,5],[10,5],[11,5],[11,6],[11,7],[11,8],[11,9],[11,10],[11,11]],
      48: [[0,0],[1,0],[2,0],[3,0],[3,1],[3,2],[3,3],[2,3],[1,3],[1,4],[1,5],[2,5],[3,5],[3,6],[3,7],[4,7],[5,7],[6,7],[6,8],[6,9],[7,9],[8,9],[8,10],[8,11],[9,11],[10,11],[11,11]],
      49: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9],[0,10],[0,11],[1,11],[2,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11]],
      50: [[0,0],[0,1],[0,2],[1,2],[2,2],[2,3],[2,4],[1,4],[0,4],[0,5],[0,6],[0,7],[1,7],[2,7],[3,7],[3,6],[3,5],[4,5],[5,5],[5,6],[5,7],[5,8],[5,9],[6,9],[7,9],[7,8],[7,7],[8,7],[9,7],[9,8],[9,9],[9,10],[9,11],[10,11],[11,11]],
    };

    setPath(g, pathSets[i]);
    g[pathSets[i][0][0]][pathSets[i][0][1]] = 3;
    const last = pathSets[i][pathSets[i].length - 1];
    g[last[0]][last[1]] = 2;

    levels.push({
      id: i,
      name: cfg.name,
      zone: 4,
      gridSize: 12,
      grid: g as any,
      robotStart: { x: pathSets[i][0][1], y: pathSets[i][0][0], direction: 'right' },
      parTime: cfg.parTime,
      parCommands: cfg.parCmd,
      availableCommands: zone4Commands,
      maxCommands: cfg.parCmd + 8,
      hint: cfg.hint,
      conceptTaught: cfg.concept,
    });
  }

  return levels;
}

export const levelData = createLevels();
