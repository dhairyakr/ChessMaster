import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { ChessBoard } from './components/ChessBoard';
import { useChessGame } from './hooks/useChessGame';
import { preloadPieceImages } from './utils/pieceImages';
import { preloadAudioFiles } from './utils/audio';

function App() {
  const chessGame = useChessGame();

  useEffect(() => {
    // Preload chess piece images and audio files for better performance
    Promise.all([
      preloadPieceImages().catch(console.error),
      preloadAudioFiles().catch(console.error)
    ]);
  }, []);

  return (
    <div className={`min-h-screen ${chessGame.currentTheme.background} flex flex-col`}>
      <Header
        whiteTime={chessGame.whiteTime}
        blackTime={chessGame.blackTime}
        currentPlayer={chessGame.currentPlayer}
        isGameOver={chessGame.isGameOver}
        gameStarted={chessGame.gameStarted}
        audioEnabled={chessGame.audioEnabled}
        inCheck={chessGame.inCheck}
        drawOfferedBy={chessGame.drawOfferedBy}
        onAudioToggle={chessGame.handleAudioToggle}
        onNewGame={() => chessGame.setIsNewGameModalOpen(true)}
      />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <ChessBoard {...chessGame} />
      </main>
    </div>
  );
}

export default App;