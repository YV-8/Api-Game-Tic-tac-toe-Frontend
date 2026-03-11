<script setup>
/**
 * SessionStats component - shows cumulative statistics for the current session
 */
defineProps({
  stats: {
    type: Object,
    required: true
  },
  hostPlayer: {
    type: Object,
    required: true
  },
  guestPlayer: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.stats-section {
  margin-bottom: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-section h3 {
  margin: 0 0 16px;
  color: #1f2937;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-label {
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-weight: bold;
  font-size: 1.125rem;
  color: #1f2937;
}

.hostPlayer-color {
  color: purple;
}

.guestPlayer-color {
  color: blue;
}
</style>
<template>
  <div v-if="stats.gamesPlayed > 0" class="stats-section">
    <h3>Session Statistics</h3>
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-label">Games:</span>
        <span class="stat-value">{{ stats.gamesPlayed }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">{{ hostPlayer.name }}:</span>
        <span class="stat-value hostPlayer-color">{{ stats.hostPlayerWins }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">{{ guestPlayer.name }}:</span>
        <span class="stat-value guestPlayer-color">{{ stats.guestPlayerWins }}</span>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">Draws:</span>
        <span class="stat-value">{{ stats.draws }}</span>
      </div>
    </div>
  </div>
</template>
