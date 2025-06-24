import React from 'react';
import { Flag, HandHeart, Check, X } from 'lucide-react';
import { PieceColor } from '../types';

interface GameControlsProps {
  gameStarted: boolean;
  currentPlayer: PieceColor;
  drawOfferedBy: PieceColor | null;
  isGameOver: boolean;
  onStartGame: () => void; // Keep for compatibility but won't be used
  onResign: () => void;
  onOfferDraw: () => void;
  onAcceptDraw: () => void;
  onDeclineDraw: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameStarted,
  currentPlayer,
  drawOfferedBy,
  isGameOver,
  onResign,
  onOfferDraw,
  onAcceptDraw,
  onDeclineDraw,
}) => {
  const canOfferDraw = gameStarted && !isGameOver && !drawOfferedBy;
  const canResign = gameStarted && !isGameOver;
  const shouldShowDrawResponse = drawOfferedBy && drawOfferedBy !== currentPlayer && !isGameOver;

  return (
    <div className="minimal-panel rounded-xl p-4">
      <h3 className="text-gray-300 text-sm font-medium mb-3">
        Game Controls
      </h3>
      
      <div className="space-y-3">
        {shouldShowDrawResponse ? (
          <>
            <div className="text-xs text-yellow-400 mb-3 p-3 minimal-panel rounded-lg">
              {drawOfferedBy} offers a draw
            </div>
            <div className="flex gap-2">
              <button
                onClick={onAcceptDraw}
                className="flex-1 flex items-center justify-center gap-2 minimal-button text-green-300 hover:text-green-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                <Check className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={onDeclineDraw}
                className="flex-1 flex items-center justify-center gap-2 minimal-button text-red-300 hover:text-red-200 font-medium py-3 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                <X className="w-4 h-4" />
                Decline
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={onOfferDraw}
              disabled={!canOfferDraw}
              className={`
                w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg 
                transition-all duration-200 text-sm
                ${canOfferDraw
                  ? 'minimal-button text-blue-300 hover:text-blue-200'
                  : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <HandHeart className="w-4 h-4" />
              Offer Draw
            </button>
            
            <button
              onClick={onResign}
              disabled={!canResign}
              className={`
                w-full flex items-center justify-center gap-2 font-medium py-3 px-4 rounded-lg 
                transition-all duration-200 text-sm
                ${canResign
                  ? 'minimal-button text-red-300 hover:text-red-200'
                  : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              <Flag className="w-4 h-4" />
              Resign
            </button>
          </>
        )}
      </div>
    </div>
  );
};