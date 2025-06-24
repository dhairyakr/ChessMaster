export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
export type PieceColor = 'white' | 'black';

export interface Piece {
  type: PieceType;
  color: PieceColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  notation: string;
  captured?: Piece;
  isEnPassant?: boolean;
  isCastling?: boolean;
  promotedTo?: PieceType;
}

export interface TimeSetting {
  name: string;
  baseMinutes: number;
  incrementSeconds: number;
}

export interface BoardTheme {
  name: string;
  lightSquare: string;
  darkSquare: string;
  accent: string;
  background: string;
}

export interface PieceStyle {
  name: string;
  baseUrl: string;
  previewImage: string;
  pieceMap: Record<string, string>;
}

export interface GameState {
  board: (Piece | null)[][];
  currentPlayer: PieceColor;
  gameStarted: boolean;
  isGameOver: boolean;
  winner: PieceColor | null;
  isStalemate: boolean;
  inCheck: PieceColor | null;
  capturedPieces: {
    white: Piece[];
    black: Piece[];
  };
  moves: Move[];
  lastMove: Move | null;
  promotionPending: boolean;
  promotionPosition: Position | null;
  whiteTime: number;
  blackTime: number;
  selectedPiece: {
    piece: Piece;
    position: Position;
  } | null;
  legalMoves: Position[];
  timeSettings: TimeSetting;
  currentHistoryIndex: number;
  drawOfferedBy: PieceColor | null;
  gameResult: 'checkmate' | 'stalemate' | 'resignation' | 'draw' | 'timeout' | null;
  selectedPieceStyle: PieceStyle;
  boardFlipped: boolean;
}