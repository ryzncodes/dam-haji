'use client';

import { useState } from 'react';
import { DEFAULT_BOARD_SIZE, BOARD_COLORS } from '@/constants/game';
import { cn } from '@/lib/utils';
import { getValidMoves, shouldPromoteToKing } from '@/lib/game-utils';
import GamePiece from './GamePiece';
import type { Piece, Position, Move } from '@/types/game';

const GameBoard = () => {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'black' | 'white'>('black');
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);

  // Generate initial pieces for both players
  const generateInitialPieces = (): Piece[] => {
    const pieces: Piece[] = [];

    // Generate black pieces at the top
    for (let row = 0; row < 3; row++) {
      const startCol = row % 2 === 0 ? 1 : 0;
      for (let col = startCol; col < DEFAULT_BOARD_SIZE; col += 2) {
        pieces.push({
          id: `black-${row}-${col}`,
          color: 'black',
          isKing: false,
          position: { row, col }
        });
      }
    }

    // Generate white (red) pieces at the bottom
    for (let row = 5; row < 8; row++) {
      const startCol = row % 2 === 0 ? 1 : 0;
      for (let col = startCol; col < DEFAULT_BOARD_SIZE; col += 2) {
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

  const [pieces, setPieces] = useState<Piece[]>(generateInitialPieces());

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
    const moves = getValidMoves(piece, pieces);
    console.log('Valid moves:', moves);
    setValidMoves(moves);
  };

  const handleSquareClick = (position: Position) => {
    console.log('Square clicked:', position);
    console.log('Selected piece:', selectedPiece);
    console.log('Valid moves:', validMoves);

    if (!selectedPiece) {
      console.log('No piece selected');
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
        });
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

    // Check for additional captures
    const updatedPiece = updatedPieces.find(p => p.id === selectedPiece.id)!;
    const additionalCaptures = getValidMoves(updatedPiece, updatedPieces, true);
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
      setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
    }
  };

  const isValidMove = (row: number, col: number): boolean => {
    return validMoves.some(move => move.to.row === row && move.to.col === col);
  };

  const renderSquare = (row: number, col: number) => {
    const isBlackSquare = (row + col) % 2 === 1;
    const piece = getPieceAtPosition(row, col);
    const isValidMoveSquare = isValidMove(row, col);

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleSquareClick({ row, col })}
        className={cn(
          'w-16 h-16 flex items-center justify-center relative',
          isBlackSquare ? BOARD_COLORS.DARK : BOARD_COLORS.LIGHT,
          isValidMoveSquare && 'cursor-pointer'
        )}
      >
        {isValidMoveSquare && (
          <div className="absolute w-4 h-4 rounded-full bg-yellow-400 opacity-50" />
        )}
        {piece && (
          <GamePiece
            piece={piece}
            isSelected={selectedPiece?.id === piece.id}
            onClick={() => handlePieceClick(piece)}
          />
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    // Render rows in reverse order to flip the board
    for (let row = DEFAULT_BOARD_SIZE - 1; row >= 0; row--) {
      const rowSquares = [];
      for (let col = 0; col < DEFAULT_BOARD_SIZE; col++) {
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

  return (
    <div className="inline-block rounded-sm border-4 border-black dark:border-neutral-800 bg-black dark:bg-neutral-900">
      <div className="mb-4 text-center text-lg font-bold">
        Current Player: {currentPlayer}
        {isCapturing && " (Must continue capturing)"}
      </div>
      {renderBoard()}
    </div>
  );
};

export default GameBoard; 