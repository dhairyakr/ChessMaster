import React from 'react';
import { Move } from '../types';
import { ScrollText, ChevronRight, SkipBack, SkipForward } from 'lucide-react';

interface MoveHistoryProps {
  moves: Move[];
  goToMove: (index: number) => void;
  currentHistoryIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undoMove: () => void;
  redoMove: () => void;
  isViewingHistory: boolean;
  className?: string;
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ 
  moves, 
  goToMove, 
  currentHistoryIndex,
  canUndo,
  canRedo,
  undoMove,
  redoMove,
  isViewingHistory,
  className = ''
}) => {
  return (
    <div className={`minimal-panel rounded-xl p-4 ${className}`}>
      <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
        <ScrollText className="w-4 h-4" />
        Move History
        {isViewingHistory && (
          <span className="text-yellow-400 text-xs px-2 py-1 bg-yellow-400/20 rounded-full">
            Viewing
          </span>
        )}
      </h3>
      
      {/* Navigation controls */}
      <div className="flex gap-1 mb-3">
        <button
          onClick={() => goToMove(0)}
          disabled={!canUndo}
          className={`
            flex items-center justify-center p-2 rounded-lg text-xs transition-all duration-200
            ${canUndo 
              ? 'minimal-button text-gray-300 hover:text-white' 
              : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
            }
          `}
          title="Go to start"
        >
          <SkipBack className="w-3 h-3" />
        </button>
        
        <button
          onClick={undoMove}
          disabled={!canUndo}
          className={`
            flex items-center justify-center p-2 rounded-lg text-xs transition-all duration-200
            ${canUndo 
              ? 'minimal-button text-gray-300 hover:text-white' 
              : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
            }
          `}
          title="Previous move"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
        </button>
        
        <button
          onClick={redoMove}
          disabled={!canRedo}
          className={`
            flex items-center justify-center p-2 rounded-lg text-xs transition-all duration-200
            ${canRedo 
              ? 'minimal-button text-gray-300 hover:text-white' 
              : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
            }
          `}
          title="Next move"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
        
        <button
          onClick={() => goToMove(moves.length)}
          disabled={!canRedo}
          className={`
            flex items-center justify-center p-2 rounded-lg text-xs transition-all duration-200
            ${canRedo 
              ? 'minimal-button text-gray-300 hover:text-white' 
              : 'bg-gray-700/30 text-gray-500 cursor-not-allowed'
            }
          `}
          title="Go to end"
        >
          <SkipForward className="w-3 h-3" />
        </button>
      </div>

      <div className="max-h-48 lg:max-h-[200px] overflow-y-auto custom-scrollbar">
        {moves.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No moves yet</p>
        ) : (
          <div className="space-y-1">
            {/* Starting position */}
            <div
              className={`
                grid grid-cols-[auto_1fr] gap-2 text-sm items-center p-2 rounded-lg cursor-pointer transition-all duration-200
                ${currentHistoryIndex === 0 ? 'bg-blue-800/30 border border-blue-700/50 text-blue-300' : 'hover:bg-white/5'}
              `}
              onClick={() => goToMove(0)}
            >
              <span className="text-gray-500 w-6">—</span>
              <span className="text-gray-400 italic">Start</span>
            </div>
            
            {Array.from({ length: Math.ceil(moves.length / 2) }).map((_, i) => (
              <div key={i} className="grid grid-cols-[auto_1fr_1fr] gap-2 text-sm items-center">
                <span className="text-gray-500 w-6">{i + 1}.</span>
                
                {/* White move */}
                <div
                  className={`
                    p-2 rounded-lg cursor-pointer transition-all duration-200
                    ${currentHistoryIndex === i * 2 + 1 ? 'bg-blue-800/30 border border-blue-700/50 text-blue-300' : 'hover:bg-white/5'}
                  `}
                  onClick={() => goToMove(i * 2 + 1)}
                >
                  <span className="text-white">{moves[i * 2]?.notation}</span>
                </div>
                
                {/* Black move */}
                {moves[i * 2 + 1] ? (
                  <div
                    className={`
                      p-2 rounded-lg cursor-pointer transition-all duration-200
                      ${currentHistoryIndex === i * 2 + 2 ? 'bg-blue-800/30 border border-blue-700/50 text-blue-300' : 'hover:bg-white/5'}
                    `}
                    onClick={() => goToMove(i * 2 + 2)}
                  >
                    <span className="text-gray-300">{moves[i * 2 + 1]?.notation}</span>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};