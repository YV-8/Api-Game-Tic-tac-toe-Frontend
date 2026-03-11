<template>
  <div id="app">
    <!-- Show registration if no players -->
    <PlayerRegistration v-if="!hasPlayers" />
    
    <!-- Show game if players are registered -->
    <Game v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameStore } from './stores/gameStore.js';
import PlayerRegistration from './components/PlayerRegistration.vue';
import Game from './components/Game.vue';

const gameStore = useGameStore();

/**
 * Check if players are registered
 */
const hasPlayers = computed(() => gameStore.hasPlayers);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
