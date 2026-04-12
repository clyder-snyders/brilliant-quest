import React, { useState, useRef, useEffect } from 'react';
import { BLOCK_LIBRARY } from './BlockPalette';

interface WorkspaceBlock {
  blockId: string;
  instanceId: string;
}

interface CodeWorkspaceProps {
  blocks: WorkspaceBlock[];
  onBlocksChange: (blocks: WorkspaceBlock[]) => void;
  maxBlocks?: number;
  onRun?: () => void;
  isRunning?: boolean;
  currentStep?: number;
}

export default function CodeWorkspace({
  blocks,
  onBlocksChange,
  maxBlocks = 50,
  onRun,
  isRunning = false,
  currentStep = -1,
}: CodeWorkspaceProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (typeof index === 'number') {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, insertIndex?: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    const blockId = e.dataTransfer.getData('blockId');
    if (!blockId) return;

    if (blocks.length >= maxBlocks) {
      alert(`Maximum ${maxBlocks} blocks allowed`);
      return;
    }

    const newBlock: WorkspaceBlock = {
      blockId,
      instanceId: `${blockId}-${Date.now()}-${Math.random()}`,
    };

    const newBlocks = insertIndex !== undefined
      ? [...blocks.slice(0, insertIndex), newBlock, ...blocks.slice(insertIndex)]
      : [...blocks, newBlock];

    onBlocksChange(newBlocks);
  };

  const removeBlock = (instanceId: string) => {
    onBlocksChange(blocks.filter(b => b.instanceId !== instanceId));
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(fromIndex, 1);
    newBlocks.splice(toIndex, 0, movedBlock);
    onBlocksChange(newBlocks);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border-2" style={{ borderColor: '#E5E7EB' }}>
      {/* Workspace Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: '#E5E7EB' }}>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold" style={{ color: '#1F2937' }}>Your Code</h4>
          <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: '#F3F4F6', color: '#6B7280' }}>
            {blocks.length} / {maxBlocks}
          </span>
        </div>
        <p className="text-xs" style={{ color: '#9CA3AF' }}>
          Drag blocks here to build your program
        </p>
      </div>

      {/* Workspace Area */}
      <div
        ref={workspaceRef}
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
        className="flex-1 p-4 overflow-y-auto space-y-2"
        style={{
          background: dragOverIndex === undefined ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
          transition: 'background-color 0.2s',
        }}
      >
        {blocks.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <p className="text-sm font-semibold mb-1" style={{ color: '#9CA3AF' }}>
                No blocks yet
              </p>
              <p className="text-xs" style={{ color: '#D1D5DB' }}>
                Drag blocks from the left palette
              </p>
            </div>
          </div>
        ) : (
          blocks.map((block, index) => {
            const blockData = BLOCK_LIBRARY[block.blockId];
            if (!blockData) return null;

            const isActive = isRunning && currentStep === index;
            const isCompleted = isRunning && currentStep > index;

            return (
              <div key={block.instanceId}>
                {/* Drop Zone Above */}
                {index === 0 && (
                  <div
                    onDragOver={(e) => handleDragOver(e, 0)}
                    onDrop={(e) => handleDrop(e, 0)}
                    className="h-8 rounded-lg transition-colors"
                    style={{
                      background: dragOverIndex === 0 ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                      border: dragOverIndex === 0 ? '2px dashed #3B82F6' : '2px dashed transparent',
                    }}
                  />
                )}

                {/* Block */}
                <div
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    e.dataTransfer.setData('blockIndex', String(index));
                  }}
                  className="p-3 rounded-lg text-white cursor-move transition-all duration-150 shadow-md"
                  style={{
                    background: blockData.color,
                    opacity: isCompleted ? 0.5 : 1,
                    border: isActive ? '3px solid rgba(255, 255, 255, 0.8)' : '1px solid rgba(0, 0, 0, 0.2)',
                    transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-xs opacity-75 font-mono">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-semibold">{blockData.label}</span>
                    </div>
                    {!isRunning && (
                      <button
                        onClick={() => removeBlock(block.instanceId)}
                        className="p-1 opacity-70 hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Drop Zone Below */}
                <div
                  onDragOver={(e) => handleDragOver(e, index + 1)}
                  onDrop={(e) => handleDrop(e, index + 1)}
                  className="h-8 rounded-lg transition-colors"
                  style={{
                    background: dragOverIndex === index + 1 ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
                    border: dragOverIndex === index + 1 ? '2px dashed #3B82F6' : '2px dashed transparent',
                  }}
                />
              </div>
            );
          })
        )}

        {/* Final Drop Zone */}
        {blocks.length > 0 && (
          <div
            onDragOver={(e) => handleDragOver(e, blocks.length)}
            onDrop={(e) => handleDrop(e, blocks.length)}
            className="h-8 rounded-lg transition-colors"
            style={{
              background: dragOverIndex === blocks.length ? 'rgba(59, 130, 246, 0.3)' : 'transparent',
              border: dragOverIndex === blocks.length ? '2px dashed #3B82F6' : '2px dashed transparent',
            }}
          />
        )}
      </div>

      {/* Controls */}
      <div className="px-4 py-3 border-t space-y-2" style={{ borderColor: '#E5E7EB' }}>
        <button
          onClick={onRun}
          disabled={blocks.length === 0 || isRunning}
          className="w-full py-2.5 px-4 rounded-lg font-semibold transition-all"
          style={{
            background: isRunning ? '#EF4444' : blocks.length === 0 ? '#D1D5DB' : '#3B82F6',
            color: 'white',
            cursor: blocks.length === 0 || isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          {isRunning ? '⏹ STOP' : '▶ RUN'}
        </button>
      </div>
    </div>
  );
}
