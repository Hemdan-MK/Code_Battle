import React, { useState, useEffect, useMemo } from 'react';
import { socket } from '../socket';
import { SocketContext } from './socketDefinition';
import { getToken } from '../utils/tokenUtils';

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        function onConnect() {
            console.log('Socket connected on client!');
            setIsConnected(true);
            socket.emit('client_ready');
        }

        function onDisconnect() {
            console.log('Socket disconnected on client!');
            setIsConnected(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // If a token exists, attempt to connect the socket.
        // The socket will use the auth function to get the latest token.
        if (getToken()) {
            socket.connect();
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    const contextValue = useMemo(() => ({ socket, isConnected }), [isConnected]);

    return (
        <SocketContext.Provider value={contextValue}>
            {children}
        </SocketContext.Provider>
    );
};
