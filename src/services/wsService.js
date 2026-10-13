import { getToken } from './authService.js';

let socket = null;
const messageListeners = new Set();
const openListeners = new Set();
const closeListeners = new Set();

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
const defaultWsUrl = isHttps ? 'wss://localhost:5001/ws' : 'ws://localhost:5000/ws';
const WS_URL = import.meta.env.VITE_WS_URL || defaultWsUrl;

export const connectWebSocket = ({ onMessage, onOpen, onClose } = {}) => {
  if (onMessage) messageListeners.add(onMessage);
  if (onOpen) openListeners.add(onOpen);
  if (onClose) closeListeners.add(onClose);

  if (socket && (socket.readyState === WebSocket.OPEN ||
                 socket.readyState === WebSocket.CONNECTING)) {
    return socket;
  }

  const token = getToken();
  if (!token) {
    console.warn('[WS] Sin token, no se puede conectar');
    return null;
  }

  const url = `${WS_URL}?token=${encodeURIComponent(token)}`;
  console.info('[WS] Conectando a', url);

  const newSocket = new WebSocket(url);
  socket = newSocket;

  newSocket.onopen = () => {
    console.info('[WS] Conexión establecida');
    openListeners.forEach(fn => fn());
  };
  newSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.info('[WS] Mensaje recibido:', data);
      messageListeners.forEach(fn => fn(data));
    } catch {
      console.warn('[WS] Mensaje no es JSON:', event.data);
    }
  };
  newSocket.onerror = (err) => console.error('[WS] Error:', err);
  newSocket.onclose = () => {
    console.info('[WS] Conexión cerrada');
    if (socket === newSocket) socket = null;
    closeListeners.forEach(fn => fn());
  };

  return newSocket;
};

export const addMessageListener = (listener) => {
  messageListeners.add(listener);
  return () => messageListeners.delete(listener);
};

export const sendMessage = (data) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn('[WS] No se puede enviar, no conectado');
    return;
  }
  socket.send(typeof data === 'string' ? data : JSON.stringify(data));
};

export const closeWebSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.close();
  }
};