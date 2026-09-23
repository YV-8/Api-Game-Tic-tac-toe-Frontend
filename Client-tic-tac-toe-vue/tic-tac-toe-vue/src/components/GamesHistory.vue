<script setup>
/**
 * GamesHistory component - shows list of past games
 */
const props = defineProps({
  games: {
    type: Array,
    default: () => []
  }
});

/**
 * Format date to locale string
 */
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Get winner name from game
 */
const getWinnerName = (game) => {
  return game.resultMatch === game.hostPlayer.id 
    ? game.hostPlayer.name 
    : game.guestPlayer.name;
};
</script>

<style scoped>
.history-section {
  margin-bottom: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

details {
  cursor: pointer;
}

summary {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
}

summary:hover {
  background: #f9fafb;
}

.history-list {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
}

.history-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.history-number {
  font-weight: bold;
  color: #1f2937;
}

.history-date {
  color: #6b7280;
  font-size: 0.875rem;
}

.history-players {
  margin-bottom: 8px;
  color: #374151;
}

.hostPlayer-color {
  font-weight: 600;
  color: #9333ea;
}

.guestPlayer-color {
  font-weight: 600;
  color: #2563eb;
}

.history-result {
  font-weight: 600;
  font-size: 0.875rem;
}

.result-hostPlayer {
  color: #9333ea;
}

.result-guestPlayer {
  color: #2563eb;
}

.result-draw {
  color: #6b7280;
}
</style>

<template>
  <div v-if="games.length > 0" class="history-section">
    <details>
      <summary>Games History ({{ games.length }})</summary>
      <div class="history-list">
        <div 
          v-for="(game, index) in games" 
          :key="game.id"
          class="history-item"
        >
          <div class="history-header">
            <span class="history-number">#{{ games.length - index }}</span>
            <span class="history-date">
              {{ formatDate(game.date) }}
            </span>
          </div>
          
          <div class="history-players">
            <span class="hostPlayer-color">{{ game.hostPlayer.name }}</span>
            vs
            <span class="guestPlayer-color">{{ game.guestPlayer.name }}</span>
          </div>
          
          <div class="history-result">
            <span 
              v-if="game.resultMatch === 'draw'" 
              class="result-draw"
            >
              Draw
            </span>
            <span 
              v-else
              :class="{
                'result-hostPlayer': game.resultMatch === game.hostPlayer.id,
                'result-guestPlayer': game.resultMatch === game.guestPlayer.id
              }"
            >
              Winner: {{ getWinnerName(game) }}
            </span>
          </div>
        </div>
      </div>
    </details>
  </div>
</template>
