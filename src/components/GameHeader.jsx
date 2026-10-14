import React from 'react';

function GameHeader({ onChangePlayers, onBackToMenu }) {
  return (
    <div className="game-header">
      <div>
        <h1 className="title">Tic Tac Toe</h1>        
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={onBackToMenu || onChangePlayers} className="change-players-button">
          Menú
        </button>
        <button onClick={onChangePlayers} className="change-players-button">
          Cambiar jugadores
        </button>
      </div>
    </div>
  );
}

export default GameHeader;
