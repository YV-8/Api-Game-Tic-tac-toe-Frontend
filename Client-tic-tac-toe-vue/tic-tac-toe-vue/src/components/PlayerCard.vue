<script setup>
/**
 * PlayerCard component - shows player info, moves, and stats
 */
defineProps({
  player: {
    type: Object,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  iconClass: {
    type: String,
    required: true
  },
  moves: {
    type: Array,
    default: () => []
  },
  sum: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.player-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.player-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.player-icon-hostPlayer {
  background: #f3e8ff;
  color: #9333ea;
}

.player-icon-guestPlayer {
  background: #dbeafe;
  color: #2563eb;
}

.player-info h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.125rem;
}

.player-email {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.player-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.stat-value {
  font-weight: bold;
  color: #1f2937;
}

.moves-display {
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 0.875rem;
}

.moves-label {
  color: #6b7280;
  font-weight: 500;
}

.moves-values {
  color: #1f2937;
  margin-left: 8px;
}
</style>

<template>
  <div class="player-card">
    <div class="player-header">
      <div class="player-icon" :class="iconClass">
        {{ symbol }}
      </div>
      <div class="player-info">
        <h3>{{ player.name }}</h3>
        <p class="player-email">{{ player.email }}</p>
      </div>
    </div>
    
    <div class="player-stats">
      <div class="stat-item">
        <span class="stat-label">Moves:</span>
        <span class="stat-value">{{ moves.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Sum:</span>
        <span class="stat-value">{{ sum }}</span>
      </div>
    </div> 
    <!-- Display moves -->
    <div v-if="moves.length > 0" class="moves-display">
      <span class="moves-label">Values:</span>
      <span class="moves-values">{{ moves.join(', ') }}</span>
    </div>
  </div>
</template>
