import React from 'react';
import { formatTime } from '../utils/notation';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  whiteTime: number;
  blackTime: number;
  currentPlayer: 'white' | 'black';
  isGameOver: boolean;
}

export const GameTimer: React.FC<GameTimerProps> = ({ 
  whiteTime, 
  blackTime, 
  currentPlayer, 
  isGameOver 
}) => {
  return (
    <div className="minimal-panel rounded-xl p-3 sm:p-4">
      <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-2 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Game Timer
      </h3>
      
      <div className="space-y-2">
        {/* White timer */}
        <div className={`
          flex items-center justify-between p-2 rounded-lg transition-all duration-300
          ${currentPlayer === 'white' && !isGameOver ? 'minimal-button ring-2 ring-blue-400/30' : 'bg-gray-600/20'}
        `}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full border border-gray-400" />
            <span className="text-white text-sm font-medium">White</span>
          </div>
          <span className={`
            text-lg font-mono font-bold transition-all duration-200
            ${whiteTime <= 60000 ? 'text-red-400 animate-heartbeat' : 'text-white'}
          `}>
            {formatTime(whiteTime)}
          </span>
        </div>

        {/* Black timer */}
        <div className={`
          flex items-center justify-between p-2 rounded-lg transition-all duration-300
          ${currentPlayer === 'black' && !isGameOver ? 'minimal-button ring-2 ring-blue-400/30' : 'bg-gray-600/20'}
        `}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-900 rounded-full border border-gray-400" />
            <span className="text-white text-sm font-medium">Black</span>
          </div>
          <span className={`
            text-lg font-mono font-bold transition-all duration-200
            ${blackTime <= 60000 ? 'text-red-400 animate-heartbeat' : 'text-white'}
          `}>
            {formatTime(blackTime)}
          </span>
        </div>
      </div>
    </div>
  );
};