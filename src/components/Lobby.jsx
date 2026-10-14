import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { getOnlineUsers, logout } from '../services/authService.js';

function Lobby({ user, onLogout, onStartGame }) {
  const [onlineUsers, setOnlineUsers] = useState([]); // [{id, name}]
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [loadingInvite, setLoadingInvite] = useState(false);

  const { sendMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'online_users') {
        setOnlineUsers(data.users || []);
      }
      if (data.type === 'game_invitation') {
        setIncomingInvite(data);
      }
    }
  });

  useEffect(() => {
    getOnlineUsers().then(setOnlineUsers).catch(console.error);
  }, []);

  const handleRefresh = () => sendMessage({ type: 'list_users' });

  const handleInvite = async () => {
    if (!selectedOpponent) return;
    const opponent = onlineUsers.find((u) => u.id === selectedOpponent);
    try {
      setLoadingInvite(true);
      const newMatch = await createGameplay(user.id, selectedOpponent);
      sendMessage({
        type: 'invite_player',
        targetUserId: selectedOpponent,
        matchId: newMatch.id
      });
      onStartGame('online', {
        host: user,
        guest: opponent || { id: selectedOpponent, name: 'Oponent' },
        matchId: newMatch.id
      });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error start the game');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleAcceptInvite = () => {
    if (!incomingInvite) return;
    onStartGame('online', {
      host: { id: incomingInvite.hostId, name: incomingInvite.hostName },
      guest: user,
      matchId: incomingInvite.matchId
    });
    setIncomingInvite(null);
  };

  // Excluirse a sí mismo
  const opponents = onlineUsers.filter((u) => u.id !== user.id);

  return (
    <div className="container">
      <div className="game-card">
        <h1>Lobby</h1>
        <p>Bienvenido, <strong>{user.name}</strong> ({user.email})</p>

        {/* Notificación de invitación recibida */}
        {incomingInvite && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid #3375dfa7',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
              {incomingInvite.hostName} invite you play tic tac toe, do you accept?
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button
                className="start-game-button"
                style={{ padding: '0.4rem 1rem', width: 'auto' }}
                onClick={handleAcceptInvite}
              >
                Aceptar y Jugar
              </button>
              <button
                className="reset-button"
                style={{ padding: '0.4rem 1rem' }}
                onClick={() => setIncomingInvite(null)}
              >
                Rechazar
              </button>
            </div>
          </div>
        )}

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
          disabled={!selectedOpponent || loadingInvite}
          onClick={handleInvite}
        >
          {loadingInvite ? 'Creating game...' : 'Invite to play'}
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