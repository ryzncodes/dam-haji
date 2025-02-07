export const DEFAULT_BOARD_SIZE = 8;
export const DEFAULT_PIECES_PER_PLAYER = 12;

export const INITIAL_GAME_SETTINGS = {
  boardSize: DEFAULT_BOARD_SIZE,
  piecesPerPlayer: DEFAULT_PIECES_PER_PLAYER,
  mandatoryCapture: true,
};

export const BOARD_COLORS = {
  LIGHT: 'bg-red-600',
  DARK: 'bg-black',
};

export const PIECE_COLORS = {
  BLACK: 'bg-neutral-900',
  WHITE: 'bg-red-500',
};

export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished',
} as const;

// Animation durations in milliseconds
export const ANIMATIONS = {
  PIECE_MOVE: 300,
  PIECE_CAPTURE: 500,
  KING_PROMOTION: 800,
} as const; 