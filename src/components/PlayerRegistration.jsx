import React, { useState } from 'react';
import { validatePlayer } from '../gameLogic.js';

function PlayerRegistration({ onPlayersRegistered, onBackToMenu }) {
  const [host, setHost] = useState({ name: '', email: '' });
  const [guest, setGuest] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ host: {}, guest: {} });

  const handleSubmit = (e) => {
    e.preventDefault();
    const hostValidation = validatePlayer(host);
    const guestValidation = validatePlayer(guest);

    if (!hostValidation.isValid || !guestValidation.isValid) {
      setErrors({
        host: hostValidation.errors,
        guest: guestValidation.errors
      });
      return;
    }

    if (host.email.toLowerCase() === guest.email.toLowerCase()) {
      setErrors({
        host: {},
        guest: { email: 'Players must have different emails' }
      });
      return;
    }

    onPlayersRegistered({
      hostPlayer: host,
      guestPlayer: guest
    });
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">Player registration</h1>
        <p className="registration-subtitle">
          Enter players' details to begin the game. The first player will be "X" and the second will be "O".
        </p>

        <form onSubmit={handleSubmit} className="registration-form">
          {/* Host player */}
          <div className="player-section">
            <h2 className="player-section-title">
              <span className="player-badge player-badge-x">X</span>
              Host Player
            </h2>

            <div className="form-group">
              <label htmlFor="host-name">Name</label>
              <input
                id="host-name"
                type="text"
                placeholder="G.E.: Jhon Doe"
                value={host.name}
                onChange={(e) => setHost({ ...host, name: e.target.value })}
                className={errors.host.name ? 'input-error' : ''}
              />
              {errors.host.name && (
                <span className="error-message">{errors.host.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="host-email">Email</label>
              <input
                id="host-email"
                type="email"
                placeholder="Ej: jhondoe@mail.com"
                value={host.email}
                onChange={(e) => setHost({ ...host, email: e.target.value })}
                className={errors.host.email ? 'input-error' : ''}
              />
              {errors.host.email && (
                <span className="error-message">{errors.host.email}</span>
              )}
            </div>
          </div>

          {/* Guest player */}
          <div className="player-section">
            <h2 className="player-section-title">
              <span className="player-badge player-badge-o">O</span>
              Guest Player
            </h2>

            <div className="form-group">
              <label htmlFor="guest-name">Name</label>
              <input
                id="guest-name"
                type="text"
                placeholder="G.E.: Sandra Dee"
                value={guest.name}
                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
                className={errors.guest.name ? 'input-error' : ''}
              />
              {errors.guest.name && (
                <span className="error-message">{errors.guest.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="guest-email">Email</label>
              <input
                id="guest-email"
                type="email"
                placeholder="Ej: sandradee@mail.com"
                value={guest.email}
                onChange={(e) => setGuest({ ...guest, email: e.target.value })}
                className={errors.guest.email ? 'input-error' : ''}
              />
              {errors.guest.email && (
                <span className="error-message">{errors.guest.email}</span>
              )}
            </div>
          </div>

          <button type="submit" className="start-game-button">
            Start Game
          </button>
          {onBackToMenu && (
            <button
              type="button"
              onClick={onBackToMenu}
              className="reset-button"
              style={{ marginTop: '0.75rem', width: '100%' }}
            >
              Volver al Menú
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default PlayerRegistration;
