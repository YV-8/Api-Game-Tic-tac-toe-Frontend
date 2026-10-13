import React, { useState } from 'react';
import { login, register } from '../services/authService.js';

function Login({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación estricta de email (debe contener @ y dominio como .com)
    const emailRegex = /^[^@\s]+@[^@\s]+\.(com|net|org|edu|gov|mil|io|es|ar|co|cl|uy|mx|pe|info|biz|[a-zA-Z]{2,})$/i;
    if (!emailRegex.test(form.email.trim())) {
      setError('El email debe contener un "@" y un dominio válido como .com (ej: usuario@gmail.com).');
      return;
    }

    // Validación de límites seguros (BCrypt max 72 bytes)
    if (form.password.length < 6 || form.password.length > 72) {
      setError('La contraseña debe tener entre 6 y 72 caracteres (límite de seguridad).');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password);
      }
      const data = await login(form.email, form.password);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-card">
        <h1 className="registration-title">
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h1>
        <p className="registration-subtitle">
          {mode === 'login'
            ? 'Ingresa con tu cuenta para jugar en línea'
            : 'Regístrate para jugar en línea con otros usuarios'}
        </p>

        <form onSubmit={handleSubmit} className="registration-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                placeholder="Ej: Jhon Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={50}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Ej: jhon@mail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="Entre 6 y 72 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
              maxLength={72}
            />
            <small style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.8rem', color: '#6b7280' }}>
              Límite de seguridad: 6 a 72 caracteres ({form.password.length}/72)
            </small>
          </div>

          {error && <span className="error-message">{error}</span>}

          <button type="submit" className="start-game-button" disabled={loading}>
            {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarme'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          style={{ marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}

export default Login;