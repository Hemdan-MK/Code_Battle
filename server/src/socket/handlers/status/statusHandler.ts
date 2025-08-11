// socket/status/statusHandler.ts
import { Socket, Server } from 'socket.io';
import User from '../../../models/User';
import { IActiveUser } from '../../store/userStore';

export const setupStatusHandlers = (socket: Socket, io: Server, activeUsers: Map<string, IActiveUser>) => {

    // Handle status updates
    socket.on('update_status', async (data) => {
        try {
            const { userId, status, currentGame } = data;

            // Validate that userId matches the authenticated user
            if (userId !== socket.userId) {
                return;
            }

            const userInfo = activeUsers.get(userId);

            if (userInfo) {
                userInfo.status = status;
                if (currentGame && currentGame !== 'Online') {
                    userInfo.currentGame = currentGame as "In Game" | "Available";
                }

                // Update in database
                await User.findByIdAndUpdate(userId, {
                    status,
                    currentGame,
                    lastSeen: new Date()
                });

                // Broadcast status update to friends
                const user = await User.findById(userId).populate('friends', '_id');
                if (user && user.friends) {
                    const friendIds = user.friends.map((friend: any) => friend._id.toString());

                    friendIds.forEach((friendId: string) => {
                        const friendInfo = activeUsers.get(friendId);
                        if (friendInfo) {
                            io.to(friendInfo.socketId).emit('friend_status_update', {
                                userId,
                                status,
                                game: currentGame,
                                username: userInfo.username
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    });

    // Handle authentication errors
    socket.on('connect_error', (error) => {
        console.error('Connection error:', error.message);
        socket.emit('auth_error', { message: error.message });
    });

    // Handle user logout
    socket.on('user_logout', async (data) => {
        try {
            const { userId } = data;

            if (userId !== socket.userId) {
                return;
            }

            console.log(`User ${userId} is logging out`);

            // Update user status to offline in database
            await User.findByIdAndUpdate(userId, {
                status: 'offline',
                lastSeen: new Date()
            });

            // Get user's friends to notify them
            const user = await User.findById(userId).populate('friends', '_id');

            if (user && user.friends) {
                const friendIds = user.friends.map((friend: any) => friend._id.toString());

                // Notify all friends that this user went offline
                friendIds.forEach((friendId: string) => {
                    const friendInfo = activeUsers.get(friendId);
                    if (friendInfo) {
                        io.to(friendInfo.socketId).emit('friend_status_update', {
                            userId,
                            status: 'offline',
                            lastSeen: new Date(),
                            username: activeUsers.get(userId)?.username || 'Unknown'
                        });
                    }
                });
            }

            // Remove user from active users map
            activeUsers.delete(userId);

            // Confirm logout to client
            socket.emit('logout_confirmed', {
                message: 'Successfully logged out'
            });

            // Disconnect the socket
            socket.disconnect(true);

        } catch (error) {
            console.error('Error handling user logout:', error);
            socket.emit('logout_error', {
                message: 'Failed to process logout properly'
            });
        }
    });
};