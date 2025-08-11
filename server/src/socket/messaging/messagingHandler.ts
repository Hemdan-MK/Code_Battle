// socket/messaging/messagingHandler.ts
import { Socket, Server } from 'socket.io';
import { IActiveUser } from '../store/userStore';

export const setupMessagingHandlers = (socket: Socket, io: Server, activeUsers: Map<string, IActiveUser>) => {

    // Handle private messages
    socket.on('send_private_message', (data) => {
        const { senderId, receiverId, message, timestamp } = data;

        // Validate that senderId matches the authenticated user
        if (senderId !== socket.userId) {
            socket.emit('message_error', { message: 'Unauthorized message send' });
            return;
        }

        const senderInfo = activeUsers.get(senderId);

        if (senderInfo) {
            const messageData = {
                id: Date.now().toString(),
                senderId,
                receiverId,
                message,
                timestamp,
                senderName: senderInfo.username,
                senderAvatar: senderInfo.currentAvatar
            };

            // Send to receiver if they're online
            const receiverInfo = activeUsers.get(receiverId);
            if (receiverInfo) {
                io.to(receiverInfo.socketId).emit('receive_private_message', messageData);
            }

            // Send back to sender for confirmation
            socket.emit('message_sent', messageData);

            console.log(`Message from ${senderInfo.username} to ${receiverId}: ${message}`);
        }
    });

    // Handle typing indicators
    socket.on('typing_start', (data) => {
        const { senderId, receiverId } = data;

        if (senderId !== socket.userId) {
            return;
        }

        const receiverInfo = activeUsers.get(receiverId);
        const senderInfo = activeUsers.get(senderId);

        if (receiverInfo && senderInfo) {
            io.to(receiverInfo.socketId).emit('user_typing', {
                userId: senderId,
                username: senderInfo.username,
                isTyping: true
            });
        }
    });

    socket.on('typing_stop', (data) => {
        const { senderId, receiverId } = data;

        if (senderId !== socket.userId) {
            return;
        }

        const receiverInfo = activeUsers.get(receiverId);
        const senderInfo = activeUsers.get(senderId);

        if (receiverInfo && senderInfo) {
            io.to(receiverInfo.socketId).emit('user_typing', {
                userId: senderId,
                username: senderInfo.username,
                isTyping: false
            });
        }
    });
};