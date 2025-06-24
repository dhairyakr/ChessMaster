import { BoardTheme } from '../types';

export const BOARD_THEMES: BoardTheme[] = [
  {
    name: 'Professional Slate',
    lightSquare: 'bg-gradient-to-br from-slate-100 to-gray-100 shadow-inner border border-slate-200/50',
    darkSquare: 'bg-gradient-to-br from-slate-600 to-slate-700 shadow-inner border border-slate-500/60',
    accent: 'slate',
    background: 'bg-gradient-to-br from-gray-900 to-black',
  },
  {
    name: 'Ocean Depths',
    lightSquare: 'bg-gradient-to-br from-cyan-50 to-blue-100 shadow-inner border border-cyan-200/40',
    darkSquare: 'bg-gradient-to-br from-blue-800 to-indigo-900 shadow-inner border border-blue-700/60',
    accent: 'blue',
    background: 'bg-gradient-to-br from-blue-900 via-indigo-950 to-blue-900',
  },
  {
    name: 'Emerald Forest',
    lightSquare: 'bg-gradient-to-br from-emerald-50 to-green-100 shadow-inner border border-emerald-200/40',
    darkSquare: 'bg-gradient-to-br from-green-800 to-emerald-900 shadow-inner border border-green-700/60',
    accent: 'green',
    background: 'bg-gradient-to-br from-emerald-900 via-green-950 to-emerald-900',
  },
  {
    name: 'Royal Purple',
    lightSquare: 'bg-gradient-to-br from-purple-50 to-violet-100 shadow-inner border border-purple-200/40',
    darkSquare: 'bg-gradient-to-br from-purple-800 to-indigo-900 shadow-inner border border-purple-700/60',
    accent: 'purple',
    background: 'bg-gradient-to-br from-purple-900 via-violet-950 to-purple-900',
  },
  {
    name: 'Sunset Glow',
    lightSquare: 'bg-gradient-to-br from-orange-50 to-amber-100 shadow-inner border border-orange-200/40',
    darkSquare: 'bg-gradient-to-br from-orange-800 to-red-900 shadow-inner border border-orange-700/60',
    accent: 'orange',
    background: 'bg-gradient-to-br from-orange-900 via-red-950 to-orange-900',
  },
  {
    name: 'Midnight Steel',
    lightSquare: 'bg-gradient-to-br from-slate-100 to-gray-200 shadow-inner border border-slate-300/50',
    darkSquare: 'bg-gradient-to-br from-slate-700 to-gray-900 shadow-inner border border-slate-600/70',
    accent: 'gray',
    background: 'bg-gradient-to-br from-slate-900 via-gray-950 to-slate-900',
  },
  {
    name: 'Rose Gold',
    lightSquare: 'bg-gradient-to-br from-rose-50 to-pink-100 shadow-inner border border-rose-200/40',
    darkSquare: 'bg-gradient-to-br from-rose-800 to-pink-900 shadow-inner border border-rose-700/60',
    accent: 'rose',
    background: 'bg-gradient-to-br from-rose-900 via-pink-950 to-rose-900',
  },
  {
    name: 'Arctic Ice',
    lightSquare: 'bg-gradient-to-br from-sky-50 to-blue-100 shadow-inner border border-sky-200/40',
    darkSquare: 'bg-gradient-to-br from-slate-600 to-slate-800 shadow-inner border border-slate-500/60',
    accent: 'sky',
    background: 'bg-gradient-to-br from-sky-900 via-slate-950 to-sky-900',
  },
  {
    name: 'Cosmic Nebula',
    lightSquare: 'bg-gradient-to-br from-violet-50 to-purple-100 shadow-inner border border-violet-200/40',
    darkSquare: 'bg-gradient-to-br from-violet-800 to-purple-900 shadow-inner border border-violet-700/60',
    accent: 'violet',
    background: 'bg-gradient-to-br from-violet-900 via-purple-950 to-indigo-950',
  },
  {
    name: 'Crimson Fire',
    lightSquare: 'bg-gradient-to-br from-red-50 to-rose-100 shadow-inner border border-red-200/40',
    darkSquare: 'bg-gradient-to-br from-red-800 to-rose-900 shadow-inner border border-red-700/60',
    accent: 'red',
    background: 'bg-gradient-to-br from-red-900 via-rose-950 to-red-900',
  },
  {
    name: 'Mystic Teal',
    lightSquare: 'bg-gradient-to-br from-teal-50 to-cyan-100 shadow-inner border border-teal-200/40',
    darkSquare: 'bg-gradient-to-br from-teal-800 to-cyan-900 shadow-inner border border-teal-700/60',
    accent: 'teal',
    background: 'bg-gradient-to-br from-teal-900 via-cyan-950 to-teal-900',
  },
];

export const getThemeByName = (name: string): BoardTheme => {
  return BOARD_THEMES.find(theme => theme.name === name) || BOARD_THEMES[0];
};