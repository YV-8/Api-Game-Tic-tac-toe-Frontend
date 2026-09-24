import { MAGIC_SQUARE, getMagicValue, getPositionFromMagicValue } from './store.js';

/**
 * Validates if there is a winner using the Magic Square algorithm.
 * In a 3x3 Magic Square, any winning line (row, column, or diagonal) sums to 15.
 * @param {Array} moves - Array of Magic Square values held by the player.
 * @returns {Object|null} - Result object if a winner is found, otherwise null.
 */
export const checkWinnerWithMagicSquare = (moves) => {
  // At least 3 moves are needed to win
  if (moves.length < 3) return null;

  // All combinations of 3 moves to check if they sum to 15
  for (let i = 0; i < moves.length - 2; i++) {
    for (let j = i + 1; j < moves.length - 1; j++) {
      for (let k = j + 1; k < moves.length; k++) {
        // If the sum of the three moves equals 15, we have a winner
        if (moves[i] + moves[j] + moves[k] === 15) {          
          // Find the original positions on the board
          const positions = [
            getPositionFromMagicValue(moves[i]),
            getPositionFromMagicValue(moves[j]),
            getPositionFromMagicValue(moves[k])
          ].sort((a, b) => a - b);
          
          return {
            isWinner: true,
            winningMoves: [moves[i], moves[j], moves[k]],
            winningPositions: positions
          };
        }
      }
    }
  }

  return null;
};

/**
 * Checks if the game board is full.
 * @param {Array} hostPlayerMoves - Array of moves made by the host.
 * @param {Array} guestPlayerMoves - Array of moves made by the guest.
 * @returns {boolean} - True if the board is full, false otherwise.
 */
export const isBoardFull = (hostPlayerMoves, guestPlayerMoves) => {
  return (hostPlayerMoves.length + guestPlayerMoves.length) === 9;
};

/**
 * Retrieves traditional winning lines for reference.
 * @returns {Array} Array of winning line combinations.
 */
export const getWinningLines = () => {
  return [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6] 
  ];
};

/**
 * Creates a move object with all required information.
 * @param {number} position - Grid position (0-8).
 * @param {string} player - The player ('X' or 'O').
 * @returns {Object} Object containing move details.
 */
export const createMove = (position, player) => {
  return {
    position,
    player,
    magicValue: getMagicValue(position),
    timestamp: Date.now()
  };
};

/**
 * Serializes the game state for remote transmission (future implementation).
 * @param {Object} gameState - The complete current state of the game.
 * @returns {string} JSON-serialized state string.
 */
export const serializeGameState = (gameState) => {
  return JSON.stringify({
    currentPositions: {
      hostPlayerMoves: gameState.currentPositions.hostPlayerMoves,
      guestPlayerMoves: gameState.currentPositions.guestPlayerMoves,
      playerTurn: gameState.currentPositions.playerTurn,
      winningLine: gameState.currentPositions.winningLine
    },
    matchResult: gameState.matchResult,
    id: gameState.id,
    updateDate: gameState.updateDate
  });
};

/**
 * Deserializes the game state received remotely (future implementation).
 * @param {string} serializedState - The serialized state string.
 * @returns {Object} The reconstructed game state object.
 */
export const deserializeGameState = (serializedState) => {
  try {
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error deserializando estado del juego:', error);
    return null;
  }
};

export const generateGameId = () => {
  return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Reconstructs the visual game board from the move state.
 * @param {Array} hostPlayerMoves - Array of moves made by the host.
 * @param {Array} guestPlayerMoves - Array of moves made by the guest.
 * @returns {Array} The reconstructed board array.
 */
export const reconstructBoard = (hostPlayerMoves, guestPlayerMoves) => {
  const board = Array(9).fill(null);
  
  hostPlayerMoves.forEach(magicValue => {
    const position = getPositionFromMagicValue(magicValue);
    if (position !== -1) board[position] = 'X';
  });
  
  guestPlayerMoves.forEach(magicValue => {
    const position = getPositionFromMagicValue(magicValue);
    if (position !== -1) board[position] = 'O';
  });
  
  return board;
};

/**
 * Validates the email format.
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email format is valid.
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates player data.
 * @param {Object} player - Object containing player name and email.
 * @returns {Object} Validation result object containing isValid and errors.
 */
export const validatePlayer = (player) => {
  const errors = {};
  
  if (!player.name || player.name.trim().length < 2) {
    errors.name = 'Name size must be at least 2 characters';
  }
  
  if (!player.email || !validateEmail(player.email)) {
    errors.email = 'Please enter a valid email address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
