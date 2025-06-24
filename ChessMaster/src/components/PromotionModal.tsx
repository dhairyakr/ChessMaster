import React from 'react';
import { PieceType, PieceColor } from '../types';
import { getPieceImageUrl } from '../utils/pieceImages';

interface PromotionModalProps {
  color: PieceColor;
  onSelect: (piece: PieceType) => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({ color, onSelect }) => {
  const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-lg">
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-2xl animate-modal-enter">
        <h3 className="text-white text-xl font-semibold mb-4 text-center animate-slide-up">
          Choose promotion piece
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {pieces.map((type, index) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              style={{ animationDelay: `${index * 0.1}s` }}
              className={`
                w-16 h-16 flex items-center justify-center
                minimal-button rounded-lg transition-all duration-200 hover:scale-105
                animate-piece-pop-in group relative overflow-hidden
              `}
            >
              <img
                src={getPieceImageUrl(color, type)}
                alt={`${color} ${type}`}
                className="w-12 h-12 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
                draggable={false}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};