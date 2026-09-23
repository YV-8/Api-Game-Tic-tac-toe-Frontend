import React from 'react';

function PlayerCard({ 
  player, 
  icon, 
  iconClass, 
  moves, 
  sum, 
  label 
}) {
  return (
    <div className="player-card">
      <div className={`player-icon ${iconClass}`}>
        <span>{icon}</span>
      </div>
      <p className="player-name">{player.name}</p>
      <p className="player-email">{player.email}</p>
      <div className="moves-info">
        Sum: {sum}
      </div>
      <div className="moves-list">
        {moves.length > 0 ? moves.join(', ') : 'Without moves yet'}
      </div>
    </div>
  );
}

export default PlayerCard;
