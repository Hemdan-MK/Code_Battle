import React, { createContext } from 'react';
import { Socket } from 'socket.io-client';
import { socket } from '../socket';

interface ISocketContext {
    socket: Socket;
}

export const SocketContext = createContext<ISocketContext>({
    socket,
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};
