import { getToken } from './authService.js';

let socket = null;
let currentHandlers = {};
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

export const connectWebSocket = ({ onMessage, onOpen, onClose } = {}) => {
  if (socket && (socket.readyState === WebSocket.OPEN ||
                 socket.readyState === WebSocket.CONNECTING)) {
    console.info('[WS] Reutilizando conexión existente');
    currentHandlers = { onMessage, onOpen, onClose };
    return socket;
  }

  const token = getToken();
  if (!token) {
    console.warn('[WS] Sin token, no se puede conectar');
    return null;
  }

  const url = `${WS_URL}?token=${encodeURIComponent(token)}`;
  console.info('[WS] Conectando a', url);
  currentHandlers = { onMessage, onOpen, onClose };

  const newSocket = new WebSocket(url);
  socket = newSocket;

  newSocket.onopen = () => {
    console.info('[WS] Conexión establecida');
    currentHandlers.onOpen?.();
  };
  newSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.info('[WS] Mensaje recibido:', data);
      currentHandlers.onMessage?.(data);
    } catch {
      console.warn('[WS] Mensaje no es JSON:', event.data);
    }
  };
  newSocket.onerror = (err) => console.error('[WS] Error:', err);
  newSocket.onclose = () => {
    console.info('[WS] Conexión cerrada');
    if (socket === newSocket) socket = null;
    currentHandlers.onClose?.();
  };

  return newSocket;
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