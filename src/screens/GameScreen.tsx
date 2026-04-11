import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '../game/GameContext';
import { AvatarDisplay } from '../game/avatars';
import { levelData } from '../game/levels';
import { Direction, TileType } from '../game/types';
import { calculateScore } from '../game/storage';
import { validateLevelData } from '../game/validation';
import { GAME_CONFIG } from '../game/constants';
import { IconTimer, IconCode } from '../components/Icons';

const TILE_CLASSES: Record<number, { bg: string }> = {
  0: { bg: '#FFFFFF' },
  1: { bg: '#334155' },
  2: { bg: 'hsl(168, 76%, 40%)' },
  3: { bg: '#DBEAFE' },
  4: { bg: '#BFDBFE' },
  5: { bg: 'hsl(43, 96%, 90%)' },
};

const COMMAND_LABELS: Record<string, string> = {
  moveForward1: 'Move 1',
  moveForward2: 'Move 2',
  moveForward3: 'Move 3',
  turnLeft: 'Turn Left',
  turnRight: 'Turn Right',
  turnAround: 'Turn Around',
  repeat2: 'Repeat 2x',
  repeat3: 'Repeat 3x',
  repeat4: 'Repeat 4x',
  repeat5: 'Repeat 5x',
  repeatUntilGoal: 'Until Goal',
  ifPathAhead: 'If Path',
  ifWallTurnLeft: 'If Wall L',
  ifWallTurnRight: 'If Wall R',
  ifGoalAhead: 'If Goal',
  ifElse: 'If/Else',
  setVariable: 'Set Var',
  changeVariable: 'Var +1',
  compareVariable: 'If Var >= 3',
  defineFunction: 'Define Fn',
  callFunction: 'Call Fn',
  andOp: 'AND',
  orOp: 'OR',
  notOp: 'NOT',
};

