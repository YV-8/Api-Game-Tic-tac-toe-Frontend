import React from 'react';

/**
 * Component that displays the current game status:
 * - Current player's turn
 * - Winner message
 * - Draw/Tie message
 */
function GameStatus({ matchResult, currentPlayerName, isHostTurn, hostPlayer, guestPlayer }) {
  if (matchResult && matchResult !== 'draw') {
    const winnerName = matchResult === hostPlayer.id
      ? hostPlayer.name 
      : guestPlayer.name;
    
    return (
      <div className="status">
        <div className="winner-message">
          <p>{winnerName} wins!</p>
        </div>
      </div>
    );
  }

  // Draw game
  if (matchResult === 'draw') {
    return (
      <div className="status">
        <div className="draw-message">
          <p>It's a draw!</p>
        </div>
      </div>
    );
  }
 
  const colorClase = isHostTurn ? 'host-player' : 'guest-player';
  
  return (
    <div className="status">
      <p className="turn-message">
        Turn of: 
        <span className={colorClase}>
          {' '}{currentPlayerName}
        </span>
      </p>
    </div>
  );
}

export default GameStatus;
