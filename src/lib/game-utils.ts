import type { Piece, Position, Move } from '@/types/game';
import { DEFAULT_BOARD_SIZE } from '@/constants/game';

// Check if a position is within the board boundaries
export const isValidPosition = (position: Position): boolean => {
  return (
    position.row >= 0 &&
    position.row < DEFAULT_BOARD_SIZE &&
    position.col >= 0 &&
    position.col < DEFAULT_BOARD_SIZE
  );
};

// Get a piece at a specific position
export const getPieceAtPosition = (
  position: Position,
  pieces: Piece[]
): Piece | undefined => {
  return pieces.find(
    (piece) =>
      piece.position.row === position.row && piece.position.col === position.col
  );
};

// Get normal moves (non-capture moves)
const getNormalMoves = (
  piece: Piece,
  pieces: Piece[]
): Move[] => {
  const moves: Move[] = [];
  const directions = piece.isKing
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : piece.color === 'black'
      ? [[1, -1], [1, 1]]
      : [[-1, -1], [-1, 1]];

  directions.forEach(([rowDir, colDir]) => {
    const movePosition: Position = {
      row: piece.position.row + rowDir,
      col: piece.position.col + colDir,
    };

    if (isValidPosition(movePosition) && !getPieceAtPosition(movePosition, pieces)) {
      moves.push({ from: piece.position, to: movePosition });
    }
  });

  return moves;
};

// Get all possible captures from a position
const getCapturesFromPosition = (
  position: Position,
  piece: Piece,
  pieces: Piece[],
  capturedPositions: Position[] = []
): Move[] => {
  const captures: Move[] = [];
  const directions = piece.isKing
    ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    : piece.color === 'black'
      ? [[1, -1], [1, 1]]
      : [[-1, -1], [-1, 1]];

  directions.forEach(([rowDir, colDir]) => {
    const jumpOver: Position = {
      row: position.row + rowDir,
      col: position.col + colDir,
    };

    const landingPos: Position = {
      row: position.row + rowDir * 2,
      col: position.col + colDir * 2,
    };

    if (isValidPosition(landingPos)) {
      const jumpOverPiece = getPieceAtPosition(jumpOver, pieces);
      const landingPiece = getPieceAtPosition(landingPos, pieces);

      if (
        jumpOverPiece &&
        jumpOverPiece.color !== piece.color &&
        !landingPiece &&
        !capturedPositions.some(
          pos => pos.row === jumpOver.row && pos.col === jumpOver.col
        )
      ) {
        // Found a valid capture
        const newCapturedPositions = [...capturedPositions, jumpOver];
        
        // Create the initial capture move
        const captureMove: Move = {
          from: position,
          to: landingPos,
          captures: newCapturedPositions,
        };
        captures.push(captureMove);

        // Look for additional captures from the new position
        const furtherCaptures = getCapturesFromPosition(
          landingPos,
          { ...piece, position: landingPos },
          pieces.filter(p => 
            !newCapturedPositions.some(
              pos => pos.row === p.position.row && pos.col === p.position.col
            )
          ),
          newCapturedPositions
        );

        captures.push(...furtherCaptures);
      }
    }
  });

  return captures;
};

// Get all possible moves for a piece
export const getValidMoves = (
  piece: Piece,
  pieces: Piece[],
  requireCapture: boolean = true
): Move[] => {
  // First, check for captures
  const captures = getCapturesFromPosition(piece.position, piece, pieces);
  console.log('Possible captures:', captures);

  // Check if any piece has captures available
  const anyCaptures = pieces
    .filter(p => p.color === piece.color)
    .some(p => getCapturesFromPosition(p.position, p, pieces).length > 0);

  // If captures are available and required, only return captures
  if (anyCaptures && requireCapture) {
    return captures;
  }

  // If no captures are required or available, get normal moves
  const normalMoves = getNormalMoves(piece, pieces);
  console.log('Normal moves:', normalMoves);

  return captures.length > 0 ? captures : normalMoves;
};

// Check if a piece should be promoted to king
export const shouldPromoteToKing = (piece: Piece): boolean => {
  return (
    (piece.color === 'black' && piece.position.row === DEFAULT_BOARD_SIZE - 1) ||
    (piece.color === 'white' && piece.position.row === 0)
  );
};

// Check if any piece of the given color has available captures
export const hasAvailableCaptures = (
  pieces: Piece[],
  color: 'black' | 'white'
): boolean => {
  return pieces
    .filter((piece) => piece.color === color)
    .some((piece) => getValidMoves(piece, pieces, true).length > 0);
}; 