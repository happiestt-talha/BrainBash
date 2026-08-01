import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect_error', (err) => {
      toast.error(`Connection error: ${err.message}`);
    });

    socket.on('error', (err) => {
      toast.error(`Socket error: ${err.message || 'Unknown error'}`);
    });
  }
  return socket;
}