const COMMAND_CATEGORIES = [
  { name: 'Movement', commands: ['moveForward1', 'moveForward2', 'moveForward3', 'turnLeft', 'turnRight', 'turnAround'], unlocksAt: 1 },
  { name: 'Loops', commands: ['repeat2', 'repeat3', 'repeat4', 'repeat5', 'repeatUntilGoal'], unlocksAt: 5 },
  { name: 'Conditionals', commands: ['ifPathAhead', 'ifWallTurnLeft', 'ifWallTurnRight', 'ifGoalAhead', 'ifElse'], unlocksAt: 13 },
  { name: 'Variables', commands: ['setVariable', 'changeVariable', 'compareVariable'], unlocksAt: 35 },
  { name: 'Functions', commands: ['defineFunction', 'callFunction'], unlocksAt: 39 },
  { name: 'Logic', commands: ['andOp', 'orOp', 'notOp'], unlocksAt: 43 },
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

const turnRightFn = (d: Direction): Direction => ({ up: 'right', right: 'down', down: 'left', left: 'up' }[d] as Direction);
const turnLeftFn = (d: Direction): Direction => ({ up: 'left', left: 'down', down: 'right', right: 'up' }[d] as Direction);
const turnAroundFn = (d: Direction): Direction => ({ up: 'down', down: 'up', left: 'right', right: 'left' }[d] as Direction);

export default function GameScreen() {
  const { state, dispatch } = useGame();

  const validLevelId = state.currentLevel >= 1 && state.currentLevel <= 50 ? state.currentLevel : 1;
  const level = levelData.find(l => l.id === validLevelId) || levelData[0];

  useEffect(() => {
    const validation = validateLevelData(level);
    if (!validation.valid) {
      console.error('Invalid level data:', validation.errors);
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
  const [wallHits, setWallHits] = useState(0);
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
  const [wallHitAnim, setWallHitAnim] = useState(false);
  const [message, setMessage] = useState('');
  const [failureReason, setFailureReason] = useState('');
  const timerRef = useRef<number | null>(null);
  const timerValueRef = useRef(0);
  const runningRef = useRef(false);
  const wallAnimTimeoutRef = useRef<number | null>(null);

  // Reset when level changes
  useEffect(() => {
    resetLevel();
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
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timerActive]);

  useEffect(() => {
    return () => {
      if (wallAnimTimeoutRef.current) clearTimeout(wallAnimTimeoutRef.current);
    };
  }, []);

  const resetLevel = () => {
    // Stop any running execution
    runningRef.current = false;
    setIsRunning(false);
    // Reset robot
    setRobotPos({ x: level.robotStart.x, y: level.robotStart.y });
    setRobotDir(level.robotStart.direction);
    setCurrentStep(-1);
    // Reset timer completely
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
    timerValueRef.current = 0;
    setTimerActive(true); // Restart timer
    // Reset state
    setWallHits(0);
    setVisitedCells(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
    setMessage('');
    setFailureReason('');
    setSequence([]);
  };

  const handleReset = () => {
    runningRef.current = false;
    setIsRunning(false);
    setRobotPos({ x: level.robotStart.x, y: level.robotStart.y });
    setRobotDir(level.robotStart.direction);
    setCurrentStep(-1);
    // Fully reset timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTimer(0);
    timerValueRef.current = 0;
    setTimerActive(true); // Restart timer from 0
    setWallHits(0);
    setVisitedCells(new Set([`${level.robotStart.x},${level.robotStart.y}`]));
    setMessage('');
    setFailureReason('');
  };

  const isWalkable = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= level.gridSize || y >= level.gridSize) return false;
    return level.grid[y][x] !== 1;
  };

  const isGoal = (x: number, y: number) => level.grid[y]?.[x] === 2;

  const expandCommands = (cmds: string[]): string[] => {
    const expanded: string[] = [];
    const MAX_EXPANDED_SIZE = GAME_CONFIG.MAX_REPEAT_CYCLES * 10;
    let functionBody: string[] = [];
    let definingFunction = false;

    for (let i = 0; i < cmds.length && expanded.length < MAX_EXPANDED_SIZE; i++) {
      const cmd = cmds[i];

      if (cmd === 'defineFunction') {
        definingFunction = true;
        functionBody = [];
        continue;
      }

      if (definingFunction) {
        if (cmd === 'callFunction') {
          definingFunction = false;
          // Execute the function body once
          expanded.push(...functionBody);
          continue;
        }
        functionBody.push(cmd);
        continue;
      }

      if (cmd === 'callFunction' && functionBody.length > 0) {
        expanded.push(...functionBody);
        continue;
      }

      if (cmd === 'repeat2') {
        const next = cmds[i + 1] || 'moveForward1';
        expanded.push(next, next);
        if (cmds[i + 1]) i++;
      } else if (cmd === 'repeat3') {
        const next = cmds[i + 1] || 'moveForward1';
        expanded.push(next, next, next);
        if (cmds[i + 1]) i++;
      } else if (cmd === 'repeat4') {
        const next = cmds[i + 1] || 'moveForward1';
        for (let j = 0; j < 4; j++) expanded.push(next);
        if (cmds[i + 1]) i++;
      } else if (cmd === 'repeat5') {
        const next = cmds[i + 1] || 'moveForward1';
        for (let j = 0; j < 5; j++) expanded.push(next);
        if (cmds[i + 1]) i++;
      } else if (cmd === 'repeatUntilGoal') {
        expanded.push('_repeatUntilGoal_');
      } else {
        expanded.push(cmd);
      }
    }

    return expanded;
  };

  const runSequence = useCallback(async () => {
    if (sequence.length === 0) return;
    setIsRunning(true);
    runningRef.current = true;
    setMessage('');
    setFailureReason('');

    // Reset robot position for the run
    let pos = { x: level.robotStart.x, y: level.robotStart.y };
    let dir: Direction = level.robotStart.direction;
    let hits = 0;
    let stoppedByWall = false;
    let variableCounter = 0;
    const visited = new Set([`${pos.x},${pos.y}`]);

    setRobotPos({ ...pos });
    setRobotDir(dir);
    setVisitedCells(new Set(visited));

    // Ensure timer is running
    setTimerActive(true);

    const expanded = expandCommands(sequence);
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    const handleGoalReached = () => {
      setTimerActive(false);
      setIsRunning(false);
      runningRef.current = false;
      const usedLoops = sequence.some(c => c.startsWith('repeat'));
      const usedFuncs = sequence.some(c => c === 'defineFunction' || c === 'callFunction');
      const result = calculateScore(timerValueRef.current, sequence.length, level.parTime, level.parCommands, hits, usedLoops, usedFuncs);
      dispatch({
        type: 'COMPLETE_LEVEL',
        levelId: level.id,
        progress: { completed: true, stars: result.stars, bestScore: result.score, bestTime: timerValueRef.current, bestCommandsUsed: sequence.length, bestWallHits: hits },
      });
      setTimeout(() => dispatch({ type: 'SET_SCREEN', screen: 'result' }), 500);
    };

    const tryMove = async (d: Direction): Promise<boolean> => {
      const dm = DIR_MAP[d];
      const nx = pos.x + dm.dx;
      const ny = pos.y + dm.dy;
      if (isWalkable(nx, ny)) {
        pos = { x: nx, y: ny };
        visited.add(`${nx},${ny}`);
        setRobotPos({ ...pos });
        setVisitedCells(new Set(visited));
        await delay(GAME_CONFIG.MOVE_DELAY);
        if (isGoal(nx, ny)) {
          handleGoalReached();
          return true; // goal reached
        }
        return false;
      } else {
        hits++;
        stoppedByWall = true;
        setWallHits(h => h + 1);
        setWallHitAnim(true);
        if (wallAnimTimeoutRef.current) clearTimeout(wallAnimTimeoutRef.current);
        wallAnimTimeoutRef.current = window.setTimeout(() => setWallHitAnim(false), GAME_CONFIG.TURN_DELAY);
        await delay(GAME_CONFIG.WALL_HIT_DELAY);
        return false;
      }
    };

    for (let i = 0; i < expanded.length; i++) {
      if (!runningRef.current) break;
      setCurrentStep(i);
      const cmd = expanded[i];

      if (cmd === '_repeatUntilGoal_') {
        for (let attempt = 0; attempt < 30; attempt++) {
          if (!runningRef.current) break;
          const dm = DIR_MAP[dir];
          const nx = pos.x + dm.dx;
          const ny = pos.y + dm.dy;
          if (isWalkable(nx, ny)) {
            pos = { x: nx, y: ny };
            visited.add(`${nx},${ny}`);
            setRobotPos({ ...pos });
            setVisitedCells(new Set(visited));
            await delay(GAME_CONFIG.MOVE_DELAY);
            if (isGoal(nx, ny)) {
              handleGoalReached();
              return;
            }
          } else {
            hits++;
            stoppedByWall = true;
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
          if (!runningRef.current) break;
          const goalReached = await tryMove(dir);
          if (goalReached) return;
          if (stoppedByWall) break;
        }
      } else if (cmd === 'turnLeft') {
        dir = turnLeftFn(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'turnRight') {
        dir = turnRightFn(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'turnAround') {
        dir = turnAroundFn(dir);
        setRobotDir(dir);
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifPathAhead' || cmd === 'ifGoalAhead') {
        const dm = DIR_MAP[dir];
        const nx = pos.x + dm.dx;
        const ny = pos.y + dm.dy;
        const check = cmd === 'ifGoalAhead' ? isGoal(nx, ny) : isWalkable(nx, ny);
        if (check) {
          const goalReached = await tryMove(dir);
          if (goalReached) return;
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifWallTurnLeft') {
        const dm = DIR_MAP[dir];
        if (!isWalkable(pos.x + dm.dx, pos.y + dm.dy)) {
          dir = turnLeftFn(dir);
          setRobotDir(dir);
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifWallTurnRight') {
        const dm = DIR_MAP[dir];
        if (!isWalkable(pos.x + dm.dx, pos.y + dm.dy)) {
          dir = turnRightFn(dir);
          setRobotDir(dir);
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'ifElse') {
        // If path ahead → move forward, else turn right
        const dm = DIR_MAP[dir];
        if (isWalkable(pos.x + dm.dx, pos.y + dm.dy)) {
          const goalReached = await tryMove(dir);
          if (goalReached) return;
        } else {
          dir = turnRightFn(dir);
          setRobotDir(dir);
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'setVariable') {
        variableCounter = 0;
        await delay(200);
      } else if (cmd === 'changeVariable') {
        variableCounter++;
        await delay(200);
      } else if (cmd === 'compareVariable') {
        // If variable >= 3, move forward
        if (variableCounter >= 3) {
          const goalReached = await tryMove(dir);
          if (goalReached) return;
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else if (cmd === 'andOp' || cmd === 'orOp' || cmd === 'notOp') {
        // Logic operators: check conditions and move if true
        const dm = DIR_MAP[dir];
        const pathAhead = isWalkable(pos.x + dm.dx, pos.y + dm.dy);
        let shouldMove = false;

        if (cmd === 'andOp') {
          shouldMove = pathAhead && !isGoal(pos.x + dm.dx, pos.y + dm.dy) === false;
          // AND: path ahead AND not at boundary
          shouldMove = pathAhead;
        } else if (cmd === 'orOp') {
          // OR: path ahead or can turn
          shouldMove = pathAhead;
        } else if (cmd === 'notOp') {
          // NOT: if NOT wall ahead, move
          shouldMove = pathAhead;
        }

        if (shouldMove) {
          const goalReached = await tryMove(dir);
          if (goalReached) return;
        } else {
          dir = turnRightFn(dir);
          setRobotDir(dir);
        }
        await delay(GAME_CONFIG.TURN_DELAY);
      } else {
        await delay(GAME_CONFIG.TURN_DELAY);
      }
    }

    // Sequence ended without reaching goal
    if (runningRef.current) {
      setTimerActive(false);
      setIsRunning(false);
      runningRef.current = false;

      // Determine specific failure reason
      if (stoppedByWall) {
        setFailureReason("The robot hit a wall and couldn't continue.");
      } else {
        setFailureReason("You ran out of commands before reaching the goal.");
      }
      setMessage("Not quite! Try adjusting your sequence.");
    }
    // eslint-disable-next-line
  }, [sequence, level, dispatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isRunning) {
          runningRef.current = false;
          setIsRunning(false);
        } else {
          handleReset();
        }
      } else if (e.key === 'Enter' && !isRunning && sequence.length > 0) {
        e.preventDefault();
        runSequence();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isRunning, sequence.length, runSequence]);

  const addCommand = (cmd: string) => {
    if (isRunning || sequence.length >= level.maxCommands) return;
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
    handleReset();
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const cellSize = level.gridSize <= 6 ? 48 : level.gridSize <= 8 ? 40 : level.gridSize <= 10 ? 34 : 28;
  const mobileCellSize = level.gridSize <= 6 ? 44 : level.gridSize <= 8 ? 36 : level.gridSize <= 10 ? 30 : 24;

  const renderGrid = (cSize: number) => (
    <div
      className="inline-grid gap-0 rounded-xl overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${level.gridSize}, ${cSize}px)`,
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
              style={{
                width: cSize,
                height: cSize,
                background: TILE_CLASSES[cell as number]?.bg || '#fff',
                borderRight: cx < level.gridSize - 1 ? '1px solid hsl(214, 32%, 91%)' : 'none',
                borderBottom: ry < level.gridSize - 1 ? '1px solid hsl(214, 32%, 91%)' : 'none',
              }}
            >
              {isVisited && cell !== 3 && cell !== 2 && (
                <div className="absolute inset-0" style={{ background: 'hsl(217, 91%, 95%)', opacity: 0.5 }} />
              )}
              {cell === 2 && (
                <svg width={cSize * 0.4} height={cSize * 0.4} viewBox="0 0 20 20" className="animate-pulse-slow">
                  <line x1="5" y1="3" x2="5" y2="17" stroke="hsl(168, 76%, 30%)" strokeWidth="1.5" />
                  <polygon points="6,3 16,7 6,11" fill="hsl(168, 76%, 40%)" />
                </svg>
              )}
              {cell === 5 && <span className="text-xs animate-pulse-slow"><svg width="12" height="12" viewBox="0 0 24 24" fill="hsl(43, 96%, 56%)"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" /></svg></span>}
              {isRobot && (
                <div
                  className={`absolute z-10 transition-all duration-300 ease-in-out ${wallHitAnim ? 'animate-wall-hit' : ''}`}
                  style={{ transform: `rotate(${DIR_ROTATION[robotDir]}deg)` }}
                >
                  <AvatarDisplay avatarId={state.avatar} size={cSize - 6} />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  const renderCommands = () => (
    <>
      <div className="flex-1 overflow-y-auto p-3 border-b" style={{ borderColor: 'hsl(214, 32%, 91%)' }}>
        <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'hsl(215, 16%, 47%)' }}>Commands</h4>
        {COMMAND_CATEGORIES.map(cat => {
          const unlocked = level.id >= cat.unlocksAt;
          const availableCmds = cat.commands.filter(c => level.availableCommands.includes(c));
          if (!unlocked || availableCmds.length === 0) return null;
          return (
            <div key={cat.name} className="mb-3">
              <p className="text-xs font-bold mb-1" style={{ color: 'hsl(217, 33%, 17%)' }}>{cat.name}</p>
              <div className="flex flex-wrap gap-1">
                {availableCmds.map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => addCommand(cmd)}
                    disabled={isRunning}
                    className="px-2 py-1.5 rounded-lg text-xs font-code transition-all duration-200 active:scale-95"
                    style={{
                      background: 'hsl(220, 33%, 95%)',
                      border: '1px solid hsl(214, 32%, 91%)',
                      color: 'hsl(217, 33%, 17%)',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      opacity: isRunning ? 0.5 : 1,
                      minHeight: '36px',
                    }}
                  >
                    {COMMAND_LABELS[cmd] || cmd}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sequence Builder */}
      <div className="flex flex-col p-3" style={{ minHeight: '200px', maxHeight: '45%' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'hsl(215, 16%, 47%)' }}>Your Sequence</h4>
          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'hsl(220, 33%, 95%)', color: 'hsl(215, 16%, 47%)' }}>
            {sequence.length} / {level.maxCommands}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 mb-2" style={{ maxHeight: '150px' }}>
          {sequence.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: 'hsl(215, 16%, 67%)' }}>Tap commands above to add them</p>
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
                <span className="flex-1 truncate">{COMMAND_LABELS[cmd] || cmd}</span>
                {!isRunning && (
                  <button onClick={() => removeCommand(i)} className="opacity-50 hover:opacity-100 p-1">×</button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="grid gap-2">
          {!isRunning ? (
            <>
              <button className="btn-primary text-xs py-2.5" onClick={runSequence} disabled={sequence.length === 0} style={{ opacity: sequence.length === 0 ? 0.5 : 1 }}>
                ▶ Run
              </button>
              <div className="grid grid-cols-3 gap-2">
                <button className="btn-secondary text-xs py-2" onClick={undoCommand}>↩ Undo</button>
                <button className="btn-secondary text-xs py-2" onClick={clearSequence}>⊘ Clear</button>
                <button className="btn-secondary text-xs py-2" onClick={handleReset}>↺ Reset</button>
              </div>
            </>
          ) : (
            <>
              <button className="btn-primary text-xs py-2.5" onClick={() => { runningRef.current = false; setIsRunning(false); }} style={{ background: 'hsl(0, 84%, 60%)', borderColor: 'hsl(0, 84%, 60%)' }}>
                ⏹ Stop
              </button>
              <button className="btn-secondary text-xs py-2" onClick={handleReset}>↺ Reset</button>
            </>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen flex flex-col" style={{ background: 'hsl(220, 27%, 98%)' }}>
      {/* Top Bar */}
      <div className="flex items-center h-12 md:h-14 px-2 md:px-4 border-b shrink-0 text-xs md:text-sm" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
        <button className="btn-secondary py-1 px-2 text-xs" onClick={() => { runningRef.current = false; dispatch({ type: 'SET_SCREEN', screen: 'levelMap' }); }}>
          ← <span className="hidden sm:inline">Map</span>
        </button>
        <div className="flex-1 text-center min-w-0">
          <span className="font-bold text-xs sm:text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>L{level.id}: {level.name}</span>
          {state.practiceMode && <span className="ml-1 px-1.5 py-0.5 rounded text-xs font-bold" style={{ background: 'hsl(25, 95%, 93%)', color: 'hsl(25, 95%, 53%)' }}>P</span>}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className="flex items-center gap-1" style={{ color: timer > level.parTime * 2 ? 'hsl(0, 84%, 60%)' : 'hsl(215, 16%, 47%)' }}><IconTimer size={14} /> {formatTime(timer)}</span>
          <span style={{ color: 'hsl(215, 16%, 47%)' }}>{sequence.length}/{level.maxCommands}</span>
        </div>
      </div>



      {/* Desktop: 3-column layout */}
      <div className="flex-1 hidden md:flex overflow-hidden">
        {/* Left Panel - Level Info */}
        <div className="w-[200px] shrink-0 border-r overflow-y-auto p-4" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
          <div className="mb-4">
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: zones[level.zone - 1]?.bg }}>
              Zone {level.zone}
            </span>
            <h3 className="font-bold mt-2" style={{ color: 'hsl(217, 33%, 17%)' }}>{level.name}</h3>
            <p className="text-xs italic mt-1" style={{ color: 'hsl(215, 16%, 47%)' }}>Guide your robot to the goal tile</p>
          </div>
          <div className="text-xs space-y-1 mb-4" style={{ color: 'hsl(215, 16%, 47%)' }}>
            <p className="flex items-center gap-1"><IconTimer size={12} /> Par: {level.parTime}s</p>
            <p className="flex items-center gap-1"><IconCode size={12} /> Par: {level.parCommands} {level.parCommands === 1 ? 'command' : 'commands'}</p>
            <p className="flex items-center gap-1"><IconCode size={12} /> Max: {level.maxCommands} {level.maxCommands === 1 ? 'command' : 'commands'}</p>
            <p>Concept: {level.conceptTaught}</p>
          </div>
        </div>

        {/* Center — Grid */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-auto p-4">
          {renderGrid(cellSize)}

          {isRunning && currentStep >= 0 && (
            <div className="mt-3 w-full max-w-md">
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'hsl(220, 33%, 95%)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / sequence.length) * 100}%`, background: 'hsl(217, 91%, 60%)' }} />
              </div>
              <p className="text-xs mt-1 text-center" style={{ color: 'hsl(215, 16%, 47%)' }}>Step {currentStep + 1} of {sequence.length}</p>
            </div>
          )}

          {message && (
            <div className="mt-3 p-3 rounded-xl text-sm text-center max-w-md" style={{ background: 'hsl(25, 95%, 95%)', color: 'hsl(25, 95%, 40%)' }}>
              <p className="font-bold mb-1">{message}</p>
              {failureReason && <p className="text-xs">{failureReason}</p>}
            </div>
          )}
        </div>

        {/* Right Panel — Commands & Sequence */}
        <div className="w-[260px] shrink-0 border-l flex flex-col overflow-hidden" style={{ background: 'white', borderColor: 'hsl(214, 32%, 91%)' }}>
          {renderCommands()}
        </div>
      </div>

      {/* Mobile Layout - Vertical Stack */}
      <div className="flex-1 flex flex-col md:hidden overflow-auto">
        {/* Mobile Grid - Smaller and at Top */}
        <div className="flex justify-center py-2 px-2 shrink-0" style={{ background: 'white', borderBottom: '1px solid hsl(214, 32%, 91%)' }}>
          {renderGrid(mobileCellSize)}
        </div>

        {/* Mobile Progress Bar */}
        {isRunning && currentStep >= 0 && (
          <div className="shrink-0 px-2 py-2" style={{ background: 'white', borderBottom: '1px solid hsl(214, 32%, 91%)' }}>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'hsl(220, 33%, 95%)' }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / sequence.length) * 100}%`, background: 'hsl(217, 91%, 60%)' }} />
            </div>
          </div>
        )}

        {/* Mobile Message */}
        {message && (
          <div className="shrink-0 px-2 py-2" style={{ background: 'hsl(25, 95%, 95%)', borderBottom: '1px solid hsl(214, 32%, 91%)' }}>
            <div className="text-xs text-center rounded-lg p-2" style={{ color: 'hsl(25, 95%, 40%)' }}>
              <p className="font-bold">{message}</p>
              {failureReason && <p className="mt-1">{failureReason}</p>}
            </div>
          </div>
        )}

        {/* Mobile Commands Panel - Takes Remaining Space */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {renderCommands()}
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
