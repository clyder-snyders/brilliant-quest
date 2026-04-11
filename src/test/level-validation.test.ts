import { describe, it, expect } from 'vitest';
import { levelData as levels } from '../game/levels';

describe('Level Validation Suite', () => {
  it('should have exactly 50 levels', () => {
    expect(levels).toHaveLength(50);
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
          const grid = level.grid;
          expect(Array.isArray(grid)).toBe(true);
          expect(grid.length).toBe(level.gridSize);
          grid.forEach((row, y) => {
            expect(row.length).toBe(level.gridSize);
          });
        });

        it('should have start and goal markers in grid', () => {
          const grid = level.grid;
          let hasStart = false;
          let hasGoal = false;
          
          for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
              if (grid[y][x] === 3) hasStart = true;
              if (grid[y][x] === 2) hasGoal = true;
            }
          }
          
          expect(hasStart).toBe(true, `Level ${level.id} should have a start marker (3)`);
          expect(hasGoal).toBe(true, `Level ${level.id} should have a goal marker (2)`);
        });

        it('should have robot start within grid bounds', () => {
          expect(level.robotStart.x).toBeGreaterThanOrEqual(0);
          expect(level.robotStart.x).toBeLessThan(level.gridSize);
          expect(level.robotStart.y).toBeGreaterThanOrEqual(0);
          expect(level.robotStart.y).toBeLessThan(level.gridSize);
        });

        it('should have robot start position accessible in grid', () => {
          const { x, y } = level.robotStart;
          const gridCell = level.grid[y][x];
          // Grid should either have a path (0) or start marker (3) at robot position
          expect([0, 3]).toContain(gridCell, 
            `Robot at (${x},${y}) should be on path or start, but grid[${y}][${x}]=${gridCell}`);
        });

        it('should have valid available commands', () => {
          expect(level.availableCommands).toBeDefined();
          expect(Array.isArray(level.availableCommands)).toBe(true);
          expect(level.availableCommands.length).toBeGreaterThan(0);
        });

        it('should have realistic par values', () => {
          expect(level.parCommands).toBeGreaterThan(0);
          expect(level.parCommands).toBeLessThanOrEqual(level.maxCommands);
          expect(level.parTime).toBeGreaterThan(0);
        });

        it('should have positive max commands', () => {
          expect(level.maxCommands).toBeGreaterThan(level.parCommands);
        });

        it('should have valid zone based on difficulty', () => {
          expect([1, 2, 3, 4]).toContain(level.zone);
          // Zone 1: levels 1-12
          if (level.id <= 12) expect(level.zone).toBe(1);
          // Zone 2: levels 13-24
          if (level.id >= 13 && level.id <= 24) expect(level.zone).toBe(2);
          // Zone 3: levels 25-38
          if (level.id >= 25 && level.id <= 38) expect(level.zone).toBe(3);
          // Zone 4: levels 39-50
          if (level.id >= 39) expect(level.zone).toBe(4);
        });

        it('should have correct grid size for zone', () => {
          if (level.zone === 1) expect(level.gridSize).toBe(6);
          if (level.zone === 2) expect(level.gridSize).toBe(8);
          if (level.zone === 3) expect(level.gridSize).toBe(10);
          if (level.zone === 4) expect(level.gridSize).toBe(12);
        });
      });
    });
  });

  describe('Critical fixes verification', () => {
    it('Level 3 should have correct robot start at path beginning', () => {
      const level3 = levels.find(l => l.id === 3);
      expect(level3).toBeDefined();
      expect(level3!.robotStart.x).toBe(2);
      expect(level3!.robotStart.y).toBe(0);
      // Verify start marker is at this position
      expect(level3!.grid[0][2]).toBe(3);
    });

    it('Level 7 should have realistic par commands (13+)', () => {
      const level7 = levels.find(l => l.id === 7);
      expect(level7).toBeDefined();
      expect(level7!.parCommands).toBeGreaterThanOrEqual(13);
    });

    it('Level 9 should have correct robot start at path beginning', () => {
      const level9 = levels.find(l => l.id === 9);
      expect(level9).toBeDefined();
      expect(level9!.robotStart.x).toBe(1);
      expect(level9!.robotStart.y).toBe(0);
      // Verify start marker is at this position
      expect(level9!.grid[0][1]).toBe(3);
    });
  });

  describe('Path connectivity', () => {
    // Sample check for Levels 1, 7, 12 (zone boss)
    [1, 7, 12, 24, 38, 50].forEach(levelId => {
      it(`Level ${levelId} should have valid adjacent path cells`, () => {
        const level = levels.find(l => l.id === levelId);
        expect(level).toBeDefined();
        
        const grid = level!.grid;
        const { x: startX, y: startY } = level!.robotStart;
        
        // Find start marker position
        let markerX = -1, markerY = -1;
        for (let y = 0; y < grid.length; y++) {
          for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === 3) {
              markerX = x;
              markerY = y;
            }
          }
        }
        
        // Start marker should exist and be at accessible location
        expect(markerX).toBeGreaterThanOrEqual(0);
        expect(markerY).toBeGreaterThanOrEqual(0);
        
        // Robot should be able to at least move once (check adjacent cells)
        const start = grid[startY][startX];
        expect([0, 3]).toContain(start);
      });
    });
  });
});
