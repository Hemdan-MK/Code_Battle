import { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { socket } from '../socket';

interface ISocketContext {
    socket: Socket;
    isConnected: boolean;
}

export const SocketContext = createContext<ISocketContext>({
    socket,
    isConnected: false,
});
