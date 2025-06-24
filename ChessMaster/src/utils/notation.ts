import { Piece, Position, PieceType } from '../types';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

const getPieceSymbol = (piece: Piece): string => {
  const symbols: Record<PieceType, string> = {
    king: 'K',
    queen: 'Q',
    rook: 'R',
    bishop: 'B',
    knight: 'N',
    pawn: '',
  };
  return symbols[piece.type];
};

export const getSquareNotation = (position: Position): string => {
  return `${FILES[position.col]}${RANKS[position.row]}`;
};

export const getMoveNotation = (
  piece: Piece,
  from: Position,
  to: Position,
  captured?: Piece,
  isCheck?: boolean,
  isEnPassant?: boolean,
  isCastling?: boolean,
  promotedTo?: PieceType
): string => {
  // Castling notation
  if (isCastling) {
    const isKingside = to.col > from.col;
    const checkSymbol = isCheck ? '+' : '';
    return isKingside ? `O-O${checkSymbol}` : `O-O-O${checkSymbol}`;
  }

  const pieceSymbol = getPieceSymbol(piece);
  const toSquare = getSquareNotation(to);
  const captureSymbol = captured ? 'x' : '';
  const checkSymbol = isCheck ? '+' : '';
  const enPassantSymbol = isEnPassant ? ' e.p.' : '';
  const promotionSymbol = promotedTo ? `=${getPieceSymbol({ type: promotedTo, color: piece.color })}` : '';

  if (piece.type === 'pawn') {
    if (captured || isEnPassant) {
      return `${FILES[from.col]}${captureSymbol}${toSquare}${promotionSymbol}${enPassantSymbol}${checkSymbol}`;
    }
    return `${toSquare}${promotionSymbol}${checkSymbol}`;
  }

  return `${pieceSymbol}${captureSymbol}${toSquare}${promotionSymbol}${checkSymbol}`;
};

export const formatTime = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};