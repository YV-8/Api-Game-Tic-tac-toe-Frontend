<script setup>
/**
 * GameBoard component - displays the tic-tac-toe board
 */
const props = defineProps({  
  board: {
    type: Array,
    required: true
  },
  winningLine: {
    type: Array,
    default: () => []
  },
  isGameOver: {
    type: Boolean,
    default: false
  },
  hostPlayerId: {
    type: String,
    required: true
  },
  guestPlayerId: {
    type: String,
    required: true
  }
});

/**
 * Emits
 */
const emit = defineEmits(['cellClick']);

/**
 * Handle cell click
 */
const onCellClick = (index) => {
  emit('cellClick', index);
};
</script>

<style scoped>
.game-board {
  margin-bottom: 10px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  place-items: center;;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 15px;
  max-width: 300px;
  width: 50%;
  margin: 0 auto;
}

.cell {
  aspect-ratio: 1;
  border: none;
  border-radius: 12px;
  font-size: 3rem;
  font-weight: bold;
  cursor: pointer;
  background: #f3f4f6;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background: #e5e7eb;
}

.cell:disabled {
  cursor: not-allowed;
}

.cell-hostPlayer {
  background: #f3e8ff;
  color: #9333ea;
}

.cell-guestPlayer {
  background: #dbeafe;
  color: #2563eb;
}

.winning-cell {  
  background: #fef3c7 !important;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.cell-content {
  font-size: 3rem;
  font-weight: bold;
  position: relative;
  z-index: 2;
}

.magic-number {
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: normal;
  z-index: 1;
}

.cell-empty:hover .magic-number {
  display: none;
}
</style>
<template>
  <div class="game-board">
    <div class="board">
      <button
        v-for="(cell, index) in board"
        :key="index"
        class="cell"
        :class="{
          'cell-hostPlayer': cell?.playerId === hostPlayerId,
          'cell-guestPlayer': cell?.playerId === guestPlayerId,
          'winning-cell': winningLine.includes(index),
          'cell-empty': !cell && !isGameOver
        }"
        :disabled="cell !== null || isGameOver"
        @click="onCellClick(index)"
      >
        <!-- Symbol (X or O) -->
        <span v-if="cell" class="cell-content">
          {{ cell.symbol }}
        </span>
      </button>
    </div>
  </div>  
</template>

