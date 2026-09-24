import { atom } from 'jotai';

// magic square values, each combination of 3 values that sum to 15 
// represents a winning line 
export const MAGIC_SQUARE = [
  [2, 7, 6],
  [9, 5, 1],
  [4, 3, 8]
];

// Get magic square value for a given board position (0-8)
export const getMagicValue = (position) => {
  const row = Math.floor(position / 3);
  const col = position % 3;
  return MAGIC_SQUARE[row][col];
};

// Get position (0-8) from a magic square value
export const getPositionFromMagicValue = (magicValue) => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (MAGIC_SQUARE[row][col] === magicValue) {
        return row * 3 + col;
      }
    }
  }
  return -1;
};

export const generatePlayerId = (email) => {
  return `player_${email.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}`;
};

export const initialPlayerData = {
  id: null,
  name: '',
  email: ''
};

export const initialPlayersState = {
  hostPlayer: null,  // { id, name, email }
  guestPlayer: null  // { id, name, email }
};

// Game state
export const initialGameState = {
  currentPositions: {
    hostPlayerMoves: [],
    guestPlayerMoves: [],
    playerTurnId: null,
    winningLine: []
  },
  matchResult: null,
  id: null,
  updateDate: Date.now()
};

// Main atoms for global state management
export const gameStateAtom = atom(initialGameState);

// Player attom for host and guest player information
export const playersAtom = atom(initialPlayersState);

// Statistics atom to track session stats
export const sessionStatsAtom = atom({
  gamesPlayed: 0,
  hostPlayerWins: 0,
  guestPlayerWins: 0,
  draws: 0
});

// history atom to keep track of all completed games in the session
export const gamesHistoryAtom = atom([]);
