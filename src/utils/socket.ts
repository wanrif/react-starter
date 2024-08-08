import { io, Socket } from 'socket.io-client';
import customParser from 'socket.io-msgpack-parser';

const URL = 'http://localhost:8080/chat';

const socket: Socket = io(URL, {
  path: '/chat/ws',
  addTrailingSlash: false,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 3,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 5000,
  transports: ['polling', 'websocket'],
  upgrade: true,
  parser: customParser,
});

export const connectSocket = (token: string) => {
  socket.auth = { token };
  socket.connect();
};

export default socket;
