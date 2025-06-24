import React from 'react';
import { Piece } from '../types';
import { getPieceImageUrl } from '../utils/pieceImages';

interface SquareProps {
  piece: Piece | null;
  position: { row: number; col: number };
  isSelected: boolean;
  isLight: boolean;
  isLegalMove: boolean;
  isInCheck?: boolean;
  isLastMoveSquare?: boolean;
  lightSquareColor: string;
  darkSquareColor: string;
  onClick: () => void;
  isGameOver?: boolean;
}

export const Square: React.FC<SquareProps> = ({
  piece,
  isSelected,
  isLight,
  isLegalMove,
  isInCheck,
  isLastMoveSquare,
  lightSquareColor,
  darkSquareColor,
  onClick,
  isGameOver = false,
}) => {
  const isCheckmateKing = piece?.type === 'king' && isInCheck && isGameOver;

  return (
    <div
      onClick={onClick}
      className={`
        w-[calc(11vw-1rem)] h-[calc(11vw-1rem)] sm:w-[calc(8vw-1rem)] sm:h-[calc(8vw-1rem)] md:w-16 md:h-16 
        flex items-center justify-center
        transition-all duration-300 cursor-pointer relative overflow-hidden
        ${isLight ? lightSquareColor : darkSquareColor}
        ${isSelected ? 'ring-4 ring-blue-400 ring-inset shadow-lg shadow-blue-500/30' : ''}
        ${isInCheck && !isGameOver ? 'ring-4 ring-red-400 ring-inset shadow-lg shadow-red-500/30 animate-wiggle' : ''}
        ${isLastMoveSquare ? 'animate-last-move-glow' : ''}
        hover:brightness-110 hover:scale-[1.02] hover:shadow-lg
        group
      `}
    >
      {/* Subtle inner glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-30" />
      
      {/* Selection highlight with animated gradient */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-blue-600/20 animate-pulse" />
      )}
      
      {/* Checkmate king special effect */}
      {isCheckmateKing && (
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/40 to-red-700/30 animate-pulse" />
      )}
      
      {/* Legal move indicators with enhanced styling and animations */}
      {isLegalMove && (
        <div className="absolute inset-0 flex items-center justify-center">
          {piece ? (
            // Capture move indicator - enhanced ring with sparkle effect
            <div className="absolute inset-1 rounded-full border-4 border-emerald-400/80 border-dashed animate-pulse shadow-lg shadow-emerald-500/40">
              <div className="absolute inset-0 rounded-full animate-sparkle bg-emerald-300/20" />
            </div>
          ) : (
            // Empty square move indicator - enhanced dot with gentle bounce
            <div className="w-5 h-5 bg-emerald-400/80 rounded-full shadow-lg shadow-emerald-500/50 animate-subtle-bounce ring-2 ring-emerald-300/50" />
          )}
        </div>
      )}
      
      {/* Chess piece image with enhanced animations */}
      {piece && (
        <img
          src={getPieceImageUrl(piece.color, piece.type)}
          alt={`${piece.color} ${piece.type}`}
          className={`
            w-[85%] h-[85%] object-contain select-none
            transition-all duration-300 ease-in-out relative z-10
            group-hover:scale-110 group-hover:brightness-110
            drop-shadow-lg animate-piece-pop-in
            ${piece.color === 'white' ? 'filter brightness-105' : 'filter brightness-95'}
            ${isCheckmateKing ? 'animate-checkmate-king' : ''}
          `}
          draggable={false}
        />
      )}
    </div>
  );
};