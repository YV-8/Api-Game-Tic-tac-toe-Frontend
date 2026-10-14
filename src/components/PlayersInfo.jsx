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
  guestSum,
  orderPlay,
  myOrderPlay
}) {
  return (
    <div className="players-info">
      {/* Host player (X) - Orden 1 */}
      <PlayerCard
        player={hostPlayer}
        icon="X"
        iconClass="player-icon-host"
        moves={hostPlayerMoves}
        sum={hostSum}
        label="Host Player"
        orderNumber={1}
        isTurn={orderPlay === 1}
      />

      {/* Guest player (O) - Orden 2 */}
      <PlayerCard
        player={guestPlayer}
        icon="O"
        iconClass="player-icon-guest"
        moves={guestPlayerMoves}
        sum={guestSum}
        label="Guest Player"
        orderNumber={2}
        isTurn={orderPlay === 2}
      />
    </div>
  );
}

export default PlayersInfo;
