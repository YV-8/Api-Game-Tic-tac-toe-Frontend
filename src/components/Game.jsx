import React from 'react';
import GameHeader from './GameHeader.jsx';
import GameStatus from './GameStatus.jsx';
import GameBoard from './GameBoard.jsx';
import PlayersInfo from './PlayersInfo.jsx';
import SessionStats from './SessionStats.jsx';
import GamesHistory from './GamesHistory.jsx';
import GameStateDebug from './GameStateDebug.jsx';

/**
 * Main game container component.
 * Organizes and coordinates all sub-components.
 */
function Game({
  players,
  currentPositions,
  matchResult,
  id,
  updateDate,
  board,
  hostSum,
  guestSum,
  currentPlayerName,
  isHostTurn,
  sessionStats,
  gamesHistory,
  onCellClick,
  onResetGame,
  onChangePlayers
}) {
  return (
    <div className="container">
      <div className="game-card">
        <GameHeader onChangePlayers={onChangePlayers} />        
        <GameStatus
          matchResult={matchResult}
          currentPlayerName={currentPlayerName}
          isHostTurn={isHostTurn}
          hostPlayer={players.hostPlayer}
          guestPlayer={players.guestPlayer}
        />

        <GameBoard
          board={board}
          winningLine={currentPositions.winningLine}
          matchResult={matchResult}
          onCellClick={onCellClick}
        />

        <button onClick={onResetGame} className="reset-button">
          New Game
        </button>

        <PlayersInfo
          hostPlayer={players.hostPlayer}
          guestPlayer={players.guestPlayer}
          hostPlayerMoves={currentPositions.hostPlayerMoves}
          guestPlayerMoves={currentPositions.guestPlayerMoves}
          hostSum={hostSum}
          guestSum={guestSum}
        />

        <SessionStats
          stats={sessionStats}
          hostPlayer={players.hostPlayer}
          guestPlayer={players.guestPlayer}
        />

        <GamesHistory games={gamesHistory} />

        <GameStateDebug
          currentPositions={currentPositions}
          matchResult={matchResult}
          id={id}
          updateDate={updateDate}
        />
      </div>
    </div>
  );
}

export default Game;
