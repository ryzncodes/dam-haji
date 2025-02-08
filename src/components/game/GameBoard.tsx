'use client';

import { useState, useEffect } from 'react';
import { BOARD_COLORS, INITIAL_GAME_SETTINGS } from '@/constants/game';
import { cn } from '@/lib/utils';
import { getValidMoves, shouldPromoteToKing } from '@/lib/game-utils';
import GamePiece from './GamePiece';
import TutorialOverlay from './TutorialOverlay';
import GameSettings from './GameSettings';
import type { Piece, Position, Move, PlayerColor, GameSettings as GameSettingsType } from '@/types/game';

interface GameState {
  pieces: Piece[];
  currentPlayer: PlayerColor;
  isCapturing: boolean;
}

const TUTORIAL_SHOWN_KEY = 'dam-haji-tutorial-shown';
const SETTINGS_KEY = 'dam-haji-settings';

const GameBoard = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<GameSettingsType>(INITIAL_GAME_SETTINGS);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>('black');
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');
  const [winner, setWinner] = useState<PlayerColor | null>(null);
  const [moveHistory, setMoveHistory] = useState<GameState[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  // Initialize pieces whenever settings change
  useEffect(() => {
    setPieces(generateInitialPieces(settings));
  }, [settings]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse saved settings:', e);
      }
    }

    const tutorialShown = localStorage.getItem(TUTORIAL_SHOWN_KEY);
    if (!tutorialShown) {
      setShowTutorial(true);
    }
  }, []);

  // Save settings to localStorage
  const handleSettingsChange = (newSettings: GameSettingsType) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    
    // Reset the game state
    setCurrentPlayer('black');
    setSelectedPiece(null);
    setValidMoves([]);
    setIsCapturing(false);
    setGameStatus('playing');
    setWinner(null);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
  };

  // Reset game function
  const handleNewGame = () => {
    setPieces(generateInitialPieces(settings));
    setCurrentPlayer('black');
    setSelectedPiece(null);
    setValidMoves([]);
    setIsCapturing(false);
    setGameStatus('playing');
    setWinner(null);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
  };

  // Update tutorial completion in localStorage
  const handleTutorialComplete = () => {
    localStorage.setItem(TUTORIAL_SHOWN_KEY, 'true');
    setShowTutorial(false);
  };

  // Undo move function
  const handleUndo = () => {
    if (currentMoveIndex > -1) {
      const previousState = moveHistory[currentMoveIndex];
      setPieces(previousState.pieces);
      setCurrentPlayer(previousState.currentPlayer);
      setIsCapturing(previousState.isCapturing);
      setSelectedPiece(null);
      setValidMoves([]);
      setCurrentMoveIndex(currentMoveIndex - 1);
      setGameStatus('playing');
      setWinner(null);
    }
  };

  // Save game state after each move
  const saveGameState = () => {
    const newState: GameState = {
      pieces: [...pieces],
      currentPlayer,
      isCapturing,
    };
    
    // Remove any future states if we undid and then made a new move
    const newHistory = moveHistory.slice(0, currentMoveIndex + 1);
    setMoveHistory([...newHistory, newState]);
    setCurrentMoveIndex(currentMoveIndex + 1);
  };

  // Check for win conditions
  const checkWinCondition = (pieces: Piece[], nextPlayer: PlayerColor) => {
    // Count pieces for each player
    const blackPieces = pieces.filter(p => p.color === 'black');
    const whitePieces = pieces.filter(p => p.color === 'white');

    // Check if any player has no pieces left
    if (blackPieces.length === 0) {
      setGameStatus('finished');
      setWinner('white');
      return true;
    }
    if (whitePieces.length === 0) {
      setGameStatus('finished');
      setWinner('black');
      return true;
    }

    // Check if next player has any valid moves
    const playerPieces = pieces.filter(p => p.color === nextPlayer);
    const hasAnyValidMoves = playerPieces.some(piece => {
      const moves = getValidMoves(piece, pieces, settings.mandatoryCapture, settings.boardSize);
      return moves.length > 0;
    });

    if (!hasAnyValidMoves) {
      setGameStatus('finished');
      setWinner(nextPlayer === 'black' ? 'white' : 'black');
      return true;
    }

    return false;
  };

  // Update generateInitialPieces to accept settings parameter
  const generateInitialPieces = (gameSettings: GameSettingsType = settings): Piece[] => {
    const pieces: Piece[] = [];
    const rowsPerSide = Math.ceil(gameSettings.piecesPerPlayer / (gameSettings.boardSize / 2));

    // Generate black pieces at the top
    for (let row = 0; row < rowsPerSide; row++) {
      const startCol = row % 2 === 0 ? 1 : 0;
      for (let col = startCol; col < gameSettings.boardSize; col += 2) {
        if (pieces.filter(p => p.color === 'black').length >= gameSettings.piecesPerPlayer) break;
        pieces.push({
          id: `black-${row}-${col}`,
          color: 'black',
          isKing: false,
          position: { row, col }
        });
      }
    }

    // Generate white (red) pieces at the bottom
    for (let row = gameSettings.boardSize - rowsPerSide; row < gameSettings.boardSize; row++) {
      const startCol = row % 2 === 0 ? 1 : 0;
      for (let col = startCol; col < gameSettings.boardSize; col += 2) {
        if (pieces.filter(p => p.color === 'white').length >= gameSettings.piecesPerPlayer) break;
        pieces.push({
          id: `white-${row}-${col}`,
          color: 'white',
          isKing: false,
          position: { row, col }
        });
      }
    }

    return pieces;
  };

  const getPieceAtPosition = (row: number, col: number): Piece | undefined => {
    return pieces.find(
      piece => piece.position.row === row && piece.position.col === col
    );
  };

  const handlePieceClick = (piece: Piece) => {
    console.log('Piece clicked:', piece);
    console.log('Current player:', currentPlayer);
    console.log('Is capturing:', isCapturing);

    // Only allow selecting pieces of current player
    if (piece.color !== currentPlayer) {
      console.log('Not current player\'s piece');
      return;
    }

    if (isCapturing && piece.id !== selectedPiece?.id) {
      console.log('Must continue capturing with the same piece');
      return;
    }

    setSelectedPiece(piece);
    const moves = getValidMoves(piece, pieces, settings.mandatoryCapture, settings.boardSize);
    console.log('Valid moves:', moves);
    setValidMoves(moves);
  };

  const handleSquareClick = (position: Position) => {
    console.log('Square clicked:', position);
    console.log('Selected piece:', selectedPiece);
    console.log('Valid moves:', validMoves);

    if (gameStatus === 'finished' || !selectedPiece) {
      console.log('Game is finished or no piece selected');
      return;
    }

    const move = validMoves.find(
      m => m.to.row === position.row && m.to.col === position.col
    );

    if (!move) {
      console.log('Not a valid move');
      return;
    }

    console.log('Executing move:', move);

    // Update piece position
    const updatedPieces = pieces.map(p => {
      if (p.id === selectedPiece.id) {
        const shouldPromote = shouldPromoteToKing({
          ...p,
          position: move.to
        }, settings.boardSize);
        return {
          ...p,
          position: move.to,
          isKing: p.isKing || shouldPromote
        };
      }
      return p;
    });

    // Remove captured pieces
    if (move.captures?.length) {
      console.log('Capturing pieces:', move.captures);
      move.captures.forEach(capturePos => {
        const index = updatedPieces.findIndex(
          p => p.position.row === capturePos.row && p.position.col === capturePos.col
        );
        if (index !== -1) {
          updatedPieces.splice(index, 1);
        }
      });
    }

    setPieces(updatedPieces);
    saveGameState(); // Save state after the move

    // Check for additional captures
    const updatedPiece = updatedPieces.find(p => p.id === selectedPiece.id)!;
    const additionalCaptures = getValidMoves(updatedPiece, updatedPieces, true, settings.boardSize);
    console.log('Additional captures:', additionalCaptures);

    // Only continue capturing if there are actual capture moves available
    if (move.captures?.length && additionalCaptures.some(m => m.captures && m.captures.length > 0)) {
      // Continue capturing with the same piece
      console.log('Continuing capture sequence');
      setSelectedPiece(updatedPiece);
      setValidMoves(additionalCaptures);
      setIsCapturing(true);
    } else {
      // End turn
      console.log('Ending turn');
      setSelectedPiece(null);
      setValidMoves([]);
      setIsCapturing(false);
      const nextPlayer = currentPlayer === 'black' ? 'white' : 'black';
      
      // Check for win condition before changing turn
      if (!checkWinCondition(updatedPieces, nextPlayer)) {
        setCurrentPlayer(nextPlayer);
      }
    }
  };

  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.to.row === row && move.to.col === col);
  };

  const renderSquare = (row: number, col: number) => {
    const isBlackSquare = (row + col) % 2 === 1;
    const piece = getPieceAtPosition(row, col);
    const isValidMoveSquare = isValidMove(row, col);

    // Calculate square size based on board size
    const squareSize = {
      6: 'w-24 h-24',
      8: 'w-20 h-20',
      10: 'w-16 h-16'
    }[settings.boardSize];

    const pieceSize = {
      6: 'w-20 h-20',
      8: 'w-16 h-16',
      10: 'w-14 h-14'
    }[settings.boardSize];

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleSquareClick({ row, col })}
        className={cn(
          squareSize,
          'flex items-center justify-center relative',
          isBlackSquare ? BOARD_COLORS.DARK : BOARD_COLORS.LIGHT,
          isValidMoveSquare && 'cursor-pointer'
        )}
      >
        {isValidMoveSquare && (
          <div className="absolute w-6 h-6 rounded-full bg-yellow-400 opacity-50" />
        )}
        {piece && (
          <GamePiece
            piece={piece}
            isSelected={selectedPiece?.id === piece.id}
            onClick={() => handlePieceClick(piece)}
            size={pieceSize}
          />
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    // Render rows in reverse order to flip the board
    for (let row = settings.boardSize - 1; row >= 0; row--) {
      const rowSquares = [];
      for (let col = 0; col < settings.boardSize; col++) {
        rowSquares.push(renderSquare(row, col));
      }
      board.push(
        <div key={row} className="flex">
          {rowSquares}
        </div>
      );
    }
    return board;
  };

  // Get game statistics
  const getGameStats = () => {
    const blackPieces = pieces.filter(p => p.color === 'black');
    const whitePieces = pieces.filter(p => p.color === 'white');
    const blackKings = blackPieces.filter(p => p.isKing).length;
    const whiteKings = whitePieces.filter(p => p.isKing).length;

    return {
      black: {
        total: blackPieces.length,
        kings: blackKings,
        captured: settings.piecesPerPlayer - blackPieces.length,
      },
      white: {
        total: whitePieces.length,
        kings: whiteKings,
        captured: settings.piecesPerPlayer - whitePieces.length,
      },
    };
  };

  return (
    <div className="inline-block">
      {showTutorial && (
        <TutorialOverlay onComplete={handleTutorialComplete} />
      )}
      
      {showSettings && (
        <GameSettings
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
          onNewGame={handleNewGame}
        />
      )}

      {/* Game Controls */}
      <div className="mb-4 flex justify-center gap-4">
        <button
          onClick={handleNewGame}
          className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white font-medium"
        >
          New Game
        </button>
        <button
          onClick={handleUndo}
          disabled={currentMoveIndex === -1}
          className={cn(
            "px-4 py-2 rounded-md font-medium",
            currentMoveIndex === -1
              ? "bg-neutral-800 text-neutral-600 cursor-not-allowed"
              : "bg-neutral-700 hover:bg-neutral-600 text-white"
          )}
        >
          Undo Move
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white font-medium"
        >
          Settings
        </button>
      </div>

      <div className="mb-6 flex justify-center gap-4">
        {/* Black player stats */}
        <div className={cn(
          'w-[160px] p-4 rounded-lg flex flex-col items-center',
          currentPlayer === 'black' ? 'bg-neutral-800 ring-2 ring-yellow-400' : 'bg-neutral-700'
        )}>
          <div className="font-bold text-lg mb-2">Black</div>
          <div className="text-sm">
            Pieces: {getGameStats().black.total}
            {getGameStats().black.kings > 0 && ` (${getGameStats().black.kings} Kings)`}
          </div>
          <div className="text-sm text-red-400">
            Captured: {getGameStats().black.captured}
          </div>
        </div>

        {/* Game status */}
        <div className="w-[160px] p-4 bg-neutral-800 rounded-lg flex flex-col items-center justify-center">
          {gameStatus === 'finished' ? (
            <div className="text-xl text-yellow-400 font-bold text-center">
              Game Over!<br/>
              {winner === 'black' ? 'Black' : 'Red'} Wins!
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1">
              <div className="font-bold text-lg">
                {currentPlayer === 'black' ? 'Black' : 'Red'}&apos;s Turn
              </div>
              <div className="text-sm text-center">
                {isCapturing ? (
                  <span className="text-yellow-400 font-medium">Must continue capturing!</span>
                ) : (
                  'Waiting for move...'
                )}
              </div>
            </div>
          )}
        </div>

        {/* White (Red) player stats */}
        <div className={cn(
          'w-[160px] p-4 rounded-lg flex flex-col items-center',
          currentPlayer === 'white' ? 'bg-neutral-800 ring-2 ring-yellow-400' : 'bg-neutral-700'
        )}>
          <div className="font-bold text-lg mb-2">Red</div>
          <div className="text-sm">
            Pieces: {getGameStats().white.total}
            {getGameStats().white.kings > 0 && ` (${getGameStats().white.kings} Kings)`}
          </div>
          <div className="text-sm text-red-400">
            Captured: {getGameStats().white.captured}
          </div>
        </div>
      </div>

      <div className="rounded-sm border-4 border-black dark:border-neutral-800 bg-black dark:bg-neutral-900">
        <div className={cn(
          'grid place-items-center',
          {
            6: 'w-[576px] h-[576px]',
            8: 'w-[640px] h-[640px]',
            10: 'w-[640px] h-[640px]'
          }[settings.boardSize]
        )}>
          {renderBoard()}
        </div>
      </div>

      {!showTutorial && (
        <button
          onClick={() => setShowTutorial(true)}
          className="mt-4 px-4 py-2 text-sm text-neutral-400 hover:text-neutral-200"
        >
          Show Tutorial
        </button>
      )}
    </div>
  );
};

export default GameBoard; 