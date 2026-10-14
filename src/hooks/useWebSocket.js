import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import { wsConnectionAtom } from '../store.js';
import * as wsService from '../services/wsService.js';

export const useWebSocket = (handlers = {}) => {
  const [wsConnection, setWsConnection] = useAtom(wsConnectionAtom);
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    wsService.connectWebSocket({
      onOpen: () => setWsConnection((prev) => ({ ...prev, isConnected: true })),
      onClose: () => setWsConnection((prev) => ({ ...prev, isConnected: false }))
    });

    const unsubscribe = wsService.addMessageListener((data) => {
      setWsConnection((prev) => ({ ...prev, lastMessage: data }));
      handlersRef.current.onMessage?.(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const sendMessage = (data) => wsService.sendMessage(data);

  return { wsConnection, sendMessage };
};