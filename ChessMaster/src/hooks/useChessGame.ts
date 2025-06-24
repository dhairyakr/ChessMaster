import { useState, useCallback, useEffect, useRef } from 'react';
import { GameState, PieceType, BoardTheme, TimeSetting, PieceStyle } from '../types';
import { PlayerColorOption } from '../components/NewGameModal';
import { 
  initialBoard, 
  isValidMove, 
  movePiece, 
  isInCheck, 
  getAllLegalMoves,
  isCheckmateOrStalemate,
  isEnPassantMove,
  isCastlingMove,
  isPawnPromotion
} from '../utils/chess';
import { getMoveNotation } from '../utils/notation';
import { playSound, toggleAudio, isAudioEnabled, playPieceSound } from '../utils/audio';
import { BOARD_THEMES } from '../utils/themes';
import { DEFAULT_TIME_CONTROLS } from '../utils/timeControls';

// Default piece style
const DEFAULT_PIECE_STYLE: PieceStyle = {
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
};

const createInitialGameState = (timeSetting: TimeSetting = DEFAULT_TIME_CONTROLS[3], startColor?: PlayerColorOption): GameState => {
  let currentPlayer: 'white' | 'black' = 'white';
  
  if (startColor === 'black') {
    currentPlayer = 'black';
  } else if (startColor === 'random') {
    currentPlayer = Math.random() < 0.5 ? 'white' : 'black';
  }

  return {
    board: initialBoard(),
    currentPlayer,
    gameStarted: false,
    isGameOver: false,
    winner: null,
    isStalemate: false,
    inCheck: null,
    capturedPieces: { white: [], black: [] },
    moves: [],
    lastMove: null,
    promotionPending: false,
    promotionPosition: null,
    whiteTime: timeSetting.baseMinutes * 60 * 1000,
    blackTime: timeSetting.baseMinutes * 60 * 1000,
    selectedPiece: null,
    legalMoves: [],
    timeSettings: timeSetting,
    currentHistoryIndex: 0,
    drawOfferedBy: null,
    gameResult: null,
    selectedPieceStyle: DEFAULT_PIECE_STYLE,
    boardFlipped: false,
  };
};

