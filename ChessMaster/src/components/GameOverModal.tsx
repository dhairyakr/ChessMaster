import React from 'react';
import { PieceColor } from '../types';
import { Crown, Trophy, Handshake, Clock, Flag, Sparkles, RotateCcw, Star } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: PieceColor | null;
  gameResult: 'checkmate' | 'stalemate' | 'resignation' | 'draw' | 'timeout' | null;
  isStalemate: boolean;
  onPlayAgain: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  onClose,
  winner,
  gameResult,
  isStalemate,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  const getResultInfo = () => {
    if (gameResult === 'draw' || isStalemate) {
      return {
        title: 'Draw!',
        subtitle: gameResult === 'draw' ? 'Draw accepted by both players' : 'Stalemate - No legal moves available',
        icon: <Handshake className="w-16 h-16 text-yellow-400 animate-gentle-float" />,
        titleColor: 'text-yellow-300',
        celebration: false,
      };
    }

    if (winner) {
      let subtitle = '';
      let icon = <Crown className="w-16 h-16 text-amber-400 animate-celebration-bounce" />;
      
      switch (gameResult) {
        case 'checkmate':
          subtitle = 'Victory by checkmate!';
          icon = <Trophy className="w-16 h-16 text-amber-400 animate-celebration-bounce" />;
          break;
        case 'resignation':
          subtitle = 'Victory by resignation!';
          icon = <Flag className="w-16 h-16 text-amber-400 animate-celebration-bounce" />;
          break;
        case 'timeout':
          subtitle = 'Victory by timeout!';
          icon = <Clock className="w-16 h-16 text-amber-400 animate-celebration-bounce" />;
          break;
        default:
          subtitle = 'Victory!';
      }

      return {
        title: `${winner.charAt(0).toUpperCase() + winner.slice(1)} Wins!`,
        subtitle,
        icon,
        titleColor: winner === 'white' ? 'text-blue-300' : 'text-purple-300',
        celebration: true,
      };
    }

    return {
      title: 'Game Over',
      subtitle: 'The game has ended',
      icon: <Crown className="w-16 h-16 text-gray-400" />,
      titleColor: 'text-gray-300',
      celebration: false,
    };
  };

  const resultInfo = getResultInfo();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4 animate-modal-enter">
        
        {/* Celebration sparkles for wins */}
        {resultInfo.celebration && (
          <>
            <div className="absolute top-4 left-4">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-confetti-sparkle" style={{ animationDelay: '0s' }} />
            </div>
            <div className="absolute top-8 right-6">
              <Star className="w-5 h-5 text-amber-300 animate-confetti-sparkle" style={{ animationDelay: '0.3s' }} />
            </div>
            <div className="absolute bottom-12 left-8">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-confetti-sparkle" style={{ animationDelay: '0.6s' }} />
            </div>
            <div className="absolute bottom-16 right-4">
              <Star className="w-6 h-6 text-amber-400 animate-confetti-sparkle" style={{ animationDelay: '0.9s' }} />
            </div>
          </>
        )}

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {resultInfo.icon}
          </div>

          {/* Title */}
          <h2 className={`
            text-4xl font-bold mb-3 animate-slide-up drop-shadow-lg
            ${resultInfo.titleColor}
            ${resultInfo.celebration ? 'animate-gradient-shift bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent' : ''}
          `}>
            {resultInfo.title}
          </h2>

          {/* Subtitle */}
          <p className="text-gray-300 text-lg mb-8 animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            {resultInfo.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 minimal-button text-gray-200 font-semibold rounded-xl transition-all duration-300 text-sm"
            >
              Close
            </button>
            <button
              onClick={onPlayAgain}
              className="flex-1 py-4 px-6 minimal-button text-emerald-300 hover:text-emerald-200 font-bold rounded-xl transition-all duration-300 text-sm relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Play Again
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};