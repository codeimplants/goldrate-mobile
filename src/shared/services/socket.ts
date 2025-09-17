import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: Socket | null = null;
const API_BASE = 'http://192.168.1.103:3000';

export async function connectSocket(): Promise<Socket> {
  const token = await AsyncStorage.getItem('token');

  if (!socket) {
    socket = io(API_BASE, {
      transports: ['websocket'],
      auth: { token: token || '' },   // ✅ backend expects auth.token
    });

    socket.on('connect', () => {
      console.log('✅ RN Socket connected! ID:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.log('❌ RN Socket connect error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ RN Socket disconnected:', reason);
    });

    (globalThis as any).__socket = socket;
  } else {
    socket.auth = { token: token || '' } as any;  // ✅ update token dynamically
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
