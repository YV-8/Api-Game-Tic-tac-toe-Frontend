import { defineStore } from 'pinia';
import { 
  generateGameId, 
  generatePlayerId, 
  checkWinner, 
  isBoardFull, 
  reconstructBoard,
  calculateSum
} from '../utils/gameLogic.js';
import { getMagicValue } from '../utils/magicSquare.js';

const DRAW = 'draw';
/**
 * Main game store using Pinia
 */
export const useGameStore = defineStore('game', {
  state: () => ({
    players: {
      hostPlayer: null,
      guestPlayer: null
    },
    
    // Current game state
    currentGame: {
      id: null,
      hostPlayerMoves: [],
      guestPlayerMoves: [],
      currentPlayerId: null,
      winningLine: [],
      resultMatch: null, // null, 'hostPlayerId', 'guestPlayerId', or DRAW
      lastUpdated: null
    },
    
    // Session statistics
    sessionStats: {
      gamesPlayed: 0,
      hostPlayerWins: 0,
      guestPlayerWins: 0,
      draws: 0
    },
    
    // Games history
    gamesHistory: []
  }),
  
  getters: {
    /**
     * Get visual board representation
     */
    board: (state) => {
      if (!state.players.hostPlayer || !state.players.guestPlayer) {
        return Array(9).fill(null);
      }
      
      return reconstructBoard(
        state.currentGame.hostPlayerMoves,
        state.currentGame.guestPlayerMoves,
        state.players.hostPlayer.id,
        state.players.guestPlayer.id
      );
    },
    
    /**
     * Get current player object
     */
    currentPlayer: (state) => {
      if (!state.currentGame.currentPlayerId) return null;
      
      return state.currentGame.currentPlayerId === state.players.hostPlayer?.id
        ? state.players.hostPlayer
        : state.players.guestPlayer;
    },
    
    /**
     * Get winner object
     */
    winner: (state) => {
      if (!state.currentGame.resultMatch || state.currentGame.resultMatch === DRAW) {
        return null;
      }
      
      return state.currentGame.resultMatch === state.players.hostPlayer?.id
        ? state.players.hostPlayer
        : state.players.guestPlayer;
    },
    
    /**
     * Calculate sum of player moves
     */
    hostPlayerSum: (state) => calculateSum(state.currentGame.hostPlayerMoves),
    guestPlayerSum: (state) => calculateSum(state.currentGame.guestPlayerMoves),
    
    /**
     * Check if game is over
     */
    isGameOver: (state) => state.currentGame.resultMatch !== null,
    
    /**
     * Check if players are registered
     */
    hasPlayers: (state) => {
      return state.players.hostPlayer !== null && state.players.guestPlayer !== null;
    }
  },
  
  actions: {
    /**
     * Register players and start game
     */
    registerPlayers(hostPlayerData, guestPlayerData) {
      this.players.hostPlayer = {
        id: generatePlayerId(),
        name: hostPlayerData.name,
        email: hostPlayerData.email
      };
      
      this.players.guestPlayer = {
        id: generatePlayerId(),
        name: guestPlayerData.name,
        email: guestPlayerData.email
      };
      
      this.initializeGame();
    },
    
    /**
     * Initialize new game
     */
    initializeGame() {
      this.currentGame = {
        id: generateGameId(),
        hostPlayerMoves: [],
        guestPlayerMoves: [],
        currentPlayerId: this.players.hostPlayer.id,
        winningLine: [],
        resultMatch: null,
        lastUpdated: Date.now()
      };
      console.info('New game initialized:', useGameStore.currentGame);
      useGameStore.currentGame = this.currentGame;
    },
    
    /**
     * Make a move on the board
     */
    makeMove(position) {      
      if (this.currentGame.resultMatch !== null) return;
      if (this.board[position] !== null) return;
      
      const magicValue = getMagicValue(position);
      const ishostPlayer = this.currentGame.currentPlayerId === this.players.hostPlayer.id;      
      
      if (ishostPlayer) {
        this.currentGame.hostPlayerMoves.push(magicValue);
      } else {
        this.currentGame.guestPlayerMoves.push(magicValue);
      }
      
      // Check for winner
      const currentMoves = ishostPlayer 
        ? this.currentGame.hostPlayerMoves 
        : this.currentGame.guestPlayerMoves;
      
      const winnerResult = checkWinner(currentMoves);
      
      if (winnerResult) {        
        this.currentGame.resultMatch = this.currentGame.currentPlayerId;
        this.currentGame.winningLine = winnerResult.winningPositions;
        this.endGame();
      } else if (isBoardFull(this.currentGame.hostPlayerMoves, this.currentGame.guestPlayerMoves)) {        
        this.currentGame.resultMatch = DRAW;
        this.endGame();
      } else {
        // Switch turn
        this.currentGame.currentPlayerId = ishostPlayer 
          ? this.players.guestPlayer.id 
          : this.players.hostPlayer.id;
      }      
      this.currentGame.lastUpdated = Date.now();
    },
    
    /**
     * End game and update statistics
     */
    endGame() {      
      const gameRecord = {
        id: this.currentGame.id,
        hostPlayer: { ...this.players.hostPlayer },
        guestPlayer: { ...this.players.guestPlayer },
        resultMatch: this.currentGame.resultMatch,
        date: this.currentGame.lastUpdated,
        finalPositions: {
          hostPlayerMoves: [...this.currentGame.hostPlayerMoves],
          guestPlayerMoves: [...this.currentGame.guestPlayerMoves],
          winningLine: [...this.currentGame.winningLine]
        }
      };
      
      // Add to history
      this.gamesHistory.unshift(gameRecord);
      
      // Update statistics
      this.sessionStats.gamesPlayed++;
      
      if (this.currentGame.resultMatch === this.players.hostPlayer.id) {
        this.sessionStats.hostPlayerWins++;
      } else if (this.currentGame.resultMatch === this.players.guestPlayer.id) {
        this.sessionStats.guestPlayerWins++;
      } else if (this.currentGame.resultMatch === DRAW) {
        this.sessionStats.draws++;
      }
    },
    
    /**
     * Reset game keeping same players
     */
    resetGame() {
      this.initializeGame();
    },
    
    /**
     * Change players (go back to registration)
     */
    changePlayers() {
      this.players.hostPlayer = null;
      this.players.guestPlayer = null;
      this.currentGame = {
        id: null,
        hostPlayerMoves: [],
        guestPlayerMoves: [],
        currentPlayerId: null,
        winningLine: [],
        resultMatch: null,
        lastUpdated: null
      };
    }
  }
});
