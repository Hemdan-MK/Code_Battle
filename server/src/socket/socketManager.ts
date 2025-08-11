// socket/socketManager.ts
import { Server } from 'socket.io';
import { setupAuth } from './auth/authHandler';
import { setupFriendsHandlers } from './friends/friendsHandler';
import { setupMessagingHandlers } from './messaging/messagingHandler';
import { setupTeamHandlers } from './team/teamHandler';
import { setupStatusHandlers } from './status/statusHandler';
import { handleDisconnect } from './disconnect/disconnectHandler';
import { activeUsers } from './store/userStore';

export const setupSocketHandlers = (io: Server) => {
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
};