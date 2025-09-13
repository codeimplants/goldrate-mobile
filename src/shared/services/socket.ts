import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: Socket | null = null;

const API_BASE = 'https://broadcast-info-be.onrender.com';

export async function connectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem('token');

  if (!socket) {
    socket = io(API_BASE, {
      transports: ['websocket'],
      withCredentials: true,
      auth: { token: token || '' },
    });
    ;(globalThis as any).__socket = socket;
  } else {
    socket.auth = { token: token || '' } as any;
    if (!socket.connected) socket.connect();
  }

  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}


