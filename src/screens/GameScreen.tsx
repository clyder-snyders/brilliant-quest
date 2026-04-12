import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../game/GameContext';
import { AvatarDisplay } from '../game/avatars';
import { levelData } from '../game/levels';
import { Direction } from '../game/types';
import { calculateScore } from '../game/storage';
import { validateLevelData } from '../game/validation';
import { GAME_CONFIG } from '../game/constants';
import { IconTimer } from '../components/Icons';
import BlockPalette from '../components/BlockPalette';
import CodeWorkspace from '../components/CodeWorkspace';

interface WorkspaceBlock {
  blockId: string;
  instanceId: string;
}

const TILE_COLORS: Record<number, string> = {
  0: '#FFFFFF',
  1: '#334155', // Wall
  2: '#10B981', // Goal
  3: '#93C5FD', // Start
  4: '#BFDBFE',
  5: '#FCD34D',
};

const DIR_MAP: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

const DIR_ROTATION: Record<Direction, number> = {
  right: 0, down: 90, left: 180, up: 270,
};

const turnRight = (d: Direction): Direction => 
  ({ up: 'right', right: 'down', down: 'left', left: 'up' }[d] as Direction);
const turnLeft = (d: Direction): Direction => 
  ({ up: 'left', left: 'down', down: 'right', right: 'up' }[d] as Direction);
const turnAround = (d: Direction): Direction => 
  ({ up: 'down', down: 'up', left: 'right', right: 'left' }[d] as Direction);

