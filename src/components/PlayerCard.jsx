import React from 'react';

function PlayerCard({
  player,
  icon,
  iconClass,
  moves,
  sum,
  label,
  orderNumber,
  isTurn
}) {
  if (!player) return null;
  return (
    <div className="player-card" style={isTurn ? { outline: '2px solid #6366f1', borderRadius: '12px', padding: '0.75rem' } : { padding: '0.75rem' }}>
      <div className={`player-icon ${iconClass}`}>
        <span>{icon}</span>
      </div>
      <p className="player-name">{player.name}</p>
      {orderNumber && (
        <span style={{ fontSize: '0.8rem', color: '#6f7ad5ff', fontWeight: 'bold', display: 'block', margin: '0.2rem 0' }}>
          Orden {orderNumber} {isTurn ? '• Jugando' : ''}
        </span>
      )}
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
