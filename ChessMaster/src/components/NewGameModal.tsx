import React, { useState } from 'react';
import { TimeSetting, PieceColor } from '../types';
import { DEFAULT_TIME_CONTROLS } from '../utils/timeControls';
import { Crown, Clock, Shuffle, User, Sparkles, Zap, Timer } from 'lucide-react';

export type PlayerColorOption = 'white' | 'black' | 'random';

interface NewGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTimeSetting: TimeSetting;
  onSelectTimeControl: (timeSetting: TimeSetting) => void;
  onStartGame: (startColor: PlayerColorOption) => void;
}

export const NewGameModal: React.FC<NewGameModalProps> = ({
  isOpen,
  onClose,
  selectedTimeSetting,
  onSelectTimeControl,
  onStartGame,
}) => {
  const [selectedColor, setSelectedColor] = useState<PlayerColorOption>('random');

  if (!isOpen) return null;

  const handleStartGame = () => {
    onStartGame(selectedColor);
    onClose();
  };

  const getTimeControlIcon = (timeSetting: TimeSetting) => {
    if (timeSetting.baseMinutes <= 3) return <Zap className="w-4 h-4 text-red-400" />;
    if (timeSetting.baseMinutes <= 10) return <Timer className="w-4 h-4 text-orange-400" />;
    return <Clock className="w-4 h-4 text-blue-400" />;
  };

  const getTimeControlCategory = (timeSetting: TimeSetting) => {
    if (timeSetting.baseMinutes <= 3) return 'Bullet';
    if (timeSetting.baseMinutes <= 10) return 'Blitz';
    return 'Rapid';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-lg">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl p-8 shadow-2xl max-w-lg w-full mx-4 animate-modal-enter">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Crown className="w-10 h-10 text-amber-400 animate-gentle-float drop-shadow-lg" />
              <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1 animate-sparkle" />
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 animate-slide-up drop-shadow-lg">
              New Game
            </h2>
          </div>
          <p className="text-gray-300 text-sm animate-slide-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
            Configure your chess experience and begin your journey
          </p>
        </div>

        {/* Time Control Selection */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 minimal-panel rounded-lg">
              <Clock className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-gray-200 text-lg font-semibold">Time Control</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
            {DEFAULT_TIME_CONTROLS.map((timeSetting, index) => (
              <button
                key={timeSetting.name}
                onClick={() => onSelectTimeControl(timeSetting)}
                style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                className={`
                  group relative p-4 rounded-xl transition-all duration-300 text-left animate-slide-up
                  hover:scale-[1.02] hover:shadow-xl transform-gpu
                  ${selectedTimeSetting.name === timeSetting.name
                    ? 'minimal-button ring-2 ring-blue-400/60 text-blue-300'
                    : 'hover:bg-white/5 text-gray-300'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTimeControlIcon(timeSetting)}
                    <div>
                      <div className="font-semibold text-white text-base">{timeSetting.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600/30 rounded-full">
                          {getTimeControlCategory(timeSetting)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-gray-300">
                      {timeSetting.baseMinutes}m + {timeSetting.incrementSeconds}s
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color Selection */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 minimal-panel rounded-lg">
              <User className="w-5 h-5 text-emerald-300" />
            </div>
            <h3 className="text-gray-200 text-lg font-semibold">Choose Your Side</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setSelectedColor('white')}
              className={`
                group relative p-4 rounded-xl transition-all duration-300 text-center
                hover:scale-[1.05] hover:shadow-xl transform-gpu animate-slide-up
                ${selectedColor === 'white'
                  ? 'minimal-button ring-2 ring-blue-400/60'
                  : 'hover:bg-white/5'
                }
              `}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-white to-gray-100 rounded-full border-2 border-gray-300 shadow-lg" />
                <div className="text-sm font-semibold text-white">White</div>
                <div className="text-xs text-gray-400">First Move</div>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedColor('black')}
              className={`
                group relative p-4 rounded-xl transition-all duration-300 text-center
                hover:scale-[1.05] hover:shadow-xl transform-gpu animate-slide-up
                ${selectedColor === 'black'
                  ? 'minimal-button ring-2 ring-blue-400/60'
                  : 'hover:bg-white/5'
                }
              `}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-800 to-black rounded-full border-2 border-gray-500 shadow-lg" />
                <div className="text-sm font-semibold text-white">Black</div>
                <div className="text-xs text-gray-400">Reactive</div>
              </div>
            </button>
            
            <button
              onClick={() => setSelectedColor('random')}
              className={`
                group relative p-4 rounded-xl transition-all duration-300 text-center
                hover:scale-[1.05] hover:shadow-xl transform-gpu animate-slide-up
                ${selectedColor === 'random'
                  ? 'minimal-button ring-2 ring-blue-400/60'
                  : 'hover:bg-white/5'
                }
              `}
              style={{ animationDelay: '0.7s' }}
            >
              <div className="flex flex-col items-center gap-2">
                <Shuffle className="w-8 h-8 text-gradient-to-r from-purple-400 to-pink-400 animate-subtle-bounce" />
                <div className="text-sm font-semibold text-white">Random</div>
                <div className="text-xs text-gray-400">Surprise</div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={onClose}
            className="flex-1 py-4 px-6 minimal-button text-gray-200 hover:text-white font-semibold rounded-xl transition-all duration-300 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleStartGame}
            className="flex-1 py-4 px-6 minimal-button text-emerald-300 hover:text-emerald-200 font-bold rounded-xl transition-all duration-300 text-sm relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 animate-sparkle" />
              Start Game
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};