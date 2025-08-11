import { Server } from 'socket.io';
import { createServer } from 'http';
import { setupAuth } from './handlers/auth/authHandler';
import { setupFriendsHandlers } from './handlers/friends/friendsHandler';
import { setupMessagingHandlers } from './handlers/messaging/messagingHandler';
import { setupTeamHandlers } from './handlers/team/teamHandler';
import { setupStatusHandlers } from './handlers/status/statusHandler';
import { handleDisconnect } from './handlers/disconnect/disconnectHandler';
import { activeUsers } from './store/userStore';

export const initSocket = (server: ReturnType<typeof createServer>) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Setup authentication middleware
    setupAuth(io);

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.emit('auth_success', {
            userId: socket.userId,
            username: socket.user?.username,
        });

        // Setup all handlers
        setupFriendsHandlers(socket, io, activeUsers);
        setupMessagingHandlers(socket, io, activeUsers);
        setupTeamHandlers(socket, io, activeUsers);
        setupStatusHandlers(socket, io, activeUsers);

        // Handle disconnection
        socket.on('disconnect', (reason) => handleDisconnect(socket, io, activeUsers, reason));

        // Handle errors
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    });

    return io;
};
