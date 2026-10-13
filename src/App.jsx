import React, { useState } from 'react';
import { useGameLogic } from './hooks/useGameLogic.jsx';
import { useWebSocket } from './hooks/useWebSocket.js';
import { getUser, logout } from './services/authService.js';
import Login from './components/Login.jsx';
import Lobby from './components/Lobby.jsx';
import PlayerRegistration from './components/PlayerRegistration.jsx';
import Game from './components/Game.jsx';

function App() {
  const [user, setUser] = useState(getUser());
  const [screen, setScreen] = useState(user ? 'lobby' : 'login'); // login | lobby | local | online
  const [onlineData, setOnlineData] = useState(null); // { host, guest, matchId, isHost }

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
    orderPlay,
    handlePlayersRegistered,
    handleClick,
    resetGame,
    changePlayers
  } = useGameLogic();
  const myOrderPlay = screen === 'online' ? (onlineData?.isHost ? 1 : 2) : null;
  const currentOrderPlay = currentPositions.orderPlay || 1;
  const isMyTurn = screen === 'online' ? currentOrderPlay === myOrderPlay : true;

  // Escuchar movimientos del rival por WebSocket
  const { sendMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'opponent_move') {
        console.info('[WS] Movimiento en tiempo real recibido de rival en posición:', data.position, 'order:', data.orderPlay);
        handleClick(data.position, data.orderPlay);
      }
      if (data.type === 'game_reset') {
        console.info('[WS] El rival reinició la partida');
        resetGame();
      }
    }
  });

  const handleCellClick = (position) => {
    if (screen === 'online') {
      if (!isMyTurn) {
        console.warn('No es tu turno de jugar.');
        return;
      }
      const success = handleClick(position, myOrderPlay);
      if (success) {
        const targetUserId = onlineData?.isHost ? onlineData?.guest.id : onlineData?.host.id;
        if (targetUserId) {
          sendMessage({
            type: 'game_move',
            targetUserId,
            position,
            orderPlay: myOrderPlay
          });
        }
      }
    } else {
      handleClick(position);
    }
  };

  const handleResetGame = () => {
    resetGame();
    if (screen === 'online') {
      const targetUserId = onlineData?.isHost ? onlineData?.guest.id : onlineData?.host.id;
      if (targetUserId) {
        sendMessage({
          type: 'reset_game',
          targetUserId
        });
      }
    }
  };

  if (!user) {
    return <Login onLogin={(u) => { setUser(u); setScreen('lobby'); }} />;
  }

  if (screen === 'lobby') {
    return (
      <Lobby
        user={user}
        onLogout={() => { logout(); setUser(null); setScreen('login'); }}
        onStartGame={(mode, gameInfo) => {
          if (mode === 'local') {
            setOnlineData(null);
            setScreen('local');
          } else if (mode === 'online' && gameInfo) {
            setOnlineData(gameInfo);
            handlePlayersRegistered({
              hostPlayer: {
                name: gameInfo.host.name,
                email: gameInfo.host.email || `${gameInfo.host.name.toLowerCase()}@game.com`,
                id: gameInfo.host.id
              },
              guestPlayer: {
                name: gameInfo.guest.name,
                email: gameInfo.guest.email || `${gameInfo.guest.name.toLowerCase()}@game.com`,
                id: gameInfo.guest.id
              }
            });
            setScreen('online');
          }
        }}
      />
    );
  }

  if (screen === 'local' || screen === 'online') {
    if (screen === 'local' && (!players.hostPlayer || !players.guestPlayer)) {
      return (
        <PlayerRegistration
          onPlayersRegistered={handlePlayersRegistered}
          onBackToMenu={() => setScreen('lobby')}
        />
      );
    }

    // Nombre a mostrar indicando si es tu turno y el orden de juego
    const displayTurnName = screen === 'online'
      ? `${currentPlayerName} (Orden ${currentOrderPlay}) ${isMyTurn ? '(¡Tu turno!)' : '(Esperando rival...)'}`
      : `${currentPlayerName} (Orden ${currentOrderPlay})`;

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
        currentPlayerName={displayTurnName}
        isHostTurn={isHostTurn}
        orderPlay={currentOrderPlay}
        myOrderPlay={myOrderPlay}
        sessionStats={sessionStats}
        gamesHistory={gamesHistory}
        onCellClick={handleCellClick}
        onResetGame={handleResetGame}
        onChangePlayers={() => { changePlayers(); setScreen('lobby'); }}
        onBackToMenu={() => { changePlayers(); setScreen('lobby'); }}
      />
    );
  }

  return null;
}

export default App;