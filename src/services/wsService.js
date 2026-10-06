/**
 * WebSocket service that manages the connection to the game server
 * Keeps the socket instance in a module-level variable
 */

let socket = null;

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

// Opens the WebSocket connection and wires up event handling
// onMessage is called with the parsed payload for every message received
// onOpen/onClose are called when the connection actually opens/closes
export const connectWebSocket = ({ onMessage, onOpen, onClose } = {}) => {
  console.info('Connecting to WS server at', WS_URL);
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.info('WS connection established');
    if (onOpen) {
      onOpen();
    }
  };

  socket.onmessage = (event) => {
    console.info('WS message received:', event.data);
    if (onMessage) {
      onMessage(event.data);
    }
  };

  socket.onerror = (error) => {
    console.info('WS connection error:', error);
  };

  socket.onclose = () => {
    console.info('WS connection closed');
    socket = null;
    if (onClose) {
      onClose();
    }
  };

  return socket;
};

// Sends a message through the open WebSocket connection
export const sendMessage = (data) => {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.info('Cannot send message, WS is not connected');
    return;
  }
  socket.send(data);
};

// Closes the WebSocket connection if it's open
export const closeWebSocket = () => {
  if (socket) {
    socket.close();
  }
};

// Returns whether the WebSocket connection is currently open
export const isWebSocketConnected = () => {
  return socket !== null && socket.readyState === WebSocket.OPEN;
};