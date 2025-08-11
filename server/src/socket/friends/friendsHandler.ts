// socket/friends/friendsHandler.ts
import { Socket, Server } from 'socket.io';
import { Types } from 'mongoose';
import mongoose from 'mongoose';
import User from '../../models/User';
import { IActiveUser } from '../store/userStore';

const isValidObjectId = (id: string): boolean => {
    return Types.ObjectId.isValid(id) && (String(new Types.ObjectId(id)) === id);
};

export const setupFriendsHandlers = (socket: Socket, io: Server, activeUsers: Map<string, IActiveUser>) => {
    
    socket.on('get_Details', async () => {
        try {
            const userId = socket.userId;

            if (!userId || !isValidObjectId(userId)) {
                socket.emit('error', {
                    message: 'Invalid user ID format or userId.'
                });
                return;
            }

            const user = await User.findById(userId).exec();

            if (!user) {
                socket.emit('connect_error', {
                    message: 'User not found. Please log in again.'
                });
                return;
            }

            socket.emit('detail_resp', { user });

        } catch (error) {
            console.error('Error fetching details:', error);
            socket.emit('error', {
                message: 'Failed to load details. Please try again.'
            });
        }
    });

    socket.on('get_friends', async () => {
        try {
            const userId = socket.userId;

            if (!userId || !isValidObjectId(userId)) {
                socket.emit('friends_error', {
                    message: 'Invalid user ID format. Please log in again.'
                });
                return;
            }

            const user = await User.findById(userId)
                .populate('friends', '_id username currentAvatar status currentGame rank lastSeen updatedAt')
                .exec();

            if (!user) {
                socket.emit('friends_error', {
                    message: 'User not found. Please log in again.'
                });
                return;
            }

            // Store user connection
            activeUsers.set(userId, {
                socketId: socket.id,
                username: user.username,
                tag: user.tag,
                currentAvatar: user.currentAvatar,
                status: 'online',
                currentGame: user.currentGame,
                lastSeen: new Date()
            });

            // Join user to their personal room
            socket.join(`user_${userId}`);

            // Update user status in database
            await User.findByIdAndUpdate(userId, {
                status: 'online',
                lastSeen: new Date()
            });

            // Broadcast user status to friends
            const friendIds = user.friends.map((friend: any) => friend._id.toString());
            friendIds.forEach((friendId: string) => {
                const friendInfo = activeUsers.get(friendId);
                if (friendInfo) {
                    io.to(friendInfo.socketId).emit('friend_status_update', {
                        userId,
                        status: 'online',
                        username: user.username,
                        game: user.currentGame || 'Online'
                    });
                }
            });

            // Get friends with updated online status
            const friendsWithStatus = user.friends.map((friend: any) => {
                const isOnline = activeUsers.has(friend._id.toString());
                return {
                    id: friend._id.toString(),
                    username: friend.username,
                    avatar: friend.currentAvatar,
                    status: isOnline ? 'online' : friend.status || 'offline',
                    game: friend.currentGame || (isOnline ? 'Online' : 'Offline'),
                    rank: friend.rank || 'UNRANKED',
                    lastSeen: friend.lastSeen || friend.updatedAt
                };
            });

            // Send friends list to client
            socket.emit('friends_list', { friends: friendsWithStatus });

            // Send pending friend requests
            const pendingRequests = await User.findById(userId)
                .populate('pendingFriendRequests', '_id username currentAvatar')
                .exec();

            if (pendingRequests && pendingRequests.pendingFriendRequests) {
                const formattedRequests = pendingRequests.pendingFriendRequests.map((request: any) => ({
                    senderId: request._id.toString(),
                    senderName: request.username,
                    senderAvatar: request.currentAvatar
                }));

                socket.emit('pending_friend_requests', { requests: formattedRequests });
            }

            console.log(`User ${user.username} (${userId}) connected and friends loaded`);
        } catch (error: any) {
            console.error('Error fetching friends:', error);

            if (error.name === 'CastError') {
                socket.emit('friends_error', {
                    message: 'Invalid user ID format. Please log in again.'
                });
            } else {
                socket.emit('friends_error', {
                    message: 'Failed to load friends. Please try again.'
                });
            }
        }
    });

    socket.on('send_friend_request', async (data) => {
        try {
            const { senderId, receiverUsername, receiverTag } = data;

            if (senderId !== socket.userId) {
                socket.emit('friend_request_error', { message: 'Unauthorized request' });
                return;
            }

            const senderInfo = activeUsers.get(senderId);
            if (!senderInfo) {
                socket.emit('friend_request_error', { message: 'Sender not found' });
                return;
            }

            const receiver = await User.findOne({
                username: receiverUsername,
                tag: receiverTag
            });

            if (!receiver) {
                socket.emit('friend_request_error', { message: 'User not found' });
                return;
            }

            if (receiver._id.toString() === senderId) {
                socket.emit('friend_request_error', { message: 'Cannot add yourself as a friend' });
                return;
            }

            const sender = await User.findById(senderId);
            if (!sender) {
                socket.emit('friend_request_error', { message: 'Sender not found' });
                return;
            }

            const receiverObjectId = new Types.ObjectId(receiver._id);
            const alreadyFriends = sender.friends?.some((friendId: any) => friendId.equals(receiverObjectId));

            if (alreadyFriends) {
                socket.emit('friend_request_error', { message: 'Already friends' });
                return;
            }

            const requestAlreadySent = receiver.pendingFriendRequests?.some((requestId: any) => requestId.toString() === senderId);

            if (requestAlreadySent) {
                socket.emit('friend_request_error', { message: 'Friend request already sent' });
                return;
            }

            await User.findByIdAndUpdate(receiver._id, {
                $addToSet: { pendingFriendRequests: senderId }
            });

            const receiverInfo = activeUsers.get(receiver._id.toString());
            if (receiverInfo) {
                io.to(receiverInfo.socketId).emit('friend_request_received', {
                    senderId,
                    senderName: senderInfo.username,
                    senderAvatar: senderInfo.currentAvatar,
                    message: `${senderInfo.username} wants to be your friend`
                });
            }

            socket.emit('friend_request_sent', {
                message: `Friend request sent to ${receiverUsername}#${receiverTag}`
            });

        } catch (error) {
            console.error('Error sending friend request:', error);
            socket.emit('friend_request_error', { message: 'Failed to send friend request' });
        }
    });

    socket.on('accept_friend_request', async (data) => {
        try {
            const { userId, requesterId } = data;

            if (userId !== socket.userId) {
                socket.emit('friend_request_error', { message: 'Unauthorized request' });
                return;
            }

            await User.findByIdAndUpdate(userId, {
                $addToSet: { friends: requesterId },
                $pull: { pendingFriendRequests: requesterId }
            });

            await User.findByIdAndUpdate(requesterId, {
                $addToSet: { friends: userId }
            });

            const userInfo = activeUsers.get(userId);
            const requesterInfo = activeUsers.get(requesterId);

            if (requesterInfo) {
                io.to(requesterInfo.socketId).emit('friend_request_accepted', {
                    userId,
                    username: userInfo?.username || 'Unknown'
                });
            }

            socket.emit('friend_added', {
                friendId: requesterId,
                friendName: requesterInfo?.username || 'Unknown'
            });

        } catch (error) {
            console.error('Error accepting friend request:', error);
            socket.emit('friend_request_error', { message: 'Failed to accept friend request' });
        }
    });

    socket.on('reject_friend_request', async (data) => {
        try {
            const { userId, requesterId } = data;

            if (userId !== socket.userId) {
                socket.emit('friend_request_error', { message: 'Unauthorized request' });
                return;
            }

            await User.findByIdAndUpdate(userId, {
                $pull: { pendingFriendRequests: requesterId }
            });

            const requesterInfo = activeUsers.get(requesterId);
            if (requesterInfo) {
                io.to(requesterInfo.socketId).emit('friend_request_rejected', {
                    userId,
                    username: activeUsers.get(userId)?.username || 'Unknown'
                });
            }

            socket.emit('friend_request_rejected', {
                requesterId,
                requesterName: requesterInfo?.username || 'Unknown'
            });

        } catch (error) {
            console.error('Error rejecting friend request:', error);
            socket.emit('friend_request_error', { message: 'Failed to reject friend request' });
        }
    });

    socket.on('remove_friend', async (data) => {
        try {
            const { userId, friendId } = data;

            if (userId !== socket.userId) {
                socket.emit('friend_request_error', { message: 'Unauthorized request' });
                return;
            }

            const toObjectId = (id: string) => new mongoose.Types.ObjectId(id);

            await User.findByIdAndUpdate(userId, {
                $pull: { friends: toObjectId(friendId) }
            });

            await User.findByIdAndUpdate(friendId, {
                $pull: { friends: toObjectId(userId) }
            });

            const userInfo = activeUsers.get(userId);
            const friendInfo = activeUsers.get(friendId);

            if (friendInfo) {
                io.to(friendInfo.socketId).emit('friend_removed', {
                    userId,
                    username: userInfo?.username || 'Unknown'
                });
            }

            socket.emit('friend_removed', {
                friendId,
                friendName: friendInfo?.username || 'Unknown'
            });

        } catch (error) {
            console.error('Error removing friend:', error);
            socket.emit('friend_request_error', { message: 'Failed to remove friend' });
        }
    });

    socket.on('get_friends_list', async (data) => {
        try {
            const { userId } = data;
            
            if (userId !== socket.userId) {
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            const user = await User.findById(userId)
                .populate('friends', '_id username currentAvatar status currentGame rank lastSeen updatedAt')
                .exec();

            if (!user) {
                socket.emit('friends_error', {
                    message: 'User not found. Please log in again.'
                });
                return;
            }

            const friendsWithStatus = user.friends.map((friend: any) => {
                const friendId = friend._id.toString();
                const isOnline = activeUsers.has(friendId);

                return {
                    id: friendId,
                    username: friend.username,
                    avatar: friend.currentAvatar,
                    status: isOnline ? 'online' : 'offline',
                    game: friend.currentGame || (isOnline ? 'Online' : 'Offline'),
                    rank: friend.rank || 'UNRANKED',
                    lastSeen: friend.lastSeen || friend.updatedAt
                };
            });

            socket.emit('friends_list', { friends: friendsWithStatus });

        } catch (error) {
            console.error('Error fetching friends list:', error);
            socket.emit('friends_error', { message: 'Failed to fetch friends list' });
        }
    });
};