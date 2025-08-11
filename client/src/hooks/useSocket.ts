import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface ServerToClientEvents {
    onlineUsers: any;
    userStatusChange: any;
    privateMessage: any;
    roomMessage: any;
}

export interface ClientToServerEvents {
    joinRoom: (roomId: string) => void;
    privateMessage: (data: { recipientId: string; message: string }) => void;
}

export function useSocket(token: string | undefined) {
    const [isConnected, setIsConnected] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const socketRef = useRef<
        Socket<ServerToClientEvents, ClientToServerEvents> | undefined
    >(undefined);

    /** tiny helper to prepend a new line to the log */
    const log = (msg: string, payload?: unknown) =>
        setLogs((prev) => [
            `[${new Date().toLocaleTimeString()}] ${msg}${payload ? ': ' + JSON.stringify(payload) : ''
            }`,
            ...prev,
        ]);

    useEffect(() => {
        if (!token) return; // wait until the user has pasted one

        const socket = io(import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3000', {
            auth: { token },
            transports: ['websocket'],
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            log(`✅ connected (id = ${socket.id})`);
        });

        socket.on('connect_error', (err) => log(`⚠️ connect_error`, err.message));
        socket.on('disconnect', (reason) => {
            setIsConnected(false);
            log(`❌ disconnected`, reason);
        });

        // --- server‑side custom events -----------------------
        socket.on('onlineUsers', (d) => log('onlineUsers', d));
        socket.on('userStatusChange', (d) => log('userStatusChange', d));
        socket.on('privateMessage', (d) => log('privateMessage', d));
        socket.on('roomMessage', (d) => log('roomMessage', d));

        return () => {
            socket.disconnect();
        };
    }, [token]);

    /** convenience wrappers you can expose to components */
    const joinRoom = (roomId: string) => {
        socketRef.current?.emit('joinRoom', roomId);
        log(`➡️ joinRoom '${roomId}' emitted`);
    };

    const sendPM = (recipientId: string, message: string) => {
        socketRef.current?.emit('privateMessage', { recipientId, message });
        log(`➡️ privateMessage emitted`);
    };

    return { isConnected, logs, joinRoom, sendPM };
}
