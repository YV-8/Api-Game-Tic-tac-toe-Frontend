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
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
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