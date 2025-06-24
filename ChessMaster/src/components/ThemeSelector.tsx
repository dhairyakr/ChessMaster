import React from 'react';
import { BoardTheme } from '../types';
import { BOARD_THEMES } from '../utils/themes';
import { Palette } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: BoardTheme;
  onThemeChange: (theme: BoardTheme) => void;
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  className = ''
}) => {
  return (
    <div className={`minimal-panel rounded-xl p-4 ${className}`}>
      <h3 className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Board Theme
      </h3>
      
      <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-2">
        {BOARD_THEMES.map((theme, index) => (
          <button
            key={theme.name}
            onClick={() => onThemeChange(theme)}
            style={{ animationDelay: `${index * 0.05}s` }}
            className={`
              p-3 rounded-lg transition-all duration-200 text-xs font-medium animate-slide-up group
              ${currentTheme.name === theme.name
                ? 'minimal-button text-blue-300 ring-2 ring-blue-400/30'
                : 'hover:bg-white/5 text-gray-300 hover:text-white'
              }
            `}
          >
            <div className="flex items-center gap-3 mb-2">
              {/* Mini chessboard preview */}
              <div className="w-8 h-8 grid grid-cols-2 grid-rows-2 rounded-sm overflow-hidden border border-white/20 shadow-sm">
                <div className={`${theme.lightSquare}`} />
                <div className={`${theme.darkSquare}`} />
                <div className={`${theme.darkSquare}`} />
                <div className={`${theme.lightSquare}`} />
              </div>
              <span className="font-medium">{theme.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};