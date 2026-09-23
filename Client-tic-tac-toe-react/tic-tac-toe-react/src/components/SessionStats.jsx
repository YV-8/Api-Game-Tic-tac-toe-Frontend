import React from 'react';

/**
 * Component that displays current session statistics.
 * Only visible if at least one match has been played.
 */
function SessionStats({ stats, hostPlayer, guestPlayer }) {  
  if (stats.gamesPlayed === 0) return null;

  return (
    <div className="stats-section">
      <h3>Sesion statistics</h3>
      <div className="stats-grid">
        {/* total matches */}
        <div className="stat-item">
          <span className="stat-label">Matches:</span>
          <span className="stat-value">{stats.gamesPlayed}</span>
        </div>
        
        {/* Host wins */}
        <div className="stat-item">
          <span className="stat-label">{hostPlayer.name}:</span>
          <span className="stat-value host-player">
            {stats.hostPlayerWins}
          </span>
        </div>
        
        {/* Guest wins */}
        <div className="stat-item">
          <span className="stat-label">{guestPlayer.name}:</span>
          <span className="stat-value guest-player">
            {stats.guestPlayerWins}
          </span>
        </div>
        
        {/* Draws */}
        <div className="stat-item">
          <span className="stat-label">Draws:</span>
          <span className="stat-value">{stats.draws}</span>
        </div>
      </div>
    </div>
  );
}

export default SessionStats;
