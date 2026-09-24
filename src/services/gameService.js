import { 
  checkWinnerWithMagicSquare, 
  isBoardFull, 
  generateGameId 
} from '../gameLogic.js';
import { getMagicValue } from '../store.js';

/**
 * Simplified game service that contains core game logic functions.
 */

// Process board move and determine game state changes
export const processMove = (position, gameState, players) => {
  console.info('Process movement on position:', position);
  const { currentPositions, id } = gameState;
  const currentPlayerId = currentPositions.turnPlayerId;
  
  // Get the magic value for the clicked position
  const magicValue = getMagicValue(position);

  // Is host or guest making the move?
  const isHost = currentPlayerId === players.hostPlayer.id;
  console.info(isHost);
  
  let newHostMovements = currentPositions.hostPlayerMoves;
  let newGuestMovements = currentPositions.guestPlayerMoves;

  if (isHost) {
    newHostMovements = [...newHostMovements, magicValue];
  } else {
    newGuestMovements = [...newGuestMovements, magicValue];
  }

  // check if the current player has won with this move
  const currentPlayerMovements = isHost 
    ? newHostMovements 
    : newGuestMovements;
  
  const winnerResult = checkWinnerWithMagicSquare(currentPlayerMovements);

  let newResult = null;
  let newWinningLine = [];

  if (winnerResult) {     
    newResult = currentPlayerId;
    newWinningLine = winnerResult.winningPositions;
  } else if (isBoardFull(newHostMovements, newGuestMovements)) {    
    newResult = 'draw';
  }

  // Change turn to the other player if the game is not finished
  const nextPlayerId = (newResult || newResult === 'draw')
    ? currentPlayerId
    : (isHost ? players.guestPlayer.id : players.hostPlayer.id);

  return {
    currentPositions: {
      hostPlayerMoves: newHostMovements,
      guestPlayerMoves: newGuestMovements,
      turnPlayerId: nextPlayerId,
      winningLine: newWinningLine
    },
    matchResult: newResult,
    id: id || generateGameId(),
    updateDate: Date.now()
  };
};

// Start a new game with the given players
export const initializeGame = (players) => {
  return {
    currentPositions: {
      hostPlayerMoves: [],
      guestPlayerMoves: [],
      turnPlayerId: players.hostPlayer.id,
      winningLine: []
    },
    matchResult: null,
    id: generateGameId(),
    updateDate: Date.now()
  };
};

// Sum of moves for a player (used for display purposes)
export const calculateSum = (moves) => {
  return moves.reduce((total, valor) => total + valor, 0);
};

// Creates a game record for the history based on the final game state and players info
export const createGameRecord = (gameState, players) => {
  return {
    id: gameState.id,
    hostPlayer: players.hostPlayer,
    guestPlayer: players.guestPlayer,
    matchResult: gameState.matchResult,  // winner id or 'draw'
    updateDate: gameState.updateDate,
    finalPositions: {
      hostPlayerMoves: gameState.currentPositions.hostPlayerMoves,
      guestPlayerMoves: gameState.currentPositions.guestPlayerMoves,
      winningLine: gameState.currentPositions.winningLine
    }
  };
};

// update statistics based on the match result and players
export const updateStats = (currentStats, matchResult, players) => {
  const hostWon = matchResult === players.hostPlayer.id;
  const guestWon = matchResult === players.guestPlayer.id;
  
  return {
    gamesPlayed: currentStats.gamesPlayed + 1,
    hostPlayerWins: currentStats.hostPlayerWins + (hostWon ? 1 : 0),
    guestPlayerWins: currentStats.guestPlayerWins + (guestWon ? 1 : 0),
    draws: currentStats.draws + (matchResult === 'draw' ? 1 : 0)
  };
};
