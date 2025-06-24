import { Piece, Position, PieceColor, Move } from '../types';

export const initialBoard = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black', hasMoved: false };
    board[6][i] = { type: 'pawn', color: 'white', hasMoved: false };
  }

  // Set up other pieces
  const setupRow = (row: number, color: PieceColor) => {
    const pieces: Piece['type'][] = [
      'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'
    ];
    pieces.forEach((type, col) => {
      board[row][col] = { type, color, hasMoved: false };
    });
  };

  setupRow(0, 'black');
  setupRow(7, 'white');

  return board;
};

const isValidPosition = (pos: Position): boolean => {
  return pos.row >= 0 && pos.row < 8 && pos.col >= 0 && pos.col < 8;
};

export const findKing = (board: (Piece | null)[][], color: PieceColor): Position | null => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece?.type === 'king' && piece.color === color) {
        return { row, col };
      }
    }
  }
  return null;
};

export const isInCheck = (board: (Piece | null)[][], color: PieceColor): boolean => {
  const kingPosition = findKing(board, color);
  if (!kingPosition) return false;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color !== color) {
        const from: Position = { row, col };
        if (isValidMove(board, from, kingPosition, piece)) {
          return true;
        }
      }
    }
  }
  return false;
};

const isPawnMove = (
  from: Position,
  to: Position,
  piece: Piece,
  board: (Piece | null)[][],
  lastMove?: Move | null
): boolean => {
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  const targetPiece = board[to.row][to.col];

  // Moving forward
  if (from.col === to.col && !targetPiece) {
    if (to.row - from.row === direction) return true;
    if (from.row === startRow && 
        to.row - from.row === 2 * direction && 
        !board[from.row + direction][from.col]) {
      return true;
    }
  }

  // Capturing
  if (Math.abs(to.col - from.col) === 1 && to.row - from.row === direction) {
    // Regular capture
    if (targetPiece && targetPiece.color !== piece.color) {
      return true;
    }
    
    // En passant
    if (!targetPiece && lastMove) {
      const enPassantRow = piece.color === 'white' ? 3 : 4;
      if (from.row === enPassantRow &&
          lastMove.piece.type === 'pawn' &&
          lastMove.piece.color !== piece.color &&
          Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
          lastMove.to.col === to.col &&
          lastMove.to.row === from.row) {
        return true;
      }
    }
  }

  return false;
};

const canCastle = (
  board: (Piece | null)[][],
  kingPos: Position,
  rookPos: Position,
  color: PieceColor
): boolean => {
  const king = board[kingPos.row][kingPos.col];
  const rook = board[rookPos.row][rookPos.col];

  // Check if king and rook exist and haven't moved
  if (!king || !rook || king.hasMoved || rook.hasMoved) return false;
  if (king.type !== 'king' || rook.type !== 'rook') return false;
  if (king.color !== color || rook.color !== color) return false;

  // Check if king is in check
  if (isInCheck(board, color)) return false;

  // Check if path is clear and king doesn't move through check
  const direction = rookPos.col > kingPos.col ? 1 : -1;
  const steps = Math.abs(rookPos.col - kingPos.col) - 1;

  for (let i = 1; i <= steps; i++) {
    const checkCol = kingPos.col + (i * direction);
    if (board[kingPos.row][checkCol] !== null) return false;

    // Check if king would be in check when moving through this square
    if (i <= 2) { // King only moves 2 squares max
      const testBoard = board.map(row => [...row]);
      testBoard[kingPos.row][kingPos.col + (i * direction)] = king;
      testBoard[kingPos.row][kingPos.col] = null;
      if (isInCheck(testBoard, color)) return false;
    }
  }

  return true;
};

export const isValidMove = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  lastMove?: Move | null
): boolean => {
  if (!isValidPosition(from) || !isValidPosition(to)) return false;
  
  const targetPiece = board[to.row][to.col];
  if (targetPiece?.color === piece.color) return false;

  const rowDiff = Math.abs(to.row - from.row);
  const colDiff = Math.abs(to.col - from.col);

  switch (piece.type) {
    case 'pawn':
      return isPawnMove(from, to, piece, board, lastMove);

    case 'rook':
      if (from.row !== to.row && from.col !== to.col) return false;
      break;

    case 'knight':
      return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);

    case 'bishop':
      if (rowDiff !== colDiff) return false;
      break;

    case 'queen':
      if (from.row !== to.row && from.col !== to.col && rowDiff !== colDiff) return false;
      break;

    case 'king':
      // Regular king move
      if (rowDiff <= 1 && colDiff <= 1) return true;
      
      // Castling
      if (rowDiff === 0 && colDiff === 2 && !piece.hasMoved) {
        const rookCol = to.col > from.col ? 7 : 0;
        const rookPos = { row: from.row, col: rookCol };
        return canCastle(board, from, rookPos, piece.color);
      }
      return false;

    default:
      return false;
  }

  // Check path obstruction for pieces that can't jump (except knight)
  if (piece.type !== 'knight' && (rowDiff > 0 || colDiff > 0)) {
    const rowStep = rowDiff === 0 ? 0 : (to.row - from.row) / rowDiff;
    const colStep = colDiff === 0 ? 0 : (to.col - from.col) / colDiff;
    
    let currentRow = from.row + rowStep;
    let currentCol = from.col + colStep;

    while (currentRow !== to.row || currentCol !== to.col) {
      if (board[currentRow][currentCol] !== null) return false;
      currentRow += rowStep;
      currentCol += colStep;
    }
  }

  return true;
};

