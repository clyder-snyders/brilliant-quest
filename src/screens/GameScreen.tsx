import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../game/GameContext';
import { AvatarDisplay } from '../game/avatars';
import { levelData } from '../game/levels';
import { Direction, TileType } from '../game/types';
import { calculateScore } from '../game/storage';
import { validateLevelData } from '../game/validation';
import { GAME_CONFIG } from '../game/constants';

const TILE_CLASSES: Record<number, { bg: string; border?: string }> = {
  0: { bg: '#FFFFFF' },
  1: { bg: '#334155' },
  2: { bg: 'hsl(168, 76%, 40%)' },
  3: { bg: '#DBEAFE' },
  4: { bg: '#BFDBFE' },
  5: { bg: 'hsl(43, 96%, 90%)' },
};

const COMMAND_LABELS: Record<string, string> = {
  moveForward1: '→ Move 1',
  moveForward2: '→→ Move 2',
  moveForward3: '→→→ Move 3',
  turnLeft: '↰ Turn Left',
  turnRight: '↱ Turn Right',
  turnAround: '↻ Turn Around',
  repeat2: '🔁 Repeat 2×',
  repeat3: '🔁 Repeat 3×',
  repeat4: '🔁 Repeat 4×',
  repeat5: '🔁 Repeat 5×',
  repeatUntilGoal: '🔁 Until Goal',
  ifPathAhead: '❓ If Path → Move',
  ifWallTurnLeft: '❓ If Wall → Left',
  ifWallTurnRight: '❓ If Wall → Right',
  ifGoalAhead: '❓ If Goal → Move',
  ifElse: '❓ If/Else',
};

const COMMAND_CATEGORIES = [
  { name: 'Movement', commands: ['moveForward1', 'moveForward2', 'moveForward3', 'turnLeft', 'turnRight', 'turnAround'], unlocksAt: 1 },
  { name: 'Loops', commands: ['repeat2', 'repeat3', 'repeat4', 'repeat5', 'repeatUntilGoal'], unlocksAt: 5 },
  { name: 'Conditionals', commands: ['ifPathAhead', 'ifWallTurnLeft', 'ifWallTurnRight', 'ifGoalAhead', 'ifElse'], unlocksAt: 13 },
];

const DIR_MAP: Record<Direction, { dx: number; dy: number }> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
};

const DIR_ROTATION: Record<Direction, number> = {
  right: 0, down: 90, left: 180, up: 270,
};

const turnRight = (d: Direction): Direction => ({ up: 'right', right: 'down', down: 'left', left: 'up' }[d] as Direction);
const turnLeft = (d: Direction): Direction => ({ up: 'left', left: 'down', down: 'right', right: 'up' }[d] as Direction);
const turnAround = (d: Direction): Direction => ({ up: 'down', down: 'up', left: 'right', right: 'left' }[d] as Direction);

