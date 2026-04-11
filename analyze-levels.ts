// Detailed level analysis
import { levelData } from './src/game/levels';

for (const level of levelData) {
  console.log(`\n=== Level ${level.id}: ${level.name} ===`);
  console.log(`Grid Size: ${level.gridSize}×${level.gridSize}`);
  console.log(`Robot Start: (${level.robotStart.x}, ${level.robotStart.y}) facing ${level.robotStart.direction}`);
  console.log(`Par: ${level.parCommands} commands, ${level.parTime}s`);
  console.log(`Max: ${level.maxCommands} commands`);
  
  // Find start and goal in grid
  let startPos = null;
  let goalPos = null;
  
  for (let r = 0; r < level.grid.length; r++) {
    for (let c = 0; c < level.grid[r].length; c++) {
      if (level.grid[r][c] === 3) {
        startPos = { x: c, y: r };
      }
      if (level.grid[r][c] === 2) {
        goalPos = { x: c, y: r };
      }
    }
  }
  
  console.log(`Start marker at: (${startPos?.x}, ${startPos?.y})`);
  console.log(`Goal marker at: (${goalPos?.x}, ${goalPos?.y})`);
  
  if (startPos && (startPos.x !== level.robotStart.x || startPos.y !== level.robotStart.y)) {
    console.log(`⚠️  MISMATCH: robotStart doesn't match start marker!`);
  }
  
  // Get tile at robot start
  const tile = level.grid[level.robotStart.y][level.robotStart.x];
  console.log(`Tile at robot start: ${tile} (0=path, 1=wall, 2=goal, 3=start, 4=blue, 5=bonus)`);
  
  // Verify path exists
  let tileCount = 0;
  for (let r = 0; r < level.grid.length; r++) {
    for (let c = 0; c < level.grid[r].length; c++) {
      if (level.grid[r][c] !== 1) tileCount++;
    }
  }
  console.log(`Walkable tiles: ${tileCount}`);
}
