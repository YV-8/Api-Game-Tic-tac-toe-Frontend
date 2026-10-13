import { useAtom } from 'jotai';
import { useMemo } from 'react';
import {
  gameStateAtom,
  playersAtom,
  sessionStatsAtom,
  gamesHistoryAtom,
  generatePlayerId
} from '../store.js';
import { reconstructBoard } from '../gameLogic.js';
import * as gameService from '../services/gameService.js';

/**
 * Custom hook to handle game logic.
 * This hook centralizes all game state and actions.
 */
export const useGameLogic = () => {
  // Get global state
  const [gameState, setGameState] = useAtom(gameStateAtom);
  const [players, setPlayers] = useAtom(playersAtom);
  const [sessionStats, setSessionStats] = useAtom(sessionStatsAtom);
  const [gamesHistory, setGamesHistory] = useAtom(gamesHistoryAtom);

  const { currentPositions, matchResult, id, updateDate } = gameState;

  // Reconstruct the board based on current player moves
  const board = useMemo(
    () => reconstructBoard(
      currentPositions.hostPlayerMoves,
      currentPositions.guestPlayerMoves
    ),
    [currentPositions.hostPlayerMoves, currentPositions.guestPlayerMoves]
  );

  const hostSum = gameService.calculateSum(currentPositions.hostPlayerMoves);
  const guestSum = gameService.calculateSum(currentPositions.guestPlayerMoves);

  const currentTurnId = currentPositions.playerTurnId || currentPositions.turnPlayerId || players.hostPlayer?.id;
  const currentOrderPlay = currentPositions.orderPlay || 1;

  const isHostTurn = currentOrderPlay === 1;
  const currentPlayerName = isHostTurn
    ? players.hostPlayer?.name
    : players.guestPlayer?.name;

  /**
   * Register players and initialize game state
   */
  const handlePlayersRegistered = (registeredPlayers) => {
    const playersWithIds = {
      hostPlayer: {
        ...registeredPlayers.hostPlayer,
        id: registeredPlayers.hostPlayer.id || generatePlayerId(registeredPlayers.hostPlayer.email)
      },
      guestPlayer: {
        ...registeredPlayers.guestPlayer,
        id: registeredPlayers.guestPlayer.id || generatePlayerId(registeredPlayers.guestPlayer.email)
      }
    };

    setPlayers(playersWithIds);
    const newGameState = gameService.initializeGame(playersWithIds);
    setGameState(newGameState);
  };

  /**
   * Click handler for when a cell is clicked
   */
  const handleClick = (position, forcedOrder = null) => {
    if (board[position] || matchResult) return false;

    let updatedState = null;
    setGameState((prev) => {
      updatedState = gameService.processMove(position, prev, players, forcedOrder);
      return updatedState;
    });

    // if the game has ended, record the game and update stats
    if (updatedState && updatedState.matchResult) {
      const gameRecord = gameService.createGameRecord(updatedState, players);
      setGamesHistory((prev) => [gameRecord, ...prev]);

      setSessionStats((prev) =>
        gameService.updateStats(prev, updatedState.matchResult, players)
      );
    }
    return true;
  };

  /**
   * Reset the game to start a new match with the same players
   */
  const resetGame = () => {
    const newGameState = gameService.initializeGame(players);
    setGameState(newGameState);
  };

  /**
   * Let change players and start a new game with empty state
   */
  const changePlayers = () => {
    setPlayers({ hostPlayer: null, guestPlayer: null });
    resetGame();
  };

  return {
    gameState,
    players,
    sessionStats,
    gamesHistory,
    board,
    currentPositions,
    matchResult,
    id,
    updateDate,

    hostSum,
    guestSum,
    currentPlayerName,
    isHostTurn,
    orderPlay: currentOrderPlay,

    // Functions to handle game logic
    handlePlayersRegistered,
    handleClick,
    resetGame,
    changePlayers
  };
};
