import { closeWebSocket } from './wsService.js';

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const defaultApiUrl = isHttps ? 'https://localhost:5001' : 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || defaultApiUrl;

export const register = async (name, email, password) => {
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err.message || (err.errors ? Object.values(err.errors).flat().join('. ') : 'Error al registrar');
    throw new Error(message);
  }
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err.message || (err.errors ? Object.values(err.errors).flat().join('. ') : 'Credenciales inválidas');
    throw new Error(message);
  }
  const data = await res.json();
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
  return data;
};

export const createGameplay = async (hostPlayerId, guestPlayerId) => {
  const res = await authFetch('/api/gameplays', {
    method: 'POST',
    body: JSON.stringify({
      hostPlayer: hostPlayerId,
      guestPlayer: guestPlayerId,
      playerTurn: hostPlayerId,
      orderPlay: 1,
      currentPositions: JSON.stringify({
        hostPlayerMoves: [],
        guestPlayerMoves: [],
        playerTurnId: hostPlayerId,
        orderPlay: 1,
        winningLine: []
      })
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Error al crear partida en el servidor');
  }
  return res.json();
};

export const getToken = () => localStorage.getItem('token');
export const getUser = () => {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
};

export const logout = () => {
  closeWebSocket();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const authFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
  return fetch(`${API_URL}${url}`, { ...options, headers });
};

export const getOnlineUsers = async () => {
  const res = await authFetch('/api/users/online');
  if (!res.ok) throw new Error('Error al obtener usuarios en línea');
  return res.json();
};