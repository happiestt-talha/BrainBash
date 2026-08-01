'use client';

import { useEffect, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';

// Thin wrapper — only handles connection lifecycle. All event listeners
// live in useMatchState, not here, to avoid duplicate subscriptions.
export function useSocket() {
  const socketRef = useRef<Socket>(getSocket());

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket.connected) socket.connect();

    return () => {
      // deliberately NOT disconnecting on unmount — a component remount
      // (e.g. navigating lobby -> match page) shouldn't drop the connection
      // mid-match. Disconnect happens explicitly on logout or match end.
    };
  }, []);

  return socketRef.current;
}