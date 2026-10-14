import React, { useEffect, useState } from 'react';
import { useWebSocket } from '../hooks/useWebSocket.js';
import { getOnlineUsers, logout, createGameplay } from '../services/authService.js';

function Lobby({ user, onLogout, onStartGame }) {
  const [onlineUsers, setOnlineUsers] = useState([]); // [{id, name}]
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [incomingInvite, setIncomingInvite] = useState(null);
  const [waitingResponse, setWaitingResponse] = useState(null); // { opponentName, matchId, targetUserId }
  const [inviteError, setInviteError] = useState('');
  const [loadingInvite, setLoadingInvite] = useState(false);

  const { sendMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'online_users') {
        setOnlineUsers(data.users || []);
      }
      if (data.type === 'game_invitation') {
        setIncomingInvite(data);
      }
      if (data.type === 'invite_accepted') {
        // El invitado aceptó: armar el tablero para el anfitrión
        if (waitingResponse) {
          const opponent = onlineUsers.find((u) => u.id === data.guestId) || { id: data.guestId, name: data.guestName };
          setWaitingResponse(null);
          onStartGame('online', {
            host: user,
            guest: opponent,
            matchId: data.matchId,
            isHost: true
          });
        }
      }
      if (data.type === 'invite_rejected') {
        setWaitingResponse(null);
        setInviteError('El jugador rechazó la invitación para jugar.');
      }
      if (data.type === 'invite_cancelled') {
        setIncomingInvite(null);
      }
    }
  });

  useEffect(() => {
    getOnlineUsers().then(setOnlineUsers).catch(console.error);
  }, []);

  const handleRefresh = () => {
    setInviteError('');
    sendMessage({ type: 'list_users' });
  };

  const handleInvite = async () => {
    setInviteError('');
    if (!selectedOpponent) {
      setInviteError('Por favor selecciona un jugador de la lista antes de invitar.');
      return;
    }

    const opponent = onlineUsers.find((u) => u.id === selectedOpponent);
    const opponentName = opponent?.name || 'Oponente';

    try {
      setLoadingInvite(true);
      // Crear la partida en el servidor
      const newMatch = await createGameplay(user.id, selectedOpponent);

      // Notificar por WebSocket al oponente
      sendMessage({
        type: 'invite_player',
        targetUserId: selectedOpponent,
        matchId: newMatch.id
      });

      // Pasar a la vista de espera (Wait) hasta que el otro jugador acepte
      setWaitingResponse({
        opponentName,
        matchId: newMatch.id,
        targetUserId: selectedOpponent
      });
    } catch (err) {
      console.error(err);
      setInviteError(err.message || 'Error al enviar la invitación');
    } finally {
      setLoadingInvite(false);
    }
  };

  const handleCancelInvite = () => {
    if (waitingResponse) {
      sendMessage({
        type: 'cancel_invite',
        targetUserId: waitingResponse.targetUserId
      });
      setWaitingResponse(null);
    }
  };

  const handleAcceptInvite = () => {
    if (!incomingInvite) return;
    sendMessage({
      type: 'accept_invite',
      hostId: incomingInvite.hostId,
      matchId: incomingInvite.matchId
    });

    onStartGame('online', {
      host: { id: incomingInvite.hostId, name: incomingInvite.hostName },
      guest: user,
      matchId: incomingInvite.matchId,
      isHost: false
    });
    setIncomingInvite(null);
  };

  const handleRejectInvite = () => {
    if (!incomingInvite) return;
    sendMessage({
      type: 'reject_invite',
      hostId: incomingInvite.hostId
    });
    setIncomingInvite(null);
  };

  // Excluirse a sí mismo
  const opponents = onlineUsers.filter((u) => u.id !== user.id);

  // Vista de espera (Wait View)
  if (waitingResponse) {
    return (
      <div className="container">
        <div className="game-card" style={{ textAlign: 'center' }}>
          <h1>Esperando al rival...</h1>
          <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
            Se ha enviado la invitación a <strong>{waitingResponse.opponentName}</strong>.
          </p>
          <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>
            Esperando a que acepte para armar el tablero e iniciar la partida.
          </p>
          <button onClick={handleCancelInvite} className="reset-button" style={{ marginTop: '1.5rem' }}>
            Cancelar invitación
          </button>
        </div>
      </div>
    );
  }

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
              ¡{incomingInvite.hostName} te invitó a jugar una partida!
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
                onClick={handleRejectInvite}
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
                    onChange={() => {
                      setSelectedOpponent(u.id);
                      setInviteError('');
                    }}
                  />
                  <span><strong>{u.name}</strong> <small>({u.id.substring(0, 8)}...)</small></span>
                </label>
              </li>
            ))}
          </ul>
        )}

        {inviteError && (
          <span className="error-message" style={{ display: 'block', margin: '0.75rem 0', color: '#ef4444' }}>
            {inviteError}
          </span>
        )}

        <button
          className="start-game-button"
          disabled={!selectedOpponent || loadingInvite}
          onClick={handleInvite}
        >
          {loadingInvite ? 'Creando partida...' : 'Invitar a jugar'}
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