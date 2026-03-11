# Tic Tac Toe

A modern, Tic Tac Toe game built with Vue 3, using the magic square algorithm for winner detection.

## Features

- **Magic Square Algorithm** - Elegant winner detection using mathematical properties
- **Player Registration** - Register two players with name and email
- **Session Statistics** - Track wins, losses, and draws
- **Games History** - Review all played games in the session
- **Real-time Updates** - Instant board updates using Vue reactivity
- **Docker Support** - Easy deployment with Docker
- **State info** - State debug info for backend synchronization.

## Tech Stack

- Vue 3 - Progressive JavaScript framework with Composition API
- Vite - Next generation frontend tooling
- Pinia - Official state management for Vue
- Docker - Containerization for consistent deployment

## Installation

### Option 1: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Option 2: Docker Compose (Recommended)

```bash
# Development mode
docker compose -f compose.yml up dev

# Production mode
docker compose -f compose.yml up prod
```

### Option 3: Docker Manual

```bash
# Development
docker build -f Dockerfile.dev -t tic-tac-toe-vue:dev .
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules tic-tac-toe-vue:dev

# Production
docker build -t tic-tac-toe-vue:prod .
docker run -p 8080:80 tic-tac-toe-vue:prod
```

## Project Structure

```
src/
├── main.js                 # Application entry point
├── App.vue                 # Root component
├── components/             # Vue components
│   ├── PlayerRegistration.vue  # Player registration form
│   ├── Game.vue                # Main game container
│   ├── GameBoard.vue           # 3x3 game board
│   ├── GameStatus.vue          # Turn/winner display
│   ├── PlayerCard.vue          # Player information card
│   ├── SessionStats.vue        # Statistics display
│   └── GamesHistory.vue        # Games history
├── stores/                 # Pinia stores
│   └── gameStore.js            # Main game state management
└── utils/                  # Utility functions
    ├── magicSquare.js          # Magic square configuration
    └── gameLogic.js            # Game logic utilities
```

## How It Works

### Magic Square Algorithm

The game uses a 3x3 magic square where every row, column, and diagonal sums to 15:

```
2  7  6
9  5  1
4  3  8
```

When a player makes 3 moves that sum to 15, he/shee win.

### State Management with Pinia

```javascript
// Simple and intuitive state management
const gameStore = useGameStore();

// Access state
gameStore.board
gameStore.currentPlayer
gameStore.winner

// Call actions
gameStore.makeMove(position);
gameStore.resetGame();
```

## Game Flow

1. Registration - Two players register with name and email
2. Host player - Host player (X) makes first move
3. Guest player - Guest player (O) makes their move
4. Winner Check - After each move, check if sum equals 15
5. Game End - Display winner or draw, update statistics
6. New Game - Reset board, keep same players


### Modify Magic Square

Edit `src/utils/magicSquare.js`:

```javascript
export const MAGIC_SQUARE = [
  [2, 7, 6],
  [9, 5, 1],
  [4, 3, 8]
];
```

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Docker Deployment

```bash
# Build production image
docker build -t tic-tac-toe-vue:latest .

# Run container
docker run -d -p 80:80 tic-tac-toe-vue:latest
```

## Development Tips

### Vue Devtools
Install Vue Devtools browser extension for debugging:
- Inspect component tree
- View Pinia store state
- Track events

### Debugging Store
```javascript
// In any component
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();
console.log(gameStore.$state); // View entire state
```

## Code Examples

### Accessing State
```javascript
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';

const gameStore = useGameStore();
const board = computed(() => gameStore.board);
const winner = computed(() => gameStore.winner);
```

### Creating Computed Properties
```javascript
const currentPlayer = computed(() => {
  return gameStore.currentGame.currentPlayerId === gameStore.players.player1?.id
    ? gameStore.players.player1
    : gameStore.players.player2;
});
```


## References

- [Vue 3 Documentation](https://vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Composition API Guide](https://vuejs.org/guide/extras/composition-api-faq.html)

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or commercial purposes.
