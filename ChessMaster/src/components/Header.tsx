import React from 'react';
import { Crown, Volume2, VolumeX, Play, Clock, User, Sparkles } from 'lucide-react';
import { formatTime } from '../utils/notation';
import { PieceColor } from '../types';

interface HeaderProps {
  whiteTime: number;
  blackTime: number;
  currentPlayer: PieceColor;
  isGameOver: boolean;
  gameStarted: boolean;
  audioEnabled: boolean;
  inCheck: PieceColor | null;
  drawOfferedBy: PieceColor | null;
  onAudioToggle: () => void;
  onNewGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  whiteTime,
  blackTime,
  currentPlayer,
  isGameOver,
  gameStarted,
  audioEnabled,
  inCheck,
  drawOfferedBy,
  onAudioToggle,
  onNewGame,
}) => {
  const getGameStatus = () => {
    if (!gameStarted) {
      return {
        text: "Ready to Play",
        color: "text-blue-400",
        icon: <Crown className="w-5 h-5 animate-gentle-float" />
      };
    }

    if (drawOfferedBy && !isGameOver) {
      return {
        text: `${drawOfferedBy} offers a draw`,
        color: "text-yellow-400",
        icon: <User className="w-5 h-5 animate-subtle-bounce" />
      };
    }

    if (isGameOver) {
      return {
        text: "Game Over",
        color: "text-red-400",
        icon: <Crown className="w-5 h-5" />
      };
    }
    
    if (inCheck) {
      return {
        text: `${inCheck} is in check!`,
        color: "text-red-400",
        icon: <Crown className="w-5 h-5 animate-wiggle" />
      };
    }
    
    return {
      text: `${currentPlayer}'s turn`,
      color: "text-gray-300",
      icon: <div className={`w-4 h-4 rounded-full animate-subtle-bounce ${currentPlayer === 'white' ? 'bg-white' : 'bg-gray-900 border border-gray-400'}`} />
    };
  };

  const status = getGameStatus();

  return (
    <header className="w-full bg-gray-900 border-b border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <Crown className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 drop-shadow-lg animate-gentle-float" />
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300 absolute -top-1 -right-1 animate-sparkle" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 drop-shadow-lg animate-gradient-shift">
                Chess Master
              </h1>
              <p className="text-gray-300/80 text-xs sm:text-sm font-medium hidden sm:block">Professional Chess Experience</p>
            </div>
          </div>

          {/* Center: Game Status and Timers */}
          <div className="flex items-center gap-2 sm:gap-8">
            {/* Game Status */}
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 minimal-panel rounded-full">
              {status.icon}
              <span className={`font-medium text-xs sm:text-sm ${status.color}`}>
                <span className="hidden sm:inline">{status.text}</span>
                <span className="sm:hidden">{status.text.split(' ')[0]}</span>
              </span>
            </div>

            {/* Timers */}
            {gameStarted && (
              <div className="flex items-center gap-2 sm:gap-6">
                {/* White Timer */}
                <div className={`
                  flex items-center gap-2 sm:gap-3 px-2 py-1 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 minimal-panel
                  ${currentPlayer === 'white' && !isGameOver 
                    ? 'ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20 animate-pulse-glow' 
                    : ''
                  }
                `}>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full border border-gray-300 shadow-sm" />
                    <span className="text-white text-xs sm:text-sm font-medium hidden sm:inline">White</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                    <span className={`
                      text-base sm:text-lg font-mono font-bold transition-all duration-200
                      ${whiteTime <= 60000 ? 'text-red-400 animate-heartbeat' : 'text-white'}
                    `}>
                      {formatTime(whiteTime)}
                    </span>
                  </div>
                </div>

                {/* Black Timer */}
                <div className={`
                  flex items-center gap-2 sm:gap-3 px-2 py-1 sm:px-4 sm:py-3 rounded-xl transition-all duration-300 minimal-panel
                  ${currentPlayer === 'black' && !isGameOver 
                    ? 'ring-2 ring-blue-400/50 shadow-lg shadow-blue-500/20 animate-pulse-glow' 
                    : ''
                  }
                `}>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-900 rounded-full border border-gray-400 shadow-sm" />
                    <span className="text-white text-xs sm:text-sm font-medium hidden sm:inline">Black</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                    <span className={`
                      text-base sm:text-lg font-mono font-bold transition-all duration-200
                      ${blackTime <= 60000 ? 'text-red-400 animate-heartbeat' : 'text-white'}
                    `}>
                      {formatTime(blackTime)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Audio Toggle */}
            <button
              onClick={onAudioToggle}
              className={`
                p-2 sm:p-3 rounded-xl transition-all duration-200 minimal-button
                ${audioEnabled
                  ? 'text-green-300 hover:text-green-200'
                  : 'text-red-300 hover:text-red-200'
                }
              `}
              title={audioEnabled ? 'Disable Sound' : 'Enable Sound'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* New Game Button */}
            <button
              onClick={onNewGame}
              className="flex items-center gap-1 sm:gap-2 minimal-button text-white font-semibold py-2 sm:py-3 px-3 sm:px-6 rounded-xl relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Play className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="hidden sm:inline relative z-10">New Game</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};