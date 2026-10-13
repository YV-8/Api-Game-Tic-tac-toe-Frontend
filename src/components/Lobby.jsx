import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { getOnlineUsers, logout } from '../services/authService.js';

function Lobby({ user, onLogout, onStartGame }) {
  const [onlineUsers, setOnlineUsers] = useState([]); // [{id, name}]
  const [selectedOpponent, setSelectedOpponent] = useState(null);

  const { sendMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'online_users') {
        setOnlineUsers(data.users || []);
      }
    }
  });

  useEffect(() => {
    getOnlineUsers().then(setOnlineUsers).catch(console.error);
  }, []);

  const handleRefresh = () => sendMessage({ type: 'request_online_users' });

  const handleInvite = () => {
    if (!selectedOpponent) return;
    console.info('TODO Fase 2: invitar a', selectedOpponent);
  };

  // Excluirse a sí mismo
  const opponents = onlineUsers.filter((u) => u.id !== user.id);

  return (
    <div className="container">
      <div className="game-card">
        <h1>Lobby</h1>
        <p>Bienvenido, <strong>{user.name}</strong> ({user.email})</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={handleRefresh} className="reset-button">
            Refrescar usuarios
          </button>
          <button onClick={onLogout} className="reset-button">
            Cerrar sesión
          </button>
        </div>

        <h2>Usuarios en línea ({opponents.length})</h2>
        {opponents.length === 0 ? (
          <p>No hay otros usuarios conectados.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {opponents.map((u) => (
              <li key={u.id} style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="radio"
                    name="opponent"
                    value={u.id}
                    checked={selectedOpponent === u.id}
                    onChange={() => setSelectedOpponent(u.id)}
                  />
                  <span><strong>{u.name}</strong> <small>({u.id.substring(0, 8)}...)</small></span>
                </label>
              </li>
            ))}
          </ul>
        )}

        <button
          className="start-game-button"
          disabled={!selectedOpponent}
          onClick={handleInvite}
        >
          Invitar a jugar
        </button>

        <button
          className="start-game-button"
          style={{ marginTop: '1rem' }}
          onClick={() => onStartGame('local')}
        >
          Jugar modo local (sin red)
        </button>
      </div>
    </div>
  );
}

export default Lobby;