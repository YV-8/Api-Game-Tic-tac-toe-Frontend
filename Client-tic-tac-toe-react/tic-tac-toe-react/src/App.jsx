import React from 'react';
import { useGameLogic } from './hooks/useGameLogic.jsx';
import PlayerRegistration from './components/PlayerRegistration.jsx';
import Game from './components/Game.jsx';

function App() {

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
    
    // Funtions to handle game logic
    handlePlayersRegistered,
    handleClick,
    resetGame,
    changePlayers
  } = useGameLogic();

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
      onChangePlayers={changePlayers}
    />
  );
}

export default App;
