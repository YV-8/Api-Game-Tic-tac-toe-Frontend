import React from 'react';
import { getMagicValue } from '../store.js';

/**
 * GameBoard component renders the tic-tac-toe grid and handles cell interactions.
 */
function GameBoard({ board, winningLine, matchResult, isMyTurn = true, onCellClick }) {
  return (
    <div className="board">
      {board.map((cellValue, index) => { 
        const isHost = cellValue === 'X';
        const isGuest = cellValue === 'O';
        const isWinning = winningLine.includes(index);
        const isEmpty = !cellValue && !matchResult;
        
        const cellClasses = `
          cell
          ${isHost ? 'host-cell' : ''}
          ${isGuest ? 'guest-cell' : ''}
          ${isWinning ? 'winning-cell' : ''}
          ${isEmpty ? 'cell-empty' : ''}
        `;

        return (
          <button
            key={index}
            onClick={() => onCellClick(index)}
            className={cellClasses}
            disabled={cellValue !== null || matchResult !== null || !isMyTurn}
            style={!isMyTurn && isEmpty ? { cursor: 'not-allowed', opacity: 0.5 } : {}}
            title={!isMyTurn && isEmpty ? 'Esperando el turno del rival...' : ''}
          >
            {/* X or O */}
            <span className={cellValue ? 'cell-content' : ''}>
              {cellValue}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default GameBoard;
