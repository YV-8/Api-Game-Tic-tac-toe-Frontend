import React from 'react';

/**
 * GamesHistory component displays a collapsible list of past games with details.
 */
function GamesHistory({ games }) {

  if (games.length === 0) return null;

  return (
    <div className="games-history-section">
      <details>
        <summary>Games History ({games.length})</summary>
        <div className="games-history-list">
          {games.map((game, idx) => {
            // Player winner logic
            const isHostWinner = game.matchResult === game.hostPlayer.id;
            const isGuestWinner = game.matchResult === game.guestPlayer.id;
            const winnerName = isHostWinner 
              ? game.hostPlayer.name 
              : (isGuestWinner ? game.guestPlayer.name : null);

            return (
              <div key={game.id} className="history-item">                
                <div className="history-header">
                  <span className="history-number">#{games.length - idx}</span>
                  <span className="history-date">
                    {new Date(game.fecha).toLocaleString()}
                  </span>
                </div>

                <div className="history-players">
                  <span className="host-player">
                    {game.hostPlayer.name}
                  </span>
                  {' vs '}
                  <span className="guest-player">
                    {game.guestPlayer.name}
                  </span>
                </div>

                {/* matchResult */}
                <div className="history-result">
                  {game.matchResult === 'draw' ? (
                    <span className="result-draw">Draw</span>
                  ) : (
                    <span className={
                      isHostWinner ? 'result-host' : 'result-invitado'
                    }>
                      Ganador: {winnerName}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </details>
    </div>
  );
}

export default GamesHistory;
