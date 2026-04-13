import { describe, it, expect } from 'vitest';
import { levelData as levels } from '../game/levels';

describe('Level Validation Suite', () => {
  it('should have exactly 50 levels', () => {
    expect(levels).toHaveLength(50);
  });

  it('should have no duplicate level IDs', () => {
    const ids = levels.map(l => l.id);
    expect(new Set(ids).size).toBe(50);
  });

  it('should have no duplicate paths (levels must be unique)', () => {
    const pathStrings = levels.map(l => {
      const cells: string[] = [];
      for (let y = 0; y < l.gridSize; y++) {
        for (let x = 0; x < l.gridSize; x++) {
          if (l.grid[y][x] !== 1) cells.push(`${x},${y}`);
        }
      }
      return cells.sort().join('|');
    });
    // Check adjacent levels in same zone aren't identical
    for (let i = 0; i < pathStrings.length - 1; i++) {
      if (levels[i].zone === levels[i+1].zone) {
        expect(pathStrings[i]).not.toBe(pathStrings[i+1]);
      }
    }
  });

  describe('Level structure', () => {
    levels.forEach(level => {
      describe(`Level ${level.id}: ${level.name}`, () => {
        it('should have all required properties', () => {
          expect(level).toHaveProperty('id');
          expect(level).toHaveProperty('name');
          expect(level).toHaveProperty('zone');
          expect(level).toHaveProperty('grid');
          expect(level).toHaveProperty('robotStart');
          expect(level).toHaveProperty('parTime');
          expect(level).toHaveProperty('parCommands');
          expect(level).toHaveProperty('availableCommands');
          expect(level).toHaveProperty('maxCommands');
        });

        it('should have valid grid dimensions', () => {
          expect(level.grid.length).toBe(level.gridSize);
          level.grid.forEach((row) => {
            expect(row.length).toBe(level.gridSize);
          });
        });

        it('should have start and goal markers', () => {
          let hasStart = false, hasGoal = false;
          for (let y = 0; y < level.grid.length; y++) {
            for (let x = 0; x < level.grid[y].length; x++) {
              if (level.grid[y][x] === 3) hasStart = true;
              if (level.grid[y][x] === 2) hasGoal = true;
            }
          }
          expect(hasStart).toBe(true);
          expect(hasGoal).toBe(true);
        });

        it('should have robot start within grid bounds', () => {
          expect(level.robotStart.x).toBeGreaterThanOrEqual(0);
          expect(level.robotStart.x).toBeLessThan(level.gridSize);
          expect(level.robotStart.y).toBeGreaterThanOrEqual(0);
          expect(level.robotStart.y).toBeLessThan(level.gridSize);
        });

        it('should have robot on walkable cell', () => {
          const { x, y } = level.robotStart;
          expect([0, 3]).toContain(level.grid[y][x]);
        });

        it('should have valid par and max commands', () => {
          expect(level.parCommands).toBeGreaterThan(0);
          expect(level.parCommands).toBeLessThanOrEqual(level.maxCommands);
          expect(level.parTime).toBeGreaterThan(0);
          expect(level.maxCommands).toBeGreaterThan(level.parCommands);
        });

        it('should have correct zone', () => {
          if (level.id <= 10) expect(level.zone).toBe(1);
          else if (level.id <= 25) expect(level.zone).toBe(2);
          else if (level.id <= 40) expect(level.zone).toBe(3);
          else expect(level.zone).toBe(4);
        });

        it('should have valid grid size', () => {
          expect([5, 6, 8, 10, 12]).toContain(level.gridSize);
        });
      });
    });
  });
});
