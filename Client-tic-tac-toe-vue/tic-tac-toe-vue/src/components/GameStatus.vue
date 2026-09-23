<script setup>
/**
 * GameStatus component - shows current game status (turn, winner, draw)
 */
defineProps({
  currentGame: {
    type: Object,
    required: true
  },
  resultMatch: {
    type: [String, null],
    default: null
  },
  currentPlayer: {
    type: [Object, null],
    default: null
  },
  winner: {
    type: [Object, null],
    default: null
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
.status {
  margin-bottom: 15px;
  padding: 16px;
  border-radius: 12px;
  background: #f9fafb;
  text-align: center;
}

.winner-message p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #059669;
  margin: 0;
}

.draw-message p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #6b7280;
  margin: 0;
}

.turn-message p {
  font-size: 1.25rem;
  color: #374151;
  margin: 0;
}

.player-name {
  font-weight: bold;
}

.hostPlayer-color {
  color: #9333ea;
}

.guestPlayer-color {
  color: #2563eb;
}
</style>

<template>
  <div class="status">    
    <div v-if="winner" class="winner-message">
      <p>{{ winner.name }} wins!</p>
    </div>    
    
    <div v-else-if="resultMatch === 'draw'" class="draw-message">
      <p>Draw game!</p>
    </div>    
    
    <div v-else class="turn-message">
      <p>
        Current turn: 
        <span 
          class="player-name"
          :class="{
            'hostPlayer-color': currentPlayer?.id === hostPlayer?.id,
            'guestPlayer-color': currentPlayer?.id === guestPlayer?.id
          }"
        >
          {{ currentPlayer?.name }}
        </span>
      </p>
    </div>    
  </div>  
</template>
