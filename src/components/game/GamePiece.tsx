'use client';

import { cn } from '@/lib/utils';
import { PIECE_COLORS } from '@/constants/game';
import type { Piece } from '@/types/game';

interface GamePieceProps {
  piece: Piece;
  isSelected?: boolean;
  onClick?: () => void;
}

const GamePiece = ({ piece, isSelected, onClick }: GamePieceProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'w-12 h-12 rounded-full cursor-pointer transition-all duration-200',
        piece.color === 'black' ? PIECE_COLORS.BLACK : PIECE_COLORS.WHITE,
        'shadow-md hover:shadow-lg dark:shadow-neutral-900',
        piece.color === 'black' 
          ? 'border-neutral-800 dark:border-neutral-700' 
          : 'border-neutral-200 dark:border-neutral-300',
        isSelected && 'ring-2 ring-yellow-400 dark:ring-yellow-500 ring-offset-2 dark:ring-offset-neutral-900',
        piece.isKing && 'border-yellow-400 dark:border-yellow-500 border-4',
        'flex items-center justify-center'
      )}
    >
      {piece.isKing && (
        <div className="text-yellow-400 dark:text-yellow-500 text-2xl font-bold">
          ♔
        </div>
      )}
    </div>
  );
};

export default GamePiece; 