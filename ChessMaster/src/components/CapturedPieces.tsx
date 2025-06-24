import React from 'react';
import { Piece } from '../types';
import { getPieceImageUrl } from '../utils/pieceImages';

interface CapturedPiecesProps {
  pieces: Piece[];
  color: 'white' | 'black';
}

export const CapturedPieces: React.FC<CapturedPiecesProps> = ({ pieces, color }) => {
  return (
    <div className="minimal-panel rounded-xl p-4 h-48 lg:h-96">
      <h3 className="text-gray-300 text-sm font-medium mb-3">
        Captured {color} pieces
      </h3>
      <div className="flex flex-wrap gap-2 h-full overflow-y-auto custom-scrollbar">
        {pieces.map((piece, index) => (
          <div
            key={index}
            className="relative group"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <img
              src={getPieceImageUrl(piece.color, piece.type)}
              alt={`${piece.color} ${piece.type}`}
              className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain drop-shadow-sm opacity-80 animate-fadeIn group-hover:scale-110 transition-transform duration-200"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};