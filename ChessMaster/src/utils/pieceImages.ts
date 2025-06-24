import { PieceType, PieceColor, PieceStyle } from '../types';

// Default piece style - Classic Wikimedia
const PIECE_STYLES: PieceStyle[] = [
  {
    name: 'Classic Wikimedia',
    baseUrl: 'https://upload.wikimedia.org/wikipedia/commons',
    previewImage: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    pieceMap: {
      'white-king': '/4/42/Chess_klt45.svg',
      'white-queen': '/1/15/Chess_qlt45.svg',
      'white-rook': '/7/72/Chess_rlt45.svg',
      'white-bishop': '/b/b1/Chess_blt45.svg',
      'white-knight': '/7/70/Chess_nlt45.svg',
      'white-pawn': '/4/45/Chess_plt45.svg',
      'black-king': '/f/f0/Chess_kdt45.svg',
      'black-queen': '/4/47/Chess_qdt45.svg',
      'black-rook': '/f/ff/Chess_rdt45.svg',
      'black-bishop': '/9/98/Chess_bdt45.svg',
      'black-knight': '/e/ef/Chess_ndt45.svg',
      'black-pawn': '/c/c7/Chess_pdt45.svg',
    },
  },
];

export const getPieceImageUrl = (color: PieceColor, type: PieceType): string => {
  const style = PIECE_STYLES[0]; // Always use the default style
  const key = `${color}-${type}`;
  const imagePath = style.pieceMap[key];
  
  if (!imagePath) return '';
  
  return `${style.baseUrl}${imagePath}`;
};

export const preloadPieceImages = (): Promise<void[]> => {
  const allImagePromises: Promise<void>[] = [];
  
  // Preload images for the default style only
  const style = PIECE_STYLES[0];
  Object.values(style.pieceMap).forEach(imagePath => {
    const fullUrl = `${style.baseUrl}${imagePath}`;
    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${fullUrl}`));
      img.src = fullUrl;
    });
    allImagePromises.push(promise);
  });
  
  return Promise.all(allImagePromises);
};