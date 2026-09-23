<script setup>
/**
 * Game component - main game interface
 */
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../stores/gameStore.js';
import GameBoard from './GameBoard.vue';
import GameStatus from './GameStatus.vue';
import PlayerCard from './PlayerCard.vue';
import SessionStats from './SessionStats.vue';
import GamesHistory from './GamesHistory.vue';

const gameStore = useGameStore();

/**
 * Computed properties from store
 */
const board = computed(() => gameStore.board);
const hostPlayer = computed(() => gameStore.players.hostPlayer);
const guestPlayer = computed(() => gameStore.players.guestPlayer);
const currentPlayer = computed(() => gameStore.currentPlayer);
const winner = computed(() => gameStore.winner);
const isGameOver = computed(() => gameStore.isGameOver);
const hostPlayerMoves = computed(() => gameStore.currentGame.hostPlayerMoves);
const guestPlayerMoves = computed(() => gameStore.currentGame.guestPlayerMoves);
const hostPlayerSum = computed(() => gameStore.hostPlayerSum);
const guestPlayerSum = computed(() => gameStore.guestPlayerSum);
const winningLine = computed(() => gameStore.currentGame.winningLine);
const resultMatch = computed(() => gameStore.currentGame.resultMatch);
const sessionStats = computed(() => gameStore.sessionStats);
const gamesHistory = computed(() => gameStore.gamesHistory);

const { currentGame } = storeToRefs(gameStore);
/**
 * Handle cell click
 */
const onCellClick = (position) => {
  gameStore.makeMove(position);
};

/**
 * Reset game
 */
const onResetGame = () => {
  gameStore.resetGame();
};

/**
 * Change players
 */
const onChangePlayers = () => {
  if (confirm('Are you sure you want to change players? This will reset all statistics.')) {
    gameStore.changePlayers();
  }
};
</script>

<style scoped>
.game-container {
  min-height: 100vh;
  background: linear-gradient(135deg, blue 0%, purple 100%);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.game-card {
  background: #f9fafb;
  border-radius: 16px;
  padding: 40px;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.game-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
}

.change-players-btn {
  padding: 10px 20px;
  background: white;
  color: blue;
  border: 2px solid blue;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-players-btn:hover {
  background: blue;
  color: white;
}

.reset-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, blue 0%, purple 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 15px;
  transition: transform 0.2s ease;
}

.reset-button:hover {
  transform: translateY(-2px);
}

.status-section {
  margin-bottom: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.players-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 15px;
}

@media (max-width: 640px) {
  .game-card {
    padding: 20px;
  }
  
  .players-grid {
    grid-template-columns: 1fr;
  }
  
  .game-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
<template>
  <div class="game-container">
    <div class="game-card">      
      <div class="game-header">
        <h1>Tic Tac Toe</h1>
        <button @click="onChangePlayers" class="change-players-btn">
          Change Players
        </button>
      </div>      
      <!-- Game Status -->
      <GameStatus        
        :resultMatch="resultMatch"
        :current-player="currentPlayer"
        :winner="winner"
        :hostPlayer="hostPlayer"
        :guestPlayer="guestPlayer"
      />      
      <!-- Game Board -->
      <GameBoard
        :board="board"
        :winning-line="winningLine"
        :is-game-over="isGameOver"
        :hostPlayer-id="hostPlayer.id"
        :guestPlayer-id="guestPlayer.id"
        @cell-click="onCellClick"
      />      
      <!-- Reset Game Button -->
      <button 
        v-if="isGameOver" 
        @click="onResetGame"
        class="reset-button"
      >
        New Game
      </button>      
      <!-- Players Info -->
      <div class="players-grid">
        <PlayerCard
          :player="hostPlayer"
          symbol="X"
          icon-class="player-icon-hostPlayer"
          :moves="hostPlayerMoves"
          :sum="hostPlayerSum"
        />        
        <PlayerCard
          :player="guestPlayer"
          symbol="O"
          icon-class="player-icon-guestPlayer"
          :moves="guestPlayerMoves"
          :sum="guestPlayerSum"
        />
      </div>
      <!-- Current Game State (for debugging  and remote connection) -->
      <div class="status-section">        
        <h3>Current Game State </h3>
        <p>For remote connection.</p>
        <pre>{{ JSON.stringify(currentGame, null, 2) }}</pre>  
      </div>
      <!-- Session Statistics -->
      <SessionStats
        :stats="sessionStats"
        :hostPlayer="hostPlayer"
        :guestPlayer="guestPlayer"
      />      
      <!-- Games History -->
      <GamesHistory :games="gamesHistory" />
    </div>
  </div>
</template>
