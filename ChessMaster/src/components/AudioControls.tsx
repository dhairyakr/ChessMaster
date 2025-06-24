import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isAudioEnabled, toggleAudio } from '../utils/audio';

interface AudioControlsProps {
  audioEnabled: boolean;
  onToggle: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  audioEnabled,
  onToggle,
}) => {
  return (
    <div className="minimal-panel rounded-xl p-3 sm:p-4">
      <h3 className="text-gray-400 text-xs sm:text-sm font-medium mb-3 flex items-center gap-2">
        {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        Sound Effects
      </h3>
      
      <button
        onClick={onToggle}
        className={`
          w-full p-2 rounded-lg transition-all duration-200 text-xs font-medium minimal-button
          ${audioEnabled
            ? 'text-green-300'
            : 'text-red-300'
          }
        `}
      >
        {audioEnabled ? 'Enabled' : 'Disabled'}
      </button>
    </div>
  );
};