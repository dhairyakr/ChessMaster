import React from 'react';
import { Square } from './Square';
import { CapturedPieces } from './CapturedPieces';
import { MoveHistory } from './MoveHistory';
import { PromotionModal } from './PromotionModal';
import { NewGameModal } from './NewGameModal';
import { GameOverModal } from './GameOverModal';
import { ThemeSelector } from './ThemeSelector';
import { GameControls } from './GameControls';
import { useChessGame } from '../hooks/useChessGame';
import { Undo2, Redo2, FlipHorizontal } from 'lucide-react';

interface ChessBoardProps {
  board: any;
  selectedPiece: any;
  currentPlayer: any;
  gameStarted: boolean;
  isGameOver: boolean;
  winner: any;
  isStalemate: boolean;
  inCheck: any;
  capturedPieces: any;
  moves: any;
  promotionPending: boolean;
  whiteTime: number;
  blackTime: number;
  currentTheme: any;
  audioEnabled: boolean;
  selectedTimeSetting: any;
  drawOfferedBy: any;
  gameResult: any;
  currentHistoryIndex: number;
  boardFlipped: boolean;
  isNewGameModalOpen: boolean;
  setIsNewGameModalOpen: (open: boolean) => void;
  startGame: (startColor?: any) => void;
  handleSquareClick: (row: number, col: number) => void;
  handlePromotion: (piece: any) => void;
  undoMove: () => void;
  redoMove: () => void;
  goToMove: (index: number) => void;
  resetGame: () => void;
  closeGameOverModal: () => void;
  selectTimeControl: (timeSetting: any) => void;
  resignGame: () => void;
  offerDraw: () => void;
  acceptDraw: () => void;
  declineDraw: () => void;
  isLegalMove: (row: number, col: number) => boolean;
  isLastMoveSquare: (row: number, col: number) => boolean;
  handleThemeChange: (theme: any) => void;
  toggleBoardOrientation: () => void;
  handleAudioToggle: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isViewingHistory: boolean;
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  board,
  selectedPiece,
  currentPlayer,
  gameStarted,
  isGameOver,
  winner,
  isStalemate,
  inCheck,
  capturedPieces,
  moves,
  promotionPending,
  currentTheme,
  drawOfferedBy,
  gameResult,
  currentHistoryIndex,
  boardFlipped,
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
  canUndo,
  canRedo,
  isViewingHistory,
  selectedTimeSetting,
}) => {
  const files = boardFlipped ? ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] : ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = boardFlipped ? ['1', '2', '3', '4', '5', '6', '7', '8'] : ['8', '7', '6', '5', '4', '3', '2', '1'];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="minimal-panel p-3 sm:p-6 rounded-3xl shadow-2xl">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Chess Board - First on mobile */}
          <div className="flex flex-col items-center order-1 lg:order-2 flex-1">
            {/* Board with coordinates */}
            <div className="flex flex-col items-center">
              {/* Top file labels */}
              <div className="grid grid-cols-8 gap-0 mb-1 ml-4">
                {files.map((file, index) => (
                  <div
                    key={`top-${file}`}
                    className="w-[calc(11vw-1rem)] sm:w-[calc(8vw-1rem)] md:w-16 flex items-center justify-center animate-slide-up"
                    style={{ animationDelay: `${0.1 + index * 0.02}s` }}
                  >
                    <span className="text-gray-200 text-xs sm:text-sm font-medium drop-shadow-sm">
                      {file}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-1">
                {/* Left rank labels */}
                <div className="flex flex-col gap-0">
                  {ranks.map((rank, index) => (
                    <div
                      key={`left-${rank}`}
                      className="h-[calc(11vw-1rem)] sm:h-[calc(8vw-1rem)] md:h-16 flex items-center justify-center animate-slide-up"
                      style={{ animationDelay: `${0.2 + index * 0.02}s` }}
                    >
                      <span className="text-gray-200 text-xs sm:text-sm font-medium w-4 drop-shadow-sm">
                        {rank}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chess board */}
                <div className="grid grid-cols-8 gap-0 rounded-2xl overflow-hidden shadow-lg ring-1 ring-gray-700 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  {board.map((row: any, i: number) =>
                    row.map((piece: any, j: number) => {
                      // Calculate actual board positions considering flip
                      const actualRow = boardFlipped ? 7 - i : i;
                      const actualCol = boardFlipped ? 7 - j : j;
                      const actualPiece = board[actualRow][actualCol];
                      
                      return (
                        <Square
                          key={`${i}-${j}`}
                          piece={actualPiece}
                          position={{ row: actualRow, col: actualCol }}
                          isSelected={
                            selectedPiece?.position.row === actualRow &&
                            selectedPiece?.position.col === actualCol
                          }
                          isLegalMove={isLegalMove(actualRow, actualCol)}
                          isInCheck={actualPiece?.type === 'king' && actualPiece.color === inCheck}
                          isLastMoveSquare={isLastMoveSquare(actualRow, actualCol)}
                          lightSquareColor={currentTheme.lightSquare}
                          darkSquareColor={currentTheme.darkSquare}
                          onClick={() => handleSquareClick(actualRow, actualCol)}
                          isLight={(actualRow + actualCol) % 2 === 0}
                          isGameOver={isGameOver}
                        />
                      );
                    })
                  )}
                </div>

                {/* Right rank labels */}
                <div className="flex flex-col gap-0">
                  {ranks.map((rank, index) => (
                    <div
                      key={`right-${rank}`}
                      className="h-[calc(11vw-1rem)] sm:h-[calc(8vw-1rem)] md:h-16 flex items-center justify-center animate-slide-up"
                      style={{ animationDelay: `${0.4 + index * 0.02}s` }}
                    >
                      <span className="text-gray-200 text-xs sm:text-sm font-medium w-4 drop-shadow-sm">
                        {rank}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom file labels */}
              <div className="grid grid-cols-8 gap-0 mt-1 ml-4">
                {files.map((file, index) => (
                  <div
                    key={`bottom-${file}`}
                    className="w-[calc(11vw-1rem)] sm:w-[calc(8vw-1rem)] md:w-16 flex items-center justify-center animate-slide-up"
                    style={{ animationDelay: `${0.5 + index * 0.02}s` }}
                  >
                    <span className="text-gray-200 text-xs sm:text-sm font-medium drop-shadow-sm">
                      {file}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 lg:mt-6 flex gap-2 sm:gap-3 animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <button
                onClick={undoMove}
                disabled={!canUndo}
                className={`
                  flex items-center justify-center gap-1 sm:gap-2 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl 
                  transition-all duration-200 shadow-lg text-xs sm:text-sm flex-1
                  ${canUndo 
                    ? 'minimal-button text-orange-300 hover:text-orange-200' 
                    : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Undo2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Undo</span>
              </button>

              <button
                onClick={redoMove}
                disabled={!canRedo}
                className={`
                  flex items-center justify-center gap-1 sm:gap-2 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl 
                  transition-all duration-200 shadow-lg text-xs sm:text-sm flex-1
                  ${canRedo 
                    ? 'minimal-button text-green-300 hover:text-green-200' 
                    : 'bg-gray-600/30 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                <Redo2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Redo</span>
              </button>

              <button
                onClick={toggleBoardOrientation}
                className="flex items-center justify-center gap-1 sm:gap-2 minimal-button text-purple-300 hover:text-purple-200 font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-xl text-xs sm:text-sm flex-1"
              >
                <FlipHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Flip</span>
              </button>
            </div>
          </div>

          {/* Left Panel: Captured pieces (white) and Move History - Second on mobile */}
          <div className="w-full lg:w-64 order-2 lg:order-1 flex flex-col gap-4">
            <CapturedPieces pieces={capturedPieces.white} color="white" />
            <MoveHistory 
              moves={moves}
              goToMove={goToMove}
              currentHistoryIndex={currentHistoryIndex}
              canUndo={canUndo}
              canRedo={canRedo}
              undoMove={undoMove}
              redoMove={redoMove}
              isViewingHistory={isViewingHistory}
              className="flex-grow"
            />
          </div>

          {/* Right Panel: Captured pieces (black), Game Controls, and Theme - Third on mobile */}
          <div className="w-full lg:w-64 order-3 lg:order-3 flex flex-col gap-4">
            <CapturedPieces pieces={capturedPieces.black} color="black" />
            <GameControls
              gameStarted={gameStarted}
              currentPlayer={currentPlayer}
              drawOfferedBy={drawOfferedBy}
              isGameOver={isGameOver}
              onStartGame={() => {}} // Removed - handled by header
              onResign={resignGame}
              onOfferDraw={offerDraw}
              onAcceptDraw={acceptDraw}
              onDeclineDraw={declineDraw}
            />
            <ThemeSelector 
              currentTheme={currentTheme}
              onThemeChange={handleThemeChange}
              className="flex-grow"
            />
          </div>
        </div>
      </div>

      {/* New Game Modal */}
      <NewGameModal
        isOpen={isNewGameModalOpen}
        onClose={() => setIsNewGameModalOpen(false)}
        selectedTimeSetting={selectedTimeSetting}
        onSelectTimeControl={selectTimeControl}
        onStartGame={(startColor) => {
          startGame(startColor);
          setIsNewGameModalOpen(false);
        }}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        onClose={closeGameOverModal}
        winner={winner}
        gameResult={gameResult}
        isStalemate={isStalemate}
        onPlayAgain={resetGame}
      />

      {/* Promotion Modal */}
      {promotionPending && selectedPiece && (
        <PromotionModal
          color={currentPlayer}
          onSelect={handlePromotion}
        />
      )}
    </div>
  );
};