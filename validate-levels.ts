// Validation script for levels
import { levelData } from './src/game/levels';

interface ValidationIssue {
  levelId: number;
  levelName: string;
  issues: string[];
}

function validateLevel(level: any): ValidationIssue | null {
  const issues: string[] = [];
  
  // Validate grid exists and is square
  if (!level.grid || !Array.isArray(level.grid)) {
    issues.push('Missing or invalid grid');
    return { levelId: level.id, levelName: level.name, issues };
  }
  
  if (level.grid.length !== level.gridSize) {
    issues.push(`Grid rows (${level.grid.length}) do not match gridSize (${level.gridSize})`);
  }
  
  for (let r = 0; r < level.grid.length; r++) {
    if (level.grid[r].length !== level.gridSize) {
      issues.push(`Grid row ${r} has ${level.grid[r].length} columns, expected ${level.gridSize}`);
      break;
    }
  }
  
  // Validate robot start position
  const { x, y, direction } = level.robotStart;
  if (x < 0 || x >= level.gridSize || y < 0 || y >= level.gridSize) {
    issues.push(`Robot start position (${x}, ${y}) is outside grid bounds (0-${level.gridSize - 1})`);
  } else {
    const startTile = level.grid[y][x];
    if (startTile === 1) {
      issues.push(`Robot starts on wall tile at (${x}, ${y}) - should start on a walkable tile (0 or 3)`);
    }
  }
  
  // Validate start marker exists
  let startCount = 0;
  let startPos = { x: -1, y: -1 };
  for (let r = 0; r < level.grid.length; r++) {
    for (let c = 0; c < level.grid[r].length; c++) {
      if (level.grid[r][c] === 3) {
        startCount++;
        startPos = { x: c, y: r };
      }
    }
  }
  if (startCount !== 1) {
    issues.push(`Found ${startCount} start markers (tile 3), expected exactly 1`);
  } else if (startPos.x !== x || startPos.y !== y) {
    issues.push(`Robot start position (${x}, ${y}) does not match start marker at (${startPos.x}, ${startPos.y})`);
  }
  
  // Validate goal exists
  let goalCount = 0;
  let goalPos = { x: -1, y: -1 };
  for (let r = 0; r < level.grid.length; r++) {
    for (let c = 0; c < level.grid[r].length; c++) {
      if (level.grid[r][c] === 2) {
        goalCount++;
        goalPos = { x: c, y: r };
      }
    }
  }
  if (goalCount !== 1) {
    issues.push(`Found ${goalCount} goal markers (tile 2), expected exactly 1`);
  }
  
  // Validate path connectivity (basic BFS check)
  if (startCount === 1 && goalCount === 1) {
    const visited = new Set<string>();
    const queue = [{ x: startPos.x, y: startPos.y }];
    visited.add(`${startPos.x},${startPos.y}`);
    
    while (queue.length > 0) {
      const { x: cx, y: cy } = queue.shift()!;
      if (cx === goalPos.x && cy === goalPos.y) {
        // Path exists to goal
        break;
      }
      
      // Check adjacent cells (up, down, left, right)
      for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
        const nx = cx + dx;
        const ny = cy + dy;
        const key = `${nx},${ny}`;
        
        if (nx >= 0 && nx < level.gridSize && ny >= 0 && ny < level.gridSize &&
            !visited.has(key) && level.grid[ny][nx] !== 1) {
          visited.add(key);
          queue.push({ x: nx, y: ny });
        }
      }
    }
    
    if (!visited.has(`${goalPos.x},${goalPos.y}`)) {
      issues.push(`No path exists from start to goal`);
    }
  }
  
  // Validate par values
  if (level.parTime <= 0 || level.parTime > 120) {
    issues.push(`Par time (${level.parTime}s) is unrealistic`);
  }
  
  if (level.parCommands <= 0 || level.parCommands > 50) {
    issues.push(`Par commands (${level.parCommands}) is unrealistic`);
  }
  
  if (level.maxCommands < level.parCommands) {
    issues.push(`Max commands (${level.maxCommands}) is less than par (${level.parCommands})`);
  }
  
  // Validate available commands
  if (!Array.isArray(level.availableCommands) || level.availableCommands.length === 0) {
    issues.push(`No available commands defined`);
  }
  
  return issues.length > 0 ? { levelId: level.id, levelName: level.name, issues } : null;
}

console.log('=== LEVEL VALIDATION REPORT ===\n');

const problems: ValidationIssue[] = [];
let validCount = 0;

for (const level of levelData) {
  const issue = validateLevel(level);
  if (issue) {
    problems.push(issue);
  } else {
    validCount++;
  }
}

if (problems.length === 0) {
  console.log(`✅ All ${levelData.length} levels are valid!`);
} else {
  console.log(`❌ Found issues in ${problems.length} levels (${validCount} valid):\n`);
  
  for (const problem of problems) {
    console.log(`\n📍 Level ${problem.levelId}: ${problem.levelName}`);
    problem.issues.forEach(issue => console.log(`   • ${issue}`));
  }
}
