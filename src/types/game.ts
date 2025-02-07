export type PlayerColor = 'black' | 'white';

export type Position = {
  row: number;
  col: number;
};

export type Piece = {
  id: string;
  color: PlayerColor;
  isKing: boolean;
  position: Position;
};

export type Move = {
  from: Position;
  to: Position;
  captures?: Position[];
};

export type GameState = {
  board: (Piece | null)[][];
  currentPlayer: PlayerColor;
  selectedPiece: Piece | null;
  possibleMoves: Move[];
  gameStatus: 'waiting' | 'playing' | 'finished';
  winner: PlayerColor | null;
};

export type GameSettings = {
  boardSize: number;
  piecesPerPlayer: number;
  mandatoryCapture: boolean;
};

export type GameAction = 
  | { type: 'SELECT_PIECE'; payload: Piece }
  | { type: 'MOVE_PIECE'; payload: Move }
  | { type: 'RESET_GAME' }
  | { type: 'UPDATE_POSSIBLE_MOVES'; payload: Move[] }; 