import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic.jsx';
import { getUser, logout } from './services/authService.js';
import Login from './components/Login.jsx';
import Lobby from './components/Lobby.jsx';
import PlayerRegistration from './components/PlayerRegistration.jsx';
import Game from './components/Game.jsx';

function App() {
  const [user, setUser] = useState(getUser());
  const [screen, setScreen] = useState(user ? 'lobby' : 'login'); // login | lobby | local

  const {
    players,
    sessionStats,
    gamesHistory,
    board,
    currentPositions,
    matchResult,
    id,
    updateDate,
    hostSum,
    guestSum,
    currentPlayerName,
    isHostTurn,
    handlePlayersRegistered,
    handleClick,
    resetGame,
    changePlayers
  } = useGameLogic();

  if (!user) {
    return <Login onLogin={(u) => { setUser(u); setScreen('lobby'); }} />;
  }

  if (screen === 'lobby') {
    return (
      <Lobby
        user={user}
        onLogout={() => { logout(); setUser(null); setScreen('login'); }}
        onStartGame={(mode) => {
          if (mode === 'local') setScreen('local');
          // mode === 'online' se implementará en la sigueinte fase
        }}
      />
    );
  }

  if (screen === 'local') {
    if (!players.hostPlayer || !players.guestPlayer) {
      return <PlayerRegistration onPlayersRegistered={handlePlayersRegistered} />;
    }

    return (
      <Game
        players={players}
        currentPositions={currentPositions}
        matchResult={matchResult}
        id={id}
        updateDate={updateDate}
        board={board}
        hostSum={hostSum}
        guestSum={guestSum}
        currentPlayerName={currentPlayerName}
        isHostTurn={isHostTurn}
        sessionStats={sessionStats}
        gamesHistory={gamesHistory}
        onCellClick={handleClick}
        onResetGame={resetGame}
        onChangePlayers={() => { changePlayers(); setScreen('lobby'); }}
      />
    );
  }

  return null;
}

export default App;