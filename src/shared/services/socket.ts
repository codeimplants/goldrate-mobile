import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../../constant';


let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem('token');

  if (!socket) {
    socket = io(API_BASE, {
      transports: ['websocket'],
      auth: { token },
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket?.id);
    });

    socket.on('disconnect', reason => {
      console.log('⚠️ Socket disconnected:', reason);
    });
  } else {
    socket.auth = { token } as any;
    if (!socket.connected) socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