export default function GameScreen() {
  const { state, dispatch } = useGame();
  
  // Safety check: validate level ID, fallback to level 1 if invalid
  const validLevelId = state.currentLevel >= 1 && state.currentLevel <= 50 ? state.currentLevel : 1;
  const level = levelData.find(l => l.id === validLevelId) || levelData[0];
  
  // Validate level data
  useEffect(() => {
    const validation = validateLevelData(level);
    if (!validation.valid) {
      console.error('Invalid level data:', validation.errors);
      // Fallback to first level if current is invalid
      dispatch({ type: 'SET_LEVEL', levelId: 1 });
    }
  }, [level, dispatch]);

  const [robotPos, setRobotPos] = useState({ x: level.robotStart.x, y: level.robotStart.y });
  const [robotDir, setRobotDir] = useState<Direction>(level.robotStart.direction);
  const [sequence, setSequence] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [wallHits, setWallHits] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
  const [wallHitAnim, setWallHitAnim] = useState(false);
  const [message, setMessage] = useState('');
  const timerRef = useRef<number | null>(null);
  const timerValueRef = useRef(0);
  const runningRef = useRef(false);
  const wallAnimTimeoutRef = useRef<number | null>(null);

  // Reset when level changes
  useEffect(() => {
    resetRobot();
    setSequence([]);
    // Load saved sequence from sessionStorage if available
    const savedSeq = sessionStorage.getItem(`level_${level.id}_sequence`);
    if (savedSeq) {
      try {
        const parsed = JSON.parse(savedSeq);
        if (Array.isArray(parsed)) {
          setSequence(parsed);
        }
      } catch (e) {
        console.error('Failed to load saved sequence', e);
      }
    }
    // Start timer when level loads
    setTimerActive(true);
    // eslint-disable-next-line
  }, [state.currentLevel]);

  // Timer effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = window.setInterval(() => {
        setTimer(t => {
          const newValue = t + 1;
          timerValueRef.current = newValue;
          return newValue;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive]);

  // Session persistence effect - auto-save sequence every 2 seconds
  useEffect(() => {
    if (sequence.length === 0) {
      sessionStorage.removeItem(`level_${level.id}_sequence`);
      return;
    }
    const autoSaveInterval = window.setInterval(() => {
      try {
        sessionStorage.setItem(`level_${level.id}_sequence`, JSON.stringify(sequence));
      } catch (e) {
        console.error('Failed to save sequence to sessionStorage', e);
      }
    }, 2000);
    return () => clearInterval(autoSaveInterval);
  }, [sequence, level.id]);

  // Cleanup wall animation timeout to prevent memory leaks
  useEffect(() => {
    return () => {
      if (wallAnimTimeoutRef.current) {
        clearTimeout(wallAnimTimeoutRef.current);
      }
    };
  }, []);

  const resetRobot = () => {
    setRobotPos({ x: level.robotStart.x, y: level.robotStart.y });
    setRobotDir(level.robotStart.direction);
    setCurrentStep(-1);
    setTimer(0);
    timerValueRef.current = 0;
    setTimerActive(false);
    setWallHits(0);
    setHintsUsed(0);
    setShowHint(false);
    setVisitedCells(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
    setMessage('');
    setIsRunning(false);
    runningRef.current = false;
    // Reset visited cells properly
    setVisitedCells(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
  };

  const isWalkable = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= level.gridSize || y >= level.gridSize) return false;
    return level.grid[y][x] !== 1;
  };

  const isGoal = (x: number, y: number) => {
    return level.grid[y]?.[x] === 2;
  };

  /**
   * Validate that a command is available for the current level
   * @param cmd - Command ID to validate
   * @returns Whether the command is available
   */
  const isCommandAvailable = (cmd: string): boolean => {
    return level.availableCommands.includes(cmd) || cmd === '_repeatUntilGoal_';
  };

  /**
   * Expand repeat commands into their individual steps
   * e.g., repeat3 + moveForward1 becomes [moveForward1, moveForward1, moveForward1]
   * Protects against infinite loops by limiting expansion to MAX_REPEAT_CYCLES
   * @param cmds - Array of command IDs to expand
   * @returns Expanded command array with repeat commands resolved to individual steps
   */
  const expandCommands = (cmds: string[]): string[] => {
    const expanded: string[] = [];
    const MAX_EXPANDED_SIZE = GAME_CONFIG.MAX_REPEAT_CYCLES * 10; // Safety limit

    for (let i = 0; i < cmds.length && expanded.length < MAX_EXPANDED_SIZE; i++) {
      const cmd = cmds[i];
      
      // Validate command is available
      if (!isCommandAvailable(cmd)) {
        console.warn(`Command not available for this level: ${cmd}`);
        continue;
      }

      if (cmd === 'repeat2') {
        const next = cmds[i + 1] || 'moveForward1';
        if (expanded.length + 2 <= MAX_EXPANDED_SIZE) {
          expanded.push(next, next);
          if (cmds[i + 1]) i++;
        }
      } else if (cmd === 'repeat3') {
        const next = cmds[i + 1] || 'moveForward1';
        if (expanded.length + 3 <= MAX_EXPANDED_SIZE) {
          expanded.push(next, next, next);
          if (cmds[i + 1]) i++;
        }
      } else if (cmd === 'repeat4') {
        const next = cmds[i + 1] || 'moveForward1';
        if (expanded.length + 4 <= MAX_EXPANDED_SIZE) {
          for (let j = 0; j < 4; j++) expanded.push(next);
          if (cmds[i + 1]) i++;
        }
      } else if (cmd === 'repeat5') {
        const next = cmds[i + 1] || 'moveForward1';
        if (expanded.length + 5 <= MAX_EXPANDED_SIZE) {
          for (let j = 0; j < 5; j++) expanded.push(next);
          if (cmds[i + 1]) i++;
        }
      } else if (cmd === 'repeatUntilGoal') {
        expanded.push('_repeatUntilGoal_');
      } else {
        expanded.push(cmd);
      }
    }

    if (expanded.length >= MAX_EXPANDED_SIZE) {
      console.warn(`Command expansion exceeded safety limit (${expanded.length}). Sequence may be incomplete.`);
    }

    return expanded;
  };

  /**
   * Execute the command sequence step by step
   * Handles robot movement, turns, conditionals, and goal detection
   * Updates UI with robot position, visited cells, and animation states
   * Automatically completes level and transitions to result screen on goal reach
   */
  const runSequence = useCallback(async () => {
    if (sequence.length === 0) return;
    setIsRunning(true);
    runningRef.current = true;
    setMessage('');

    let pos = { x: level.robotStart.x, y: level.robotStart.y };
    let dir: Direction = level.robotStart.direction;
    let hits = 0;
    const visited = new Set([`${pos.x},${pos.y}`]);

    const expanded = expandCommands(sequence);

    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (let i = 0; i < expanded.length; i++) {
      if (!runningRef.current) break;
      setCurrentStep(i);
      const cmd = expanded[i];

      // Handle repeatUntilGoal dynamically
      if (cmd === '_repeatUntilGoal_') {
        // Keep moving forward until goal is reached (max 30 steps)
        for (let attempt = 0; attempt < 30; attempt++) {
          if (!runningRef.current) break;
          const d = DIR_MAP[dir];
          const nx = pos.x + d.dx;
          const ny = pos.y + d.dy;
          if (isWalkable(nx, ny)) {
            pos = { x: nx, y: ny };
            visited.add(`${nx},${ny}`);
            setRobotPos({ ...pos });
            setVisitedCells(new Set(visited));
            await delay(GAME_CONFIG.MOVE_DELAY);
            if (isGoal(nx, ny)) {
              // Goal reached!
              setTimerActive(false);
              setIsRunning(false);
              runningRef.current = false;
              const usedLoops = sequence.some(c => c.startsWith('repeat'));
              const usedFuncs = sequence.some(c => c === 'defineFunction' || c === 'callFunction');
              const result = calculateScore(timerValueRef.current, sequence.length, level.parTime, level.parCommands, hintsUsed, hits, usedLoops, usedFuncs);
              dispatch({
                type: 'COMPLETE_LEVEL',
                levelId: level.id,
                progress: { completed: true, stars: result.stars, bestScore: result.score, bestTime: timerValueRef.current, bestCommandsUsed: sequence.length, bestHintsUsed: hintsUsed, bestWallHits: hits },
              });
              setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'result' }), 500);
              return;
            }
          } else {
            // Hit wall, stop repeating
            hits++;
            setWallHits(h => h + 1);
            setWallHitAnim(true);
            if (wallAnimTimeoutRef.current) clearTimeout(wallAnimTimeoutRef.current);
            wallAnimTimeoutRef.current = window.setTimeout(() => setWallHitAnim(false), GAME_CONFIG.TURN_DELAY);
            await delay(GAME_CONFIG.WALL_HIT_DELAY);
            break;
          }
        }
      } else if (cmd.startsWith('moveForward')) {
        const steps = cmd.includes('3') ? 3 : cmd.includes('2') ? 2 : 1;
        for (let s = 0; s < steps; s++) {
          const d = DIR_MAP[dir];
          const nx = pos.x + d.dx;
          const ny = pos.y + d.dy;
          if (isWalkable(nx, ny)) {
            pos = { x: nx, y: ny };
            visited.add(`${nx},${ny}`);
            setRobotPos({ ...pos });
            setVisitedCells(new Set(visited));
            await delay(GAME_CONFIG.MOVE_DELAY);
            if (isGoal(nx, ny)) {
              // Success!
              setTimerActive(false);
              setIsRunning(false);
              runningRef.current = false;
              const usedLoops = sequence.some(c => c.startsWith('repeat'));
              const usedFuncs = sequence.some(c => c === 'defineFunction' || c === 'callFunction');
              const result = calculateScore(timerValueRef.current, sequence.length, level.parTime, level.parCommands, hintsUsed, hits, usedLoops, usedFuncs);
              dispatch({
                type: 'COMPLETE_LEVEL',
                levelId: level.id,
                progress: { completed: true, stars: result.stars, bestScore: result.score, bestTime: timerValueRef.current, bestCommandsUsed: sequence.length, bestHintsUsed: hintsUsed, bestWallHits: hits },
              });
              // Navigate to result
              setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'result' }), 500);
              return;
            }
          } else {
            hits++;
            setWallHits(h => h + 1);
            setWallHitAnim(true);
            if (wallAnimTimeoutRef.current) clearTimeout(wallAnimTimeoutRef.current);
            wallAnimTimeoutRef.current = window.setTimeout(() => setWallHitAnim(false), GAME_CONFIG.TURN_DELAY);
            await delay(GAME_CONFIG.WALL_HIT_DELAY);
            break;
          }
        }
      } else if (cmd === 'turnLeft') {
        dir = turnLeft(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'turnRight') {
        dir = turnRight(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'turnAround') {
        dir = turnAround(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifPathAhead' || cmd === 'ifGoalAhead') {
        const d = DIR_MAP[dir];
        const nx = pos.x + d.dx;
        const ny = pos.y + d.dy;
        const check = cmd === 'ifGoalAhead' ? isGoal(nx, ny) : isWalkable(nx, ny);
        if (check) {
          pos = { x: nx, y: ny };
          visited.add(`${nx},${ny}`);
          setRobotPos({ ...pos });
          setVisitedCells(new Set(visited));
          await delay(GAME_CONFIG.MOVE_DELAY);
          if (isGoal(nx, ny)) {
            setTimerActive(false);
            setIsRunning(false);
            runningRef.current = false;
            const usedLoops = sequence.some(c => c.startsWith('repeat'));
            const usedFuncs = sequence.some(c => c === 'defineFunction' || c === 'callFunction');
            const result = calculateScore(timerValueRef.current, sequence.length, level.parTime, level.parCommands, hintsUsed, hits, usedLoops, usedFuncs);
            dispatch({
              type: 'COMPLETE_LEVEL',
              levelId: level.id,
              progress: { completed: true, stars: result.stars, bestScore: result.score, bestTime: timerValueRef.current, bestCommandsUsed: sequence.length, bestHintsUsed: hintsUsed, bestWallHits: hits },
            });
            setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'result' }), 500);
            return;
          }
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifWallTurnLeft') {
        const d = DIR_MAP[dir];
        if (!isWalkable(pos.x + d.dx, pos.y + d.dy)) {
          dir = turnLeft(dir);
          setRobotDir(dir);
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifWallTurnRight') {
        const d = DIR_MAP[dir];
        if (!isWalkable(pos.x + d.dx, pos.y + d.dy)) {
          dir = turnRight(dir);
          setRobotDir(dir);
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else {
        await delay(GAME_CONFIG.TURN_DELAY);
      }
    }

    // Sequence ended without goal
    if (runningRef.current) {
      setTimerActive(false);
      setIsRunning(false);
      runningRef.current = false;
      setMessage("Not quite! Your robot didn't reach the goal. Review your sequence.");
    }
    // eslint-disable-next-line
  }, [sequence, level, hintsUsed, dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape key: stop execution or reset
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isRunning) {
          runningRef.current = false;
          setIsRunning(false);
        } else {
          handleReset();
        }
      }
      // Enter key: run sequence (if not already running)
      else if (e.key === 'Enter' && !isRunning && sequence.length > 0) {
        e.preventDefault();
        runSequence();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, sequence.length, runSequence]);

  const addCommand = (cmd: string) => {
    if (isRunning || sequence.length >= level.maxCommands) return;
    // Validate command is available for this level
    if (!level.availableCommands.includes(cmd)) return;
    setSequence([...sequence, cmd]);
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    setSequence(s => s.filter((_, i) => i !== index));
  };

  const undoCommand = () => {
    if (isRunning) return;
    setSequence(s => s.slice(0, -1));
  };

  const clearSequence = () => {
    if (isRunning) return;
    setSequence([]);
    resetRobot();
  };

  const handleReset = () => {
    runningRef.current = false;
    setRobotPos({ x: level.robotStart.x, y: level.robotStart.y });
    setRobotDir(level.robotStart.direction);
    setCurrentStep(-1);
    setTimer(0);
    timerValueRef.current = 0;
    setTimerActive(false);
    setWallHits(0);
    setVisitedCells(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
    setMessage('');
    setIsRunning(false);
  };

  const useHint = () => {
    setShowHint(true);
    if (!state.practiceMode) setHintsUsed(h => h + 1);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const cellSize = level.gridSize <= 6 ? 52 : level.gridSize <= 8 ? 44 : level.gridSize <= 10 ? 38 : 32;

  return (
    <div className="h-screen flex flex-col" style={{ background: 'hsl(220, 27%, 98%)' }}>
      {/* Top Bar */}
      <div className="flex items-center h-14 px-2 md:px-4 border-b shrink-0 text-xs md:text-sm" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
        <button 
          className="btn-secondary py-1 px-2 text-xs" 
          onClick={() => { runningRef.current = false; dispatch({ type: 'SET_SCREEN', screen: 'levelMap' }); }}
          aria-label="Return to level map"
        >
          ← <span className="hidden sm:inline">Map</span>
        </button>
        <div className="flex-1 text-center min-w-0">
          <span className="font-bold text-xs sm:text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>L{level.id}</span>
          {state.practiceMode && <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'hsl(25, 95%, 93%)', color: 'hsl(25, 95%, 53%)' }}>P</span>}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span style={{ color: timer > level.parTime * 2 ? 'hsl(0, 84%, 60%)' : 'hsl(215, 16%, 47%)' }}>⏱ {formatTime(timer)}</span>
          <span className="hidden sm:inline" style={{ color: 'hsl(215, 16%, 47%)' }}>Moves: {sequence.length}/{level.maxCommands}</span>
          <span className="sm:hidden" style={{ color: 'hsl(215, 16%, 47%)' }}>{sequence.length}/{level.maxCommands}</span>
        </div>
      </div>

      {/* Main 3-column layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-[220px] shrink-0 border-r overflow-y-auto p-4 hidden md:block" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
          <div className="mb-4">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: zones[level.zone - 1]?.bg }}>
              Zone {level.zone}
            </span>
            <h3 className="font-bold mt-2" style={{ color: 'hsl(217, 33%, 17%)' }}>{level.name}</h3>
            <p className="text-xs italic mt-1" style={{ color: 'hsl(215, 16%, 47%)' }}>Guide your robot to the goal tile</p>
          </div>

          <div className="text-xs space-y-1 mb-4" style={{ color: 'hsl(215, 16%, 47%)' }}>
            <p>⏱ Par: {level.parTime}s</p>
            <p>📝 Par: {level.parCommands} commands</p>
            <p>💡 Concept: {level.conceptTaught}</p>
          </div>

          <button
            className="btn-secondary w-full text-xs py-2"
            onClick={useHint}
            aria-label="Show hint for this level"
          >
            💡 Use Hint {!state.practiceMode && '(–50 pts)'}
          </button>

          {showHint && (
            <div className="mt-3 p-3 rounded-xl text-xs" style={{ background: 'hsl(43, 96%, 95%)', color: 'hsl(217, 33%, 17%)' }}>
              {level.hint}
            </div>
          )}
        </div>

        {/* Center — Grid */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-2 md:p-4">
          <div
            className="inline-grid gap-0 rounded-xl overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${level.gridSize}, ${cellSize}px)`,
              border: '2px solid hsl(214, 32%, 91%)',
            }}
          >
            {level.grid.map((row, ry) =>
              row.map((cell, cx) => {
                const isRobot = robotPos.x === cx && robotPos.y === ry;
                const isVisited = visitedCells.has(`${cx},${ry}`);

                return (
                  <div
                    key={`${cx}-${ry}`}
                    className="relative flex items-center justify-center"
                    role="button"
                    aria-label={`Grid tile at row ${ry + 1} column ${cx + 1}${isRobot ? ', robot is here' : ''}${isGoal(cx, ry) ? ', goal location' : ''}${cell === 1 ? ', wall' : ''}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: TILE_CLASSES[cell as number]?.bg || '#fff',
                      borderRight: cx < level.gridSize - 1 ? '1px solid hsl(214, 32%, 91%)' : 'none',
                      borderBottom: ry < level.gridSize - 1 ? '1px solid hsl(214, 32%, 91%)' : 'none',
                    }}
                  >
                    {/* Visited trail */}
                    {isVisited && cell !== 3 && cell !== 2 && (
                      <div className="absolute inset-0" style={{ background: 'hsl(217, 91%, 95%)', opacity: 0.5 }} />
                    )}

                    {/* Goal flag */}
                    {cell === 2 && (
                      <svg width="20" height="20" viewBox="0 0 20 20" className="animate-pulse-slow">
                        <line x1="5" y1="3" x2="5" y2="17" stroke="hsl(168, 76%, 30%)" strokeWidth="1.5" />
                        <polygon points="6,3 16,7 6,11" fill="hsl(168, 76%, 40%)" />
                      </svg>
                    )}

                    {/* Bonus sparkle */}
                    {cell === 5 && (
                      <span className="text-sm animate-pulse-slow">✨</span>
                    )}

                    {/* Robot */}
                    {isRobot && (
                      <div
                        className={`absolute z-10 transition-all duration-300 ease-in-out ${wallHitAnim ? 'animate-wall-hit' : ''}`}
                        style={{
                          transform: `rotate(${DIR_ROTATION[robotDir]}deg)`,
                        }}
                      >
                        <AvatarDisplay avatarId={state.avatar} size={cellSize - 8} />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Progress bar */}
          {isRunning && currentStep >= 0 && (
            <div className="mt-3 w-full max-w-md">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(220, 33%, 95%)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / sequence.length) * 100}%`, background: 'hsl(217, 91%, 60%)' }} />
              </div>
              <p className="text-xs mt-1 text-center" style={{ color: 'hsl(215, 16%, 47%)' }}>Step {currentStep + 1} of {sequence.length}</p>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className="mt-3 p-3 rounded-xl text-sm text-center max-w-md" style={{ background: 'hsl(25, 95%, 95%)', color: 'hsl(25, 95%, 40%)' }}>
              {message}
            </div>
          )}
        </div>

        {/* Right Panel — Commands & Sequence */}
        <div className="w-full md:w-[260px] shrink-0 border-l flex flex-col overflow-hidden" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
          {/* Command Palette */}
          <div className="flex-1 overflow-y-auto p-3 border-b" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'hsl(215, 16%, 47%)' }}>Commands</h4>
            {COMMAND_CATEGORIES.map(cat => {
              const unlocked = level.id >= cat.unlocksAt;
              return (
                <div key={cat.name} className="mb-3">
                  <p className="text-xs font-bold mb-1" style={{ color: unlocked ? 'hsl(217, 33%, 17%)' : 'hsl(215, 16%, 67%)' }}>
                    {unlocked ? '' : '🔒 '}{cat.name}
                    {!unlocked && <span className="font-normal"> — Lv {cat.unlocksAt}</span>}
                  </p>
                  {unlocked && (
                    <div className="flex flex-wrap gap-1">
                      {cat.commands.filter(c => level.availableCommands.includes(c)).map(cmd => (
                        <button
                          key={cmd}
                          onClick={() => addCommand(cmd)}
                          disabled={isRunning}
                          className="px-2 py-1 rounded-lg text-xs font-code transition-all duration-200"
                          aria-label={`Add ${COMMAND_LABELS[cmd] || cmd} command to sequence`}
                          style={{
                            background: 'hsl(220, 33%, 95%)',
                            border: '1px solid hsl(214, 32%, 91%)',
                            color: 'hsl(217, 33%, 17%)',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            opacity: isRunning ? 0.5 : 1,
                          }}
                          onMouseOver={e => { if (!isRunning) { e.currentTarget.style.borderColor = 'hsl(217, 91%, 60%)'; e.currentTarget.style.background = 'hsl(217, 91%, 97%)'; }}}
                          onMouseOut={e => { e.currentTarget.style.borderColor = 'hsl(214, 32%, 91%)'; e.currentTarget.style.background = 'hsl(220, 33%, 95%)'; }}
                        >
                          {COMMAND_LABELS[cmd] || cmd}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sequence Builder */}
          <div className="h-[45%] flex flex-col p-3">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'hsl(215, 16%, 47%)' }}>Your Sequence</h4>
              <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'hsl(220, 33%, 95%)', color: 'hsl(215, 16%, 47%)' }}>
                {sequence.length} / {level.maxCommands}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 mb-2">
              {sequence.length === 0 ? (
                <p className="text-xs text-center py-4" style={{ color: 'hsl(215, 16%, 67%)' }}>Click commands above to add them</p>
              ) : (
                sequence.map((cmd, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 px-2 py-1 rounded-lg text-xs font-code"
                    style={{
                      background: currentStep === i && isRunning ? 'hsl(217, 91%, 60%)' : 'hsl(220, 33%, 95%)',
                      color: currentStep === i && isRunning ? 'white' : 'hsl(217, 33%, 17%)',
                    }}
                  >
                    <span className="w-5 text-right opacity-50">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1">{COMMAND_LABELS[cmd] || cmd}</span>
                    {!isRunning && (
                      <button onClick={() => removeCommand(i)} className="opacity-50 hover:opacity-100">×</button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Action buttons */}
            <div className="grid gap-2">
              {!isRunning ? (
                <>
                  <button 
                    className="btn-primary text-xs py-2" 
                    onClick={runSequence} 
                    disabled={sequence.length === 0} 
                    aria-label="Execute the command sequence"
                    style={{ opacity: sequence.length === 0 ? 0.5 : 1 }}
                  >
                    ▶ Run
                  </button>
                  <div className="grid grid-cols-3 gap-2">
                    <button 
                      className="btn-secondary text-xs py-2" 
                      onClick={undoCommand}
                      aria-label="Remove the last command from sequence"
                    >
                      ↩ Undo
                    </button>
                    <button 
                      className="btn-secondary text-xs py-2" 
                      onClick={clearSequence}
                      aria-label="Clear all commands from sequence"
                    >
                      ⊘ Clear
                    </button>
                    <button 
                      className="btn-secondary text-xs py-2" 
                      onClick={handleReset}
                      aria-label="Reset robot to starting position"
                    >
                      ↺ Reset
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button 
                    className="btn-primary text-xs py-2" 
                    onClick={() => { runningRef.current = false; setIsRunning(false); }} 
                    aria-label="Stop executing the sequence"
                    style={{ background: 'hsl(0, 84%, 60%)', borderColor: 'hsl(0, 84%, 60%)' }}
                  >
                    ⏹ Stop
                  </button>
                  <button 
                    className="btn-secondary text-xs py-2" 
                    onClick={handleReset}
                    aria-label="Reset robot to starting position"
                  >
                    ↺ Reset
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const zones = [
  { bg: 'hsl(168, 76%, 40%)' },
  { bg: 'hsl(217, 91%, 60%)' },
  { bg: 'hsl(258, 90%, 66%)' },
  { bg: 'hsl(217, 33%, 17%)' },
];
