import React from 'react';

function GameStateDebug({ currentPositions, matchResults, id, updateDate }) {
  return (
    <div className="game-info">
      <details>
        <summary>Game state (Remote Synch)</summary>
        <div className="game-data">
          <p><strong>Game ID:</strong> {id || 'Not assigned'}</p>
          <p><strong>Last Updated:</strong> {new Date(updateDate).toLocaleTimeString()}</p>
          
          <div className="state-structure">
            <strong>State:</strong>
            <pre className="json-preview">
              {JSON.stringify({
                currentPositions: currentPositions,
                matchResults: matchResults,
                id: id,
                updateDate: updateDate
              }, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    </div>
  );
}

export default GameStateDebug;
