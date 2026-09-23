<script setup>
/**
 * PlayerRegistration component - form to register players before starting the game
 */
import { ref } from 'vue';
import { useGameStore } from '../stores/gameStore.js';
import { validatePlayer } from '../utils/gameLogic.js';
const gameStore = useGameStore();

// Form data
const hostPlayer = ref({
  name: '',
  email: ''
});

const guestPlayer = ref({
  name: '',
  email: ''
});

// Validation errors
const errors = ref({
  hostPlayer: null,
  guestPlayer: null
});

/**
 * Handle form submission
 */
const handleSubmit = () => {
  // Reset errors
  errors.value = {
    hostPlayer: null,
    guestPlayer: null
  };
  
  // Validate players
  const hostPlayerValidation = validatePlayer(hostPlayer.value);
  const guestPlayerValidation = validatePlayer(guestPlayer.value);
  
  if (!hostPlayerValidation.isValid) {
    errors.value.hostPlayer = hostPlayerValidation.errors;
  }
  
  if (!guestPlayerValidation.isValid) {
    errors.value.guestPlayer = guestPlayerValidation.errors;
  }
  
  if (hostPlayerValidation.isValid && guestPlayerValidation.isValid) {
    gameStore.registerPlayers(hostPlayer.value, guestPlayer.value);
  }
};
</script>

<style scoped>
.registration-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, blue 0%, purple 100%);
  padding: 20px;
}

.registration-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  text-align: center;
  color: #1f2937;
  margin-bottom: 5px;
  font-size: 2.5rem;
}

.subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 5px;
}

.player-section {
  margin-bottom: 15px;
  padding: 15px;
  background: #f9fafb;
  border-radius: 12px;
}

.player-section h3 {
  color: #374151;
  margin-bottom: 5px;
}

.form-group {
  margin-bottom: 5px;
}

label {
  display: block;
  color: #374151;
  font-weight: 500;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  border-color: blue;
}

.input-error {
  border-color: #ef4444;
}

.error-message {
  display: block;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 4px;
}

.submit-button {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, blue 0%, purple 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.submit-button:hover {
  transform: translateY(-2px);
}
</style>

<template>
  <div class="registration-container">
    <div class="registration-card">
      <h1>Tic Tac Toe</h1>
      <p class="subtitle">Register players to start playing</p>
      
      <form @submit.prevent="handleSubmit">
        <!-- Player 1 -->
        <div class="player-section">
          <h3>Host Player (X)</h3>          
          <div class="form-group">
            <label for="hostPlayer-name">Name</label>
            <input
              id="hostPlayer-name"
              v-model="hostPlayer.name"
              type="text"
              placeholder="Enter name"
              :class="{ 'input-error': errors.hostPlayer?.name }"
            />
            <span v-if="errors.hostPlayer?.name" class="error-message">
              {{ errors.hostPlayer.name }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="hostPlayer-email">Email</label>
            <input
              id="hostPlayer-email"
              v-model="hostPlayer.email"
              type="email"
              placeholder="Enter email"
              :class="{ 'input-error': errors.hostPlayer?.email }"
            />
            <span v-if="errors.hostPlayer?.email" class="error-message">
              {{ errors.hostPlayer.email }}
            </span>
          </div>
        </div>
        
        <!-- Player 2 -->
        <div class="player-section">
          <h3>Guest Player (O)</h3>          
          <div class="form-group">
            <label for="guestPlayer-name">Name</label>
            <input
              id="guestPlayer-name"
              v-model="guestPlayer.name"
              type="text"
              placeholder="Enter name"
              :class="{ 'input-error': errors.guestPlayer?.name }"
            />
            <span v-if="errors.guestPlayer?.name" class="error-message">
              {{ errors.guestPlayer.name }}
            </span>
          </div>
          
          <div class="form-group">
            <label for="guestPlayer-email">Email</label>
            <input
              id="guestPlayer-email"
              v-model="guestPlayer.email"
              type="email"
              placeholder="Enter email"
              :class="{ 'input-error': errors.guestPlayer?.email }"
            />
            <span v-if="errors.guestPlayer?.email" class="error-message">
              {{ errors.guestPlayer.email }}
            </span>
          </div>
        </div>
        
        <button type="submit" class="submit-button">
          Start Game
        </button>
      </form>
    </div>
  </div>
</template>
