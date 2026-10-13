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
export const processMove = (position, gameState, players, forcedOrder = null) => {
  console.info('Process movement on position:', position, 'forcedOrder:', forcedOrder);
  const { currentPositions, id } = gameState;
  
  // orderPlay: 1 para Host (X), 2 para Guest (O)
  const currentOrder = forcedOrder || currentPositions.orderPlay || 1;
  const isHost = currentOrder === 1;

  // Get the magic value for the clicked position
  const magicValue = getMagicValue(position);

  let newHostMovements = currentPositions.hostPlayerMoves ? [...currentPositions.hostPlayerMoves] : [];
  let newGuestMovements = currentPositions.guestPlayerMoves ? [...currentPositions.guestPlayerMoves] : [];

  // Evitar duplicar jugada si la celda ya tiene ficha
  if (newHostMovements.includes(magicValue) || newGuestMovements.includes(magicValue)) {
    console.warn('Posición ya ocupada:', position, 'magicValue:', magicValue);
    return gameState;
  }

  if (isHost) {
    newHostMovements.push(magicValue);
  } else {
    newGuestMovements.push(magicValue);
  }

  // Comprobar si el jugador actual ganó
  const currentPlayerMovements = isHost
    ? newHostMovements
    : newGuestMovements;

  const winnerResult = checkWinnerWithMagicSquare(currentPlayerMovements);

  let newResult = null;
  let newWinningLine = [];
  const currentPlayerId = isHost ? players.hostPlayer?.id : players.guestPlayer?.id;

  if (winnerResult) {
    newResult = currentPlayerId;
    newWinningLine = winnerResult.winningPositions;
  } else if (isBoardFull(newHostMovements, newGuestMovements)) {
    newResult = 'draw';
  }

  // Alternar el orden entre los dos jugadores (1 -> 2 ó 2 -> 1)
  const nextOrderPlay = (newResult || newResult === 'draw')
    ? currentOrder
    : (isHost ? 2 : 1);

  const nextPlayerId = (newResult || newResult === 'draw')
    ? currentPlayerId
    : (isHost ? players.guestPlayer?.id : players.hostPlayer?.id);

  return {
    currentPositions: {
      hostPlayerMoves: newHostMovements,
      guestPlayerMoves: newGuestMovements,
      orderPlay: nextOrderPlay,
      playerTurnId: nextPlayerId,
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
      orderPlay: 1, // Siempre arranca el orden 1 (Host, 'X')
      playerTurnId: players.hostPlayer?.id,
      turnPlayerId: players.hostPlayer?.id,
      winningLine: []
    },
    matchResult: null,
    id: generateGameId(),
    updateDate: Date.now()
  };
};

// Sum of moves for a player
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

// the match result and players
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
