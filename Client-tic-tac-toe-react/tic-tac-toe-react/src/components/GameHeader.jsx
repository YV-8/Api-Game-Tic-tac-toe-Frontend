import React from 'react';

function GameHeader({ onChangePlayers }) {
  return (
    <div className="game-header">
      <div>
        <h1 className="title">Tic Tac Toe</h1>        
      </div>
      <button onClick={onChangePlayers} className="change-players-button">
        Change players
      </button>
    </div>
  );
}

export default GameHeader;
