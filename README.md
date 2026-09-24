# Tic Tac Toe - React

A modern take on the classic Tic-Tac-Toe game. This project focuses on clean state management and an algorithmic approach to win-condition validation.

## Features

- Local Multiplayer: Play with a partner in the same session.
- Minimalist Design: Clean UI featuring a sleek Purple and Blue color palette.
- Smooth Animations: Fluid transitions for an engaging user experience.
- Magic Square Validation: High-performance win-condition logic using a 3x3 Magic Square algorithm.
- Win Detection: Automatic identification and announcement of the winner.
- Draw Detection: Intelligent logic to identify tie games instantly.
- Session Analytics: Track real-time stats (matches played, wins, and draws).
- Move History: Full log of every move made during the match.
- Scalable Architecture: Codebase prepared for future remote/online multiplayer integration.
- Responsive Design: Fully optimized for mobile, tablet, and desktop screens.
- Ultra-fast Builds: Powered by Vite for a lightning-fast development experience.
- Dockerized: Ready for consistent deployment using Docker containers.

## Magic square

A 3x3 Magic Square is a matrix where each position contains a unique number from 1 to 9, and the sum of every row, column, and diagonal is exactly 15.

```
2  7  6
9  5  1
4  3  8
```

## Installation and Usage

### Option 1: Local Installation with npm

#### Pre-requisites
- Node.js (v18+)
- npm

#### Config steps

1. Clone repository   

2. Install dependencies
   ```bash
   npm install
   ```

#### Commands list

**Dev mode**:
```bash
npm run dev
```
Go to `http://localhost:3000`

**Production build**:
```bash
npm run build
```
Production files will be generated in path `dist/`

**Production preview**:
```bash
npm run preview
```
### Opción 2: Docker

#### Pre-requisites
- Docker
- Docker Compose (included in Docker)

#### With Docker Compose

**Dev mode**:
```bash
docker compose -f compose.yml up dev
```
Go to: `http://localhost:3000`

**Production**:
```bash
docker compose -f compose.yml up prod -d
```
Go to: `http://localhost:8080`

Stop:
```bash
docker compose -f compose.yml down
```

#### Using docker

**Build & Run - Dev mode**:
```bash
# Build
docker build -f Dockerfile.dev -t tic-tac-toe:dev .

# Run
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules tic-tac-toe:dev
```

**Build & Run - Production**:
```bash
# Build
docker build -t tic-tac-toe:prod .

# Run
docker run -p 8080:80 tic-tac-toe:prod
```

## Project structure

```
tic-tac-toe-app/
├── public/                     # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── Game.js           # Main Container
│   │   ├── GameBoard.js      # Game board
│   │   ├── GameHeader.js     # Header
│   │   ├── GameStatus.js     # Game state for remote connection
│   │   ├── GamesHistory.js   # Games history
│   │   ├── PlayerCard.js     # Player card
│   │   ├── PlayerRegistration.js # Register form for players
│   │   ├── PlayersInfo.js        # Player information
│   │   ├── SessionStats.js       # Game sesion state
│   │   └── GameStateDebug.js     # Game state dd
│   ├── hooks/
│   │   └── useGameLogic.js   # Custom hook
│   ├── services/
│   │   └── gameService.js    # Bussines Logic
│   ├── App.js                
│   ├── gameLogic.js          # Utils
│   ├── store.js              # Global state (Jotai)
│   ├── index.js              # Entry point
│   └── styles.css            # Styles
├── index.html                # main HTML
├── vite.config.js            # Vite configuration
├── Dockerfile                # Docker producction
├── Dockerfile.dev            # Docker development
├── compose.yml               # Docker orchestation
├── nginx.conf                # Nginx configuration
├── .dockerignore             # Docker ignore files
├── package.json              # Dependencies and 3d party
└── README.md                 # this fille.
```

## Environment variables (optional)

Add a file `.env` at main path:

```env
VITE_API_URL=http://localhost:4000
VITE_ENVIRONMENT=development
```

Inside the code, add:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Production deploy

### Docker Hub

```bash
# Build
docker build -t user-path/tic-tac-toe:latest .

# Push
docker push user-path/tic-tac-toe:latest

# Pull and run in a server
docker pull user-path/tic-tac-toe:latest
docker run -p 80:80 user-path/tic-tac-toe:latest
```

## How to play

1. Register Players: Enter a name and email for both players to start.
2. First Turn: Player X (Host) always goes first.
3. Magic Square Values: Every cell on the grid is assigned a unique number from the Magic Square.
4. Win Condition: The first player to select three tiles that sum up to 15 wins the match.
5. Draw Condition: If the board is full and no player has reached a sum of 15, the game ends in a draw.
6. New Game: Use the "New Game" button to start a fresh match with the current players.
7. Reset Players: Use "Change Players" to clear the session and register new participants.

## License
MIT
