import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { wsConnectionAtom } from '../store.js';
import * as wsService from '../services/wsService.js';

/**
 * Custom hook to handle the WebSocket connection lifecycle
 * Connects on mount, closes on unmount, and keeps connection
 * state and last received message in sync with global state
 */
export const useWebSocket = () => {
  const [wsConnection, setWsConnection] = useAtom(wsConnectionAtom);

  useEffect(() => {
    wsService.connectWebSocket({
      onMessage: (data) => {
        setWsConnection((prev) => ({ ...prev, lastMessage: data }));
      },
      onOpen: () => {
        setWsConnection((prev) => ({ ...prev, isConnected: true }));
      },
      onClose: () => {
        setWsConnection((prev) => ({ ...prev, isConnected: false }));
      }
    });

    return () => {
      wsService.closeWebSocket();
    };
  }, []);

  const sendMessage = (data) => {
    wsService.sendMessage(data);
  };

  return {
    wsConnection,
    sendMessage
  };
};