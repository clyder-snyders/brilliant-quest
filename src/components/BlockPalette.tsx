import React from 'react';

interface Block {
  id: string;
  label: string;
  type: 'movement' | 'loop' | 'conditional' | 'variable' | 'function' | 'logic';
  color: string;
}

export const BLOCK_LIBRARY: Record<string, Block> = {
  moveForward1: { id: 'moveForward1', label: 'Move 1', type: 'movement', color: '#3B82F6' },
  moveForward2: { id: 'moveForward2', label: 'Move 2', type: 'movement', color: '#3B82F6' },
  moveForward3: { id: 'moveForward3', label: 'Move 3', type: 'movement', color: '#3B82F6' },
  turnLeft: { id: 'turnLeft', label: 'Turn Left', type: 'movement', color: '#3B82F6' },
  turnRight: { id: 'turnRight', label: 'Turn Right', type: 'movement', color: '#3B82F6' },
  repeat2: { id: 'repeat2', label: 'Repeat 2x', type: 'loop', color: '#F59E0B' },
  repeat3: { id: 'repeat3', label: 'Repeat 3x', type: 'loop', color: '#F59E0B' },
  repeat4: { id: 'repeat4', label: 'Repeat 4x', type: 'loop', color: '#F59E0B' },
  repeat5: { id: 'repeat5', label: 'Repeat 5x', type: 'loop', color: '#F59E0B' },
  repeatUntilGoal: { id: 'repeatUntilGoal', label: 'Until Goal', type: 'loop', color: '#F59E0B' },
  repeatUntilWall: { id: 'repeatUntilWall', label: 'Until Wall', type: 'loop', color: '#F59E0B' },
  ifPathAhead: { id: 'ifPathAhead', label: 'If Path', type: 'conditional', color: '#8B5CF6' },
  ifWallLeft: { id: 'ifWallLeft', label: 'If Wall Left', type: 'conditional', color: '#8B5CF6' },
  ifWallRight: { id: 'ifWallRight', label: 'If Wall Right', type: 'conditional', color: '#8B5CF6' },
  ifGoalAhead: { id: 'ifGoalAhead', label: 'If Goal', type: 'conditional', color: '#8B5CF6' },
  ifElse: { id: 'ifElse', label: 'If/Else', type: 'conditional', color: '#8B5CF6' },
  andOp: { id: 'andOp', label: 'AND', type: 'logic', color: '#EC4899' },
  orOp: { id: 'orOp', label: 'OR', type: 'logic', color: '#EC4899' },
  notOp: { id: 'notOp', label: 'NOT', type: 'logic', color: '#EC4899' },
};

const CATEGORY_COLORS: Record<string, string> = {
  movement: '#3B82F6',
  loop: '#F59E0B',
  conditional: '#8B5CF6',
  variable: '#10B981',
  function: '#6366F1',
  logic: '#EC4899',
};

interface BlockPaletteProps {
  availableCommands: string[];
  onDragStart?: (blockId: string) => void;
}

export default function BlockPalette({ availableCommands, onDragStart }: BlockPaletteProps) {
  const categories = ['movement', 'loop', 'conditional', 'logic'] as const;

  return (
    <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
      <h4 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6B7280' }}>
        Block Palette
      </h4>

      {categories.map(category => {
        const blocksInCategory = availableCommands
          .map(cmd => BLOCK_LIBRARY[cmd])
          .filter(block => block && block.type === category);

        if (blocksInCategory.length === 0) return null;

        return (
          <div key={category} className="mb-4">
            <p className="text-xs font-bold mb-2" style={{ color: CATEGORY_COLORS[category] }}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </p>
            <div className="space-y-2">
              {blocksInCategory.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'copy';
                    e.dataTransfer.setData('blockId', block.id);
                    onDragStart?.(block.id);
                  }}
                  className="p-3 rounded-lg text-white cursor-move transition-all duration-150 hover:shadow-lg active:scale-95 select-none"
                  style={{
                    background: block.color,
                    filter: 'brightness(0.95)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.filter = 'brightness(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.filter = 'brightness(0.95)';
                  }}
                >
                  <span className="text-sm font-semibold">{block.label}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export type { Block };