export const getAllLegalMoves = (
  board: (Piece | null)[][],
  fromPosition: Position,
  piece: Piece,
  currentPlayer: PieceColor,
  lastMove?: Move | null
): Position[] => {
  const legalMoves: Position[] = [];

  // Check all possible squares on the board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const toPosition: Position = { row, col };
      
      // First check if the move is valid according to piece movement rules
      if (isValidMove(board, fromPosition, toPosition, piece, lastMove)) {
        // Simulate the move to check if it would leave the king in check
        const simulatedBoard = movePiece(board, fromPosition, toPosition, lastMove);
        
        // If the move doesn't leave the current player's king in check, it's legal
        if (!isInCheck(simulatedBoard, currentPlayer)) {
          legalMoves.push(toPosition);
        }
      }
    }
  }

  return legalMoves;
};

export const movePiece = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  lastMove?: Move | null
): (Piece | null)[][] => {
  if (!isValidPosition(from) || !isValidPosition(to)) {
    return board;
  }

  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  
  if (!piece) return newBoard;

  // Handle castling
  if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
    const rookFromCol = to.col > from.col ? 7 : 0;
    const rookToCol = to.col > from.col ? to.col - 1 : to.col + 1;
    
    // Move rook
    const rook = newBoard[from.row][rookFromCol];
    if (rook) {
      newBoard[from.row][rookToCol] = { ...rook, hasMoved: true };
      newBoard[from.row][rookFromCol] = null;
    }
  }

  // Handle en passant
  if (piece.type === 'pawn' && 
      Math.abs(to.col - from.col) === 1 && 
      !newBoard[to.row][to.col] &&
      lastMove) {
    const enPassantRow = piece.color === 'white' ? 3 : 4;
    if (from.row === enPassantRow &&
        lastMove.piece.type === 'pawn' &&
        lastMove.piece.color !== piece.color &&
        Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
        lastMove.to.col === to.col &&
        lastMove.to.row === from.row) {
      // Remove the captured pawn
      newBoard[from.row][to.col] = null;
    }
  }

  // Move the piece and mark it as moved
  newBoard[to.row][to.col] = { ...piece, hasMoved: true };
  newBoard[from.row][from.col] = null;
  
  return newBoard;
};

export const getAllPossibleMoves = (
  board: (Piece | null)[][],
  color: PieceColor,
  lastMove?: Move | null
): Position[][] => {
  const allMoves: Position[][] = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === color) {
        const moves = getAllLegalMoves(board, { row, col }, piece, color, lastMove);
        if (moves.length > 0) {
          allMoves.push(moves);
        }
      }
    }
  }

  return allMoves;
};

export const isCheckmateOrStalemate = (
  board: (Piece | null)[][],
  color: PieceColor,
  lastMove?: Move | null
): { isCheckmate: boolean; isStalemate: boolean } => {
  const allMoves = getAllPossibleMoves(board, color, lastMove);
  const hasLegalMoves = allMoves.some(moves => moves.length > 0);

  if (!hasLegalMoves) {
    const inCheck = isInCheck(board, color);
    return {
      isCheckmate: inCheck,
      isStalemate: !inCheck
    };
  }

  return { isCheckmate: false, isStalemate: false };
};

export const isEnPassantMove = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece,
  lastMove?: Move | null
): boolean => {
  if (piece.type !== 'pawn') return false;
  if (!lastMove) return false;
  
  const direction = piece.color === 'white' ? -1 : 1;
  const enPassantRow = piece.color === 'white' ? 3 : 4;
  
  return (
    from.row === enPassantRow &&
    Math.abs(to.col - from.col) === 1 &&
    to.row - from.row === direction &&
    !board[to.row][to.col] &&
    lastMove.piece.type === 'pawn' &&
    lastMove.piece.color !== piece.color &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    lastMove.to.col === to.col &&
    lastMove.to.row === from.row
  );
};

export const isCastlingMove = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  piece: Piece
): boolean => {
  return (
    piece.type === 'king' &&
    Math.abs(to.col - from.col) === 2 &&
    !piece.hasMoved
  );
};

export const isPawnPromotion = (
  piece: Piece,
  to: Position
): boolean => {
  if (piece.type !== 'pawn') return false;
  const promotionRow = piece.color === 'white' ? 0 : 7;
  return to.row === promotionRow;
};