export const useChessGame = () => {
  const [selectedTimeSetting, setSelectedTimeSetting] = useState<TimeSetting>(DEFAULT_TIME_CONTROLS[3]);
  const [gameState, setGameState] = useState<GameState>(createInitialGameState(selectedTimeSetting));
  const [history, setHistory] = useState<GameState[]>([createInitialGameState(selectedTimeSetting)]);
  const [currentTheme, setCurrentTheme] = useState<BoardTheme>(BOARD_THEMES[0]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isNewGameModalOpen, setIsNewGameModalOpen] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect - only runs when game is started
  useEffect(() => {
    if (!gameState.gameStarted || gameState.isGameOver || gameState.promotionPending || gameState.currentHistoryIndex < history.length - 1) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setGameState(prev => {
        const timeKey = prev.currentPlayer === 'white' ? 'whiteTime' : 'blackTime';
        const newTime = prev[timeKey] - 1000;

        if (newTime <= 0) {
          const winner = prev.currentPlayer === 'white' ? 'black' : 'white';
          playSound('GAME_OVER');
          return {
            ...prev,
            [timeKey]: 0,
            isGameOver: true,
            winner,
            gameResult: 'timeout',
          };
        }

        return {
          ...prev,
          [timeKey]: newTime,
        };
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.gameStarted, gameState.currentPlayer, gameState.isGameOver, gameState.promotionPending, gameState.currentHistoryIndex, history.length]);

  const startGame = useCallback((startColor?: PlayerColorOption) => {
    if (startColor) {
      const newInitialState = createInitialGameState(selectedTimeSetting, startColor);
      setGameState({ ...newInitialState, gameStarted: true, boardFlipped: gameState.boardFlipped });
      setHistory([{ ...newInitialState, gameStarted: true, boardFlipped: gameState.boardFlipped }]);
    } else {
      setGameState(prev => ({
        ...prev,
        gameStarted: true,
      }));
    }
  }, [selectedTimeSetting, gameState.boardFlipped]);

  const handleSquareClick = useCallback(
    (row: number, col: number) => {
      if (!gameState.gameStarted || gameState.isGameOver || gameState.promotionPending || gameState.currentHistoryIndex < history.length - 1) return;

      // If there's a draw offer and it's the turn of the player who received it, prevent moves
      if (gameState.drawOfferedBy && gameState.drawOfferedBy !== gameState.currentPlayer) return;

      const clickedPiece = gameState.board[row][col];

      if (!gameState.selectedPiece && clickedPiece?.color === gameState.currentPlayer) {
        const newSelectedPiece = {
          piece: clickedPiece,
          position: { row, col },
        };
        
        const moves = getAllLegalMoves(
          gameState.board, 
          { row, col }, 
          clickedPiece, 
          gameState.currentPlayer,
          gameState.lastMove
        );
        
        setGameState(prev => ({
          ...prev,
          selectedPiece: newSelectedPiece,
          legalMoves: moves,
        }));
        return;
      }

      if (gameState.selectedPiece) {
        if (row === gameState.selectedPiece.position.row && col === gameState.selectedPiece.position.col) {
          setGameState(prev => ({
            ...prev,
            selectedPiece: null,
            legalMoves: [],
          }));
          return;
        }

        // Check if the clicked square is a legal move
        const isLegalMove = gameState.legalMoves.some(move => move.row === row && move.col === col);
        
        if (isLegalMove) {
          const selectedPiece = gameState.selectedPiece;
          const isEnPassant = isEnPassantMove(
            gameState.board,
            selectedPiece.position,
            { row, col },
            selectedPiece.piece,
            gameState.lastMove
          );
          const isCastling = isCastlingMove(
            gameState.board,
            selectedPiece.position,
            { row, col },
            selectedPiece.piece
          );
          const isPromotion = isPawnPromotion(selectedPiece.piece, { row, col });

          if (isPromotion) {
            // Handle pawn promotion - pause game and show promotion UI
            setGameState(prev => ({
              ...prev,
              promotionPending: true,
              promotionPosition: { row, col },
              selectedPiece: null,
              legalMoves: [],
            }));
            return;
          }

          // Execute the move
          const newBoard = movePiece(
            gameState.board, 
            selectedPiece.position, 
            { row, col },
            gameState.lastMove
          );
          const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
          const willBeInCheck = isInCheck(newBoard, nextPlayer);

          // Handle captured piece (including en passant)
          let capturedPiece = clickedPiece;
          if (isEnPassant) {
            capturedPiece = gameState.board[selectedPiece.position.row][col];
          }

          // Record the move
          const moveNotation = getMoveNotation(
            selectedPiece.piece,
            selectedPiece.position,
            { row, col },
            capturedPiece,
            willBeInCheck,
            isEnPassant,
            isCastling
          );

          const move = {
            piece: selectedPiece.piece,
            from: selectedPiece.position,
            to: { row, col },
            notation: moveNotation,
            captured: capturedPiece || undefined,
            isEnPassant,
            isCastling,
          };

          // Play sound effects with piece-specific sounds
          if (isCastling) {
            playSound('CASTLE');
          } else {
            playPieceSound(selectedPiece.piece.type, !!capturedPiece);
          }

          // Check for checkmate or stalemate
          const { isCheckmate, isStalemate } = isCheckmateOrStalemate(newBoard, nextPlayer, move);

          if (willBeInCheck) {
            playSound('CHECK');
          }

          if (isCheckmate || isStalemate) {
            playSound('GAME_OVER');
          }

          // Add time increment
          const currentPlayerTimeKey = gameState.currentPlayer === 'white' ? 'whiteTime' : 'blackTime';
          const incrementedTime = gameState[currentPlayerTimeKey] + (gameState.timeSettings.incrementSeconds * 1000);

          const newGameState: GameState = {
            ...gameState,
            board: newBoard,
            currentPlayer: nextPlayer,
            moves: [...gameState.moves, move],
            lastMove: move,
            capturedPieces: capturedPiece ? {
              ...gameState.capturedPieces,
              [gameState.currentPlayer]: [...gameState.capturedPieces[gameState.currentPlayer], capturedPiece]
            } : gameState.capturedPieces,
            inCheck: willBeInCheck ? nextPlayer : null,
            isGameOver: isCheckmate || isStalemate,
            winner: isCheckmate ? gameState.currentPlayer : null,
            isStalemate,
            selectedPiece: null,
            legalMoves: [],
            [currentPlayerTimeKey]: incrementedTime,
            drawOfferedBy: null, // Clear any pending draw offer
            gameResult: isCheckmate ? 'checkmate' : isStalemate ? 'stalemate' : null,
          };

          setGameState(newGameState);
          
          // Truncate history if we're not at the latest state
          const newHistory = gameState.currentHistoryIndex < history.length - 1 
            ? [...history.slice(0, gameState.currentHistoryIndex + 1), newGameState]
            : [...history, newGameState];
          
          setHistory(newHistory);
          setGameState(prev => ({ ...prev, currentHistoryIndex: newHistory.length - 1 }));
        } else {
          // If clicked on another piece of the same color, select it
          if (clickedPiece?.color === gameState.currentPlayer) {
            const newSelectedPiece = {
              piece: clickedPiece,
              position: { row, col },
            };
            
            const moves = getAllLegalMoves(
              gameState.board, 
              { row, col }, 
              clickedPiece, 
              gameState.currentPlayer,
              gameState.lastMove
            );
            
            setGameState(prev => ({
              ...prev,
              selectedPiece: newSelectedPiece,
              legalMoves: moves,
            }));
          } else {
            setGameState(prev => ({
              ...prev,
              selectedPiece: null,
              legalMoves: [],
            }));
          }
        }
      }
    },
    [gameState, history]
  );

  const handlePromotion = useCallback((promotedTo: PieceType) => {
    if (!gameState.promotionPending || !gameState.promotionPosition || !gameState.selectedPiece) return;

    const selectedPiece = gameState.selectedPiece;
    const to = gameState.promotionPosition;
    
    // Execute the promotion move
    let newBoard = movePiece(
      gameState.board, 
      selectedPiece.position, 
      to,
      gameState.lastMove
    );
    
    // Promote the pawn
    newBoard[to.row][to.col] = {
      type: promotedTo,
      color: selectedPiece.piece.color,
      hasMoved: true
    };

    const nextPlayer = gameState.currentPlayer === 'white' ? 'black' : 'white';
    const willBeInCheck = isInCheck(newBoard, nextPlayer);
    const capturedPiece = gameState.board[to.row][to.col];

    // Record the move
    const moveNotation = getMoveNotation(
      selectedPiece.piece,
      selectedPiece.position,
      to,
      capturedPiece,
      willBeInCheck,
      false,
      false,
      promotedTo
    );

    const move = {
      piece: selectedPiece.piece,
      from: selectedPiece.position,
      to,
      notation: moveNotation,
      captured: capturedPiece || undefined,
      promotedTo,
    };

    // Play sound effects with piece-specific sounds
    playPieceSound(promotedTo, !!capturedPiece);

    // Check for checkmate or stalemate
    const { isCheckmate, isStalemate } = isCheckmateOrStalemate(newBoard, nextPlayer, move);

    if (willBeInCheck) {
      playSound('CHECK');
    }

    if (isCheckmate || isStalemate) {
      playSound('GAME_OVER');
    }

    // Add time increment
    const currentPlayerTimeKey = gameState.currentPlayer === 'white' ? 'whiteTime' : 'blackTime';
    const incrementedTime = gameState[currentPlayerTimeKey] + (gameState.timeSettings.incrementSeconds * 1000);

    const newGameState: GameState = {
      ...gameState,
      board: newBoard,
      currentPlayer: nextPlayer,
      moves: [...gameState.moves, move],
      lastMove: move,
      capturedPieces: capturedPiece ? {
        ...gameState.capturedPieces,
        [gameState.currentPlayer]: [...gameState.capturedPieces[gameState.currentPlayer], capturedPiece]
      } : gameState.capturedPieces,
      inCheck: willBeInCheck ? nextPlayer : null,
      isGameOver: isCheckmate || isStalemate,
      winner: isCheckmate ? gameState.currentPlayer : null,
      isStalemate,
      promotionPending: false,
      promotionPosition: null,
      selectedPiece: null,
      legalMoves: [],
      [currentPlayerTimeKey]: incrementedTime,
      gameResult: isCheckmate ? 'checkmate' : isStalemate ? 'stalemate' : null,
    };

    setGameState(newGameState);
    
    const newHistory = gameState.currentHistoryIndex < history.length - 1 
      ? [...history.slice(0, gameState.currentHistoryIndex + 1), newGameState]
      : [...history, newGameState];
    
    setHistory(newHistory);
    setGameState(prev => ({ ...prev, currentHistoryIndex: newHistory.length - 1 }));
  }, [gameState, history]);

  const undoMove = useCallback(() => {
    if (gameState.currentHistoryIndex <= 0) return;
    
    const newIndex = gameState.currentHistoryIndex - 1;
    const previousState = history[newIndex];
    
    setGameState({ ...previousState, currentHistoryIndex: newIndex });
  }, [gameState.currentHistoryIndex, history]);

  const redoMove = useCallback(() => {
    if (gameState.currentHistoryIndex >= history.length - 1) return;
    
    const newIndex = gameState.currentHistoryIndex + 1;
    const nextState = history[newIndex];
    
    setGameState({ ...nextState, currentHistoryIndex: newIndex });
  }, [gameState.currentHistoryIndex, history]);

  const goToMove = useCallback((index: number) => {
    if (index < 0 || index >= history.length) return;
    
    const targetState = history[index];
    setGameState({ ...targetState, currentHistoryIndex: index });
  }, [history]);

  const selectTimeControl = useCallback((timeSetting: TimeSetting) => {
    setSelectedTimeSetting(timeSetting);
    const newInitialState = createInitialGameState(timeSetting);
    setGameState({ ...newInitialState, boardFlipped: gameState.boardFlipped });
    setHistory([{ ...newInitialState, boardFlipped: gameState.boardFlipped }]);
  }, [gameState.boardFlipped]);

  const resetGame = useCallback(() => {
    // Reset game state and open new game modal
    const newInitialState = createInitialGameState(selectedTimeSetting);
    setGameState({ ...newInitialState, boardFlipped: gameState.boardFlipped });
    setHistory([{ ...newInitialState, boardFlipped: gameState.boardFlipped }]);
    setIsNewGameModalOpen(true);
  }, [selectedTimeSetting, gameState.boardFlipped]);

  const closeGameOverModal = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameOver: false,
      winner: null,
      gameResult: null,
      isStalemate: false,
    }));
  }, []);

  const resignGame = useCallback(() => {
    if (!gameState.gameStarted || gameState.isGameOver) return;
    
    const winner = gameState.currentPlayer === 'white' ? 'black' : 'white';
    playSound('GAME_OVER');
    
    const newGameState: GameState = {
      ...gameState,
      isGameOver: true,
      winner,
      gameResult: 'resignation',
    };
    
    setGameState(newGameState);
    setHistory(prev => [...prev, newGameState]);
  }, [gameState]);

  const offerDraw = useCallback(() => {
    if (!gameState.gameStarted || gameState.isGameOver || gameState.drawOfferedBy) return;
    
    const newGameState: GameState = {
      ...gameState,
      drawOfferedBy: gameState.currentPlayer,
    };
    
    setGameState(newGameState);
  }, [gameState]);

  const acceptDraw = useCallback(() => {
    if (!gameState.gameStarted || !gameState.drawOfferedBy || gameState.isGameOver) return;
    
    playSound('GAME_OVER');
    
    const newGameState: GameState = {
      ...gameState,
      isGameOver: true,
      isStalemate: true,
      winner: null,
      drawOfferedBy: null,
      gameResult: 'draw',
    };
    
    setGameState(newGameState);
    setHistory(prev => [...prev, newGameState]);
  }, [gameState]);

  const declineDraw = useCallback(() => {
    if (!gameState.gameStarted || !gameState.drawOfferedBy) return;
    
    const newGameState: GameState = {
      ...gameState,
      drawOfferedBy: null,
    };
    
    setGameState(newGameState);
  }, [gameState]);

  const toggleBoardOrientation = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      boardFlipped: !prev.boardFlipped,
    }));
  }, []);

  const isLegalMove = useCallback((row: number, col: number): boolean => {
    return gameState.legalMoves.some(move => move.row === row && move.col === col);
  }, [gameState.legalMoves]);

  const isLastMoveSquare = useCallback((row: number, col: number): boolean => {
    if (!gameState.lastMove) return false;
    return (
      (gameState.lastMove.from.row === row && gameState.lastMove.from.col === col) ||
      (gameState.lastMove.to.row === row && gameState.lastMove.to.col === col)
    );
  }, [gameState.lastMove]);

  const handleThemeChange = useCallback((theme: BoardTheme) => {
    setCurrentTheme(theme);
  }, []);

  const handleAudioToggle = useCallback(() => {
    const newState = toggleAudio();
    setAudioEnabled(newState);
  }, []);

  return {
    ...gameState,
    currentTheme,
    audioEnabled,
    selectedTimeSetting,
    isNewGameModalOpen,
    setIsNewGameModalOpen,
    startGame,
    handleSquareClick,
    handlePromotion,
    undoMove,
    redoMove,
    goToMove,
    resetGame,
    closeGameOverModal,
    selectTimeControl,
    resignGame,
    offerDraw,
    acceptDraw,
    declineDraw,
    isLegalMove,
    isLastMoveSquare,
    handleThemeChange,
    toggleBoardOrientation,
    handleAudioToggle,
    canUndo: gameState.currentHistoryIndex > 0,
    canRedo: gameState.currentHistoryIndex < history.length - 1,
    isViewingHistory: gameState.currentHistoryIndex < history.length - 1,
  };
};