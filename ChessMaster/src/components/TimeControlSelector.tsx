import React from 'react';
import { TimeSetting } from '../types';
import { DEFAULT_TIME_CONTROLS } from '../utils/timeControls';
import { Clock } from 'lucide-react';

interface TimeControlSelectorProps {
  selectedTimeSetting: TimeSetting;
  onSelectTimeControl: (timeSetting: TimeSetting) => void;
  disabled?: boolean;
}

export const TimeControlSelector: React.FC<TimeControlSelectorProps> = ({
  selectedTimeSetting,
  onSelectTimeControl,
  disabled = false,
}) => {
  return (
    <div className="bg-gray-700/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm border border-gray-600/30">
      <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Time Control
      </h3>
      
      <div className="space-y-2">
        {DEFAULT_TIME_CONTROLS.map((timeSetting) => (
          <button
            key={timeSetting.name}
            onClick={() => onSelectTimeControl(timeSetting)}
            disabled={disabled}
            className={`
              w-full p-2 rounded-lg transition-all duration-200 text-xs font-medium text-left
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              ${selectedTimeSetting.name === timeSetting.name
                ? 'bg-blue-500/30 border border-blue-500/50 text-blue-300'
                : 'bg-gray-600/30 border border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
              }
            `}
          >
            <div className="font-medium">{timeSetting.name}</div>
            <div className="text-xs text-gray-400">
              {timeSetting.baseMinutes}min + {timeSetting.incrementSeconds}s
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};