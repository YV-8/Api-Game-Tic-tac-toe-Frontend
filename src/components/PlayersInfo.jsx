import React from 'react';
import PlayerCard from './PlayerCard.jsx';

/**
 * Component that displays information about both players, including their names, moves, and sums.
 */
function PlayersInfo({ 
  hostPlayer, 
  guestPlayer, 
  hostPlayerMoves, 
  guestPlayerMoves,
  hostSum,
  guestSum
}) {
  return (
    <div className="players-info">
      {/* Host player (X) */}
      <PlayerCard
        player={hostPlayer}
        icon="X"
        iconClasss="player-icon-host"
        moves={hostPlayerMoves}
        sum={hostSum}
        label="Host Player"
      />
      
      {/* Guest player (O) */}
      <PlayerCard
        player={guestPlayer}
        icon="O"
        iconClass="player-icon-guest"
        moves={guestPlayerMoves}
        sum={guestSum}
        label="Guest Player"
      />
    </div>
  );
}

export default PlayersInfo;
