import { getPositionFromMagicValue } from './magicSquare.js';

export const generateGameId = () => {
  return `game_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const generatePlayerId = () => {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Check if there's a winner using magic square algorithm
 * Returns winner info if found, null otherwise
 */
export const checkWinner = (moves) => {
  if (moves.length < 3) return null;

  // Check all possible combinations of 3 moves
  for (let i = 0; i < moves.length - 2; i++) {
    for (let j = i + 1; j < moves.length - 1; j++) {
      for (let k = j + 1; k < moves.length; k++) {
        const sum = moves[i] + moves[j] + moves[k];
        
        // Magic square win condition: sum equals 15
        if (sum === 15) {
          return {
            isWinner: true,
            winningMoves: [moves[i], moves[j], moves[k]],
            winningPositions: [
              getPositionFromMagicValue(moves[i]),
              getPositionFromMagicValue(moves[j]),
              getPositionFromMagicValue(moves[k])
            ]
          };
        }
      }
    }
  }

  return null;
};

export const isBoardFull = (hostPlayerMoves, guestPlayerMoves) => {
  return (hostPlayerMoves.length + guestPlayerMoves.length) === 9;
};

/**
 * Reconstruct visual board from moves
 * Returns array of 9 elements where each is null, 'X', or 'O'
 */
export const reconstructBoard = (hostPlayerMoves, guestPlayerMoves, hostPlayerId, guestPlayerId) => {
  const board = Array(9).fill(null);
  
  // Place host player moves
  hostPlayerMoves.forEach(magicValue => {
    const position = getPositionFromMagicValue(magicValue);
    board[position] = { symbol: 'X', playerId: hostPlayerId };
  });
  
  // Place guest player moves
  guestPlayerMoves.forEach(magicValue => {
    const position = getPositionFromMagicValue(magicValue);
    board[position] = { symbol: 'O', playerId: guestPlayerId };
  });
  
  return board;
};

/**
 * Validate player data
 */
export const validatePlayer = (player) => {
  const errors = {};
  
  if (!player.name || player.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  
  if (!player.email || !isValidEmail(player.email)) {
    errors.email = 'Valid email is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const calculateSum = (moves) => {
  return moves.reduce((sum, value) => sum + value, 0);
};