export default function GameScreen() {
  const { state, dispatch } = useGame();

  // Get current level
  const validLevelId = Math.max(1, Math.min(50, state.currentLevel));
  let level = levelData.find(l => l.id === validLevelId) || levelData[0];

  if (!level) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="font-bold text-lg mb-2">Error: Level Not Found</p>
          <button className="btn-primary" onClick={() => dispatch({ type: 'SET_LEVEL', levelId: 1 })}>
            Go to Level 1
          </button>
        </div>
      </div>
    );
  }

  // Validate level
  useEffect(() => {
    const validation = validateLevelData(level);
    if (!validation.valid && level.id > 1) {
      dispatch({ type: 'SET_LEVEL', levelId: 1 });
    }
  }, [level.id, dispatch]);

  // Game state
  const [blocks, setBlocks] = useState<WorkspaceBlock[]>([]);
  const [robotPos, setRobotPos] = useState(() => ({ x: level.robotStart.x, y: level.robotStart.y }));
  const [robotDir, setRobotDir] = useState<Direction>(
    (['up', 'down', 'left', 'right'].includes(level.robotStart.direction) ? level.robotStart.direction : 'right') as Direction
  );
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [timer, setTimer] = useState(0);
  const [wallHits, setWallHits] = useState(0);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(() => 
    new Set([`${level.robotStart.x},${level.robotStart.y}`])
  );
  const [message, setMessage] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timerValueRef = useRef(0);
  const runningRef = useRef(false);

  // Reset level when it changes
  useEffect(() => {
    setBlocks([]);
    setRobotPos({ x: level.robotStart.x, y: level.robotStart.y });
    const validDir = (['up', 'down', 'left', 'right'].includes(level.robotStart.direction) ? level.robotStart.direction : 'right') as Direction;
    setRobotDir(validDir);
    setCurrentStep(-1);
    setTimer(0);
    setWallHits(0);
    setVisitedCells(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
    setMessage('');
    if (timerRef.current) clearInterval(timerRef.current);
  }, [level.id]);

  // Timer management
  useEffect(() => {
    if (isRunning && timerRef.current === null) {
      timerRef.current = setInterval(() => {
        setTimer(t => {
          timerValueRef.current = t + 1;
          return t + 1;
        });
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const isWalkable = (x: number, y: number) => {
    return x >= 0 && y >= 0 && x < level.gridSize && y < level.gridSize && level.grid[y][x] !== 1;
  };

  const isGoal = (x: number, y: number) => level.grid[y]?.[x] === 2;

  const convertBlocksToSequence = (): string[] => {
    return blocks.map(b => b.blockId);
  };

  const handleRun = useCallback(async () => {
    const sequence = convertBlocksToSequence();
    if (sequence.length === 0) return;

    setIsRunning(true);
    runningRef.current = true;
    setMessage('');
    setTimer(0);
    timerValueRef.current = 0;

    let pos = { x: level.robotStart.x, y: level.robotStart.y };
    let dir: Direction = (['up', 'down', 'left', 'right'].includes(level.robotStart.direction) ? level.robotStart.direction : 'right') as Direction;
    let hits = 0;
    const visited = new Set([`${pos.x},${pos.y}`]);

    setRobotPos({ ...pos });
    setRobotDir(dir);
    setVisitedCells(new Set(visited));
    setWallHits(0);

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < sequence.length && runningRef.current; i++) {
      setCurrentStep(i);
      const cmd = sequence[i];

      if (cmd === 'moveForward1') {
        const dm = DIR_MAP[dir];
        const nx = pos.x + dm.dx;
        const ny = pos.y + dm.dy;
        if (isWalkable(nx, ny)) {
          pos = { x: nx, y: ny };
          visited.add(`${nx},${ny}`);
          setRobotPos({ ...pos });
          setVisitedCells(new Set(visited));
          if (isGoal(nx, ny)) {
            handleLevelComplete(sequence.length, hits);
            return;
          }
        } else {
          hits++;
          setWallHits(hits);
        }
        await delay(GAME_CONFIG.MOVE_DELAY || 350);
      } else if (cmd === 'moveForward2') {
        for (let s = 0; s < 2; s++) {
          const dm = DIR_MAP[dir];
          const nx = pos.x + dm.dx;
          const ny = pos.y + dm.dy;
          if (isWalkable(nx, ny)) {
            pos = { x: nx, y: ny };
            visited.add(`${nx},${ny}`);
            setRobotPos({ ...pos });
            setVisitedCells(new Set(visited));
            if (isGoal(nx, ny)) {
              handleLevelComplete(sequence.length, hits);
              return;
            }
          } else {
            hits++;
            setWallHits(hits);
            break;
          }
          await delay(GAME_CONFIG.MOVE_DELAY || 350);
        }
      } else if (cmd === 'moveForward3') {
        for (let s = 0; s < 3; s++) {
          const dm = DIR_MAP[dir];
          const nx = pos.x + dm.dx;
          const ny = pos.y + dm.dy;
          if (isWalkable(nx, ny)) {
            pos = { x: nx, y: ny };
            visited.add(`${nx},${ny}`);
            setRobotPos({ ...pos });
            setVisitedCells(new Set(visited));
            if (isGoal(nx, ny)) {
              handleLevelComplete(sequence.length, hits);
              return;
            }
          } else {
            hits++;
            setWallHits(hits);
            break;
          }
          await delay(GAME_CONFIG.MOVE_DELAY || 350);
        }
      } else if (cmd === 'turnLeft') {
        dir = turnLeft(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY || 300);
      } else if (cmd === 'turnRight') {
        dir = turnRight(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY || 300);
      } else if (cmd === 'ifPathAhead') {
        const dm = DIR_MAP[dir];
        if (isWalkable(pos.x + dm.dx, pos.y + dm.dy)) {
          const nx = pos.x + dm.dx;
          const ny = pos.y + dm.dy;
          pos = { x: nx, y: ny };
          visited.add(`${nx},${ny}`);
          setRobotPos({ ...pos });
          setVisitedCells(new Set(visited));
          if (isGoal(nx, ny)) {
            handleLevelComplete(sequence.length, hits);
            return;
          }
        }
        await delay(GAME_CONFIG.TURN_DELAY || 300);
      } else if (cmd === 'ifWallLeft') {
        const leftDir = turnLeft(dir);
        const dm = DIR_MAP[leftDir];
        if (!isWalkable(pos.x + dm.dx, pos.y + dm.dy)) {
          // Wall detected on left, do nothing (or could turn)
        }
        await delay(GAME_CONFIG.TURN_DELAY || 300);
      } else if (cmd === 'ifWallRight') {
        const rightDir = turnRight(dir);
        const dm = DIR_MAP[rightDir];
        if (!isWalkable(pos.x + dm.dx, pos.y + dm.dy)) {
          // Wall detected on right, do nothing
        }
        await delay(GAME_CONFIG.TURN_DELAY || 300);
      } else {
        await delay(100);
      }
    }

    // Sequence finished without reaching goal
    setIsRunning(false);
    runningRef.current = false;
    setCurrentStep(-1);
    setMessage(hits > 0 ? `Hit ${hits} wall${hits > 1 ? 's' : ''}! Try again.` : 'Almost there! Adjust your code.');
  }, [level]);

  const handleLevelComplete = (commandCount: number, hits: number) => {
    setIsRunning(false);
    runningRef.current = false;
    setCurrentStep(-1);
    setMessage('Level Complete! 🎉');

    const result = calculateScore(timerValueRef.current, commandCount, level.parTime, level.parCommands, hits, true, false);
    
    dispatch({
      type: 'COMPLETE_LEVEL',
      levelId: level.id,
      progress: {
        completed: true,
        stars: result.stars,
        bestScore: result.score,
        bestTime: timerValueRef.current,
        bestCommandsUsed: commandCount,
        bestWallHits: hits,
      },
    });

    setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'result' }), 1500);
  };

  const cellSize = level.gridSize <= 6 ? 50 : level.gridSize <= 8 ? 40 : level.gridSize <= 10 ? 32 : 28;

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between">
        <button
          className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-semibold"
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'levelMap' })}
        >
          ← Map
        </button>
        <div className="text-center">
          <p className="font-bold">Level {level.id}: {level.name}</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1">
            <IconTimer size={16} /> {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
          </span>
          <span>{blocks.length} / {level.maxCommands}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Block Palette */}
        <div className="w-48 border-r border-gray-200 bg-gray-50 flex flex-col">
          <BlockPalette availableCommands={level.availableCommands} />
        </div>

        {/* Center: Game Grid */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
          <div className="relative">
            <div
              className="inline-grid gap-0 rounded-lg overflow-hidden border-2 border-gray-300"
              style={{
                gridTemplateColumns: `repeat(${level.gridSize}, ${cellSize}px)`,
              }}
            >
              {level.grid.map((row, ry) =>
                row.map((cell, cx) => {
                  const isRobot = robotPos.x === cx && robotPos.y === ry;
                  const isVisited = visitedCells.has(`${cx},${ry}`);
                  return (
                    <div
                      key={`${cx}-${ry}`}
                      className="relative flex items-center justify-center border border-gray-200"
                      style={{
                        width: cellSize,
                        height: cellSize,
                        background: TILE_COLORS[cell as number] || '#fff',
                        opacity: isVisited && !isRobot ? 0.7 : 1,
                      }}
                    >
                      {cell === 2 && (
                        <div className="text-lg">⭐</div>
                      )}
                      {isRobot && (
                        <div style={{ transform: `rotate(${DIR_ROTATION[robotDir]}deg)` }}>
                          <AvatarDisplay avatarId={state.avatar} size={cellSize - 8} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            {message && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full mt-4 px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg text-center text-green-800 font-semibold">
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Right: Code Workspace */}
        <div className="w-80 border-l border-gray-200 flex flex-col bg-white">
          <CodeWorkspace
            blocks={blocks}
            onBlocksChange={setBlocks}
            maxBlocks={level.maxCommands}
            onRun={handleRun}
            isRunning={isRunning}
            currentStep={currentStep}
          />
        </div>
      </div>
    </div>
  );
}
