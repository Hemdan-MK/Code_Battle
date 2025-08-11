// socket/team/teamHandler.ts
import { Socket, Server } from 'socket.io';
import User from '../../../models/User';
import { IActiveUser, activeTeams, userTeams } from '../../store/userStore';

export const setupTeamHandlers = (socket: Socket, io: Server, activeUsers: Map<string, IActiveUser>) => {

    socket.on('create_team', async (data) => {
        try {
            const { userId, gameMode } = data;
            console.log("Creating team for user:", userId);

            if (userId !== socket.userId) {
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            if (userTeams.has(userId)) {
                socket.emit('team_error', { message: 'Already in a team' });
                return;
            }

            const teamId = `team_${Date.now()}_${userId}`;
            const userInfo = activeUsers.get(userId);

            if (!userInfo) {
                socket.emit('team_error', { message: 'User not found' });
                return;
            }

            const team = {
                id: teamId,
                leader: userId,
                mode: gameMode,
                members: [{
                    userId,
                    username: userInfo.username,
                    avatar: userInfo.currentAvatar,
                    rank: 'TOXIC',
                    ready: true
                }],
                createdAt: new Date()
            };

            activeTeams.set(teamId, team);
            userTeams.set(userId, teamId);

            socket.join(teamId);
            socket.emit('team_created', { team });

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

            // Notify friends about status update
            const friendIds = user.friends.map((friend) => friend._id.toString());
            friendIds.forEach((friendId) => {
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

            console.log(`Team ${teamId} created by ${userInfo.username}`);

        } catch (error) {
            console.error('Error creating team:', error);
            socket.emit('team_error', { message: 'Failed to create team' });
        }
    });

    socket.on('send_team_invite', async (data) => {
        try {
            const { senderId, receiverId, teamId } = data;
            console.log("🚀 SEND_TEAM_INVITE received:", data);

            if (senderId !== socket.userId) {
                console.error("❌ Unauthorized request - senderId mismatch");
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            const team = activeTeams.get(teamId);
            if (!team || team.leader !== senderId) {
                console.error("❌ Not team leader or team not found");
                socket.emit('team_error', { message: 'Not team leader or team not found' });
                return;
            }

            if (userTeams.has(receiverId)) {
                socket.emit('team_error', { message: 'User is already in a team' });
                return;
            }

            const senderInfo = activeUsers.get(senderId);
            const receiverInfo = activeUsers.get(receiverId);

            if (!receiverInfo) {
                socket.emit('team_error', { message: 'User is not online' });
                return;
            }

            const inviteData = {
                teamId,
                senderId,
                senderName: senderInfo?.username || 'Unknown',
                gameMode: team.mode,
                teamSize: team.members.length,
                maxSize: team.mode === 'solo' ? 1 : 3
            };

            io.to(receiverInfo.socketId).emit('team_invite_received', inviteData);

            socket.emit('team_invite_sent', {
                receiverName: receiverInfo.username,
                message: `Invitation sent to ${receiverInfo.username}`
            });

            console.log("✅ Team invite process completed successfully");

        } catch (error) {
            console.error('❌ Error sending team invite:', error);
            socket.emit('team_error', { message: 'Failed to send invitation' });
        }
    });

    socket.on('respond_team_invite', async (data) => {
        try {
            const { userId, teamId, accepted } = data;

            if (userId !== socket.userId) {
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            const team = activeTeams.get(teamId);
            if (!team) {
                socket.emit('team_error', { message: 'Team not found' });
                return;
            }

            const userInfo = activeUsers.get(userId);
            const leaderInfo = activeUsers.get(team.leader);

            if (accepted) {
                if (userTeams.has(userId)) {
                    socket.emit('team_error', { message: 'Already in a team' });
                    return;
                }

                const maxSize = team.mode === 'solo' ? 1 : 3;
                if (team.members.length >= maxSize) {
                    socket.emit('team_error', { message: 'Team is full' });
                    return;
                }

                team.members.push({
                    userId,
                    username: userInfo?.username || 'Unknown',
                    avatar: userInfo?.currentAvatar || '/image/default-avatar.webp',
                    rank: 'TOXIC',
                    ready: false
                });

                userTeams.set(userId, teamId);
                socket.join(teamId);

                io.to(teamId).emit('team_member_joined', {
                    member: {
                        userId,
                        username: userInfo?.username || 'Unknown',
                        avatar: userInfo?.currentAvatar || '/image/default-avatar.webp',
                        rank: 'TOXIC',
                        ready: false
                    },
                    team
                });

                if (leaderInfo) {
                    io.to(leaderInfo.socketId).emit('team_invite_accepted', {
                        userId,
                        username: userInfo?.username || 'Unknown'
                    });
                }

            } else {
                if (leaderInfo) {
                    io.to(leaderInfo.socketId).emit('team_invite_rejected', {
                        userId,
                        username: userInfo?.username || 'Unknown'
                    });
                }
            }

        } catch (error) {
            console.error('Error responding to team invite:', error);
            socket.emit('team_error', { message: 'Failed to respond to invitation' });
        }
    });

    socket.on('leave_team', async (data) => {
        try {
            const { userId } = data;

            if (userId !== socket.userId) {
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            const teamId = userTeams.get(userId);
            if (!teamId) {
                socket.emit('team_error', { message: 'Not in a team' });
                return;
            }

            const team = activeTeams.get(teamId);
            if (!team) {
                socket.emit('team_error', { message: 'Team not found' });
                return;
            }

            team.members = team.members.filter((member: { userId: any; }) => member.userId !== userId);
            userTeams.delete(userId);
            socket.leave(teamId);

            if (team.members.length === 0) {
                activeTeams.delete(teamId);
            } else if (team.leader === userId && team.members.length > 0) {
                team.leader = team.members[0].userId;
                io.to(teamId).emit('team_leader_changed', {
                    newLeader: team.members[0]
                });
            }

            io.to(teamId).emit('team_member_left', {
                userId,
                team
            });

            socket.emit('team_left', { message: 'Left team successfully' });

        } catch (error) {
            console.error('Error leaving team:', error);
            socket.emit('team_error', { message: 'Failed to leave team' });
        }
    });

    socket.on('send_team_message', async (data) => {
        try {
            const { senderId, message, timestamp } = data;

            if (senderId !== socket.userId) {
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            const teamId = userTeams.get(senderId);
            if (!teamId) {
                socket.emit('team_error', { message: 'Not in a team' });
                return;
            }

            const senderInfo = activeUsers.get(senderId);
            if (!senderInfo) {
                socket.emit('team_error', { message: 'User not found' });
                return;
            }

            const messageData = {
                id: Date.now().toString(),
                senderId,
                senderName: senderInfo.username,
                senderAvatar: senderInfo.currentAvatar,
                message,
                timestamp: timestamp || new Date().toISOString()
            };

            io.to(teamId).emit('team_message_received', messageData);

            console.log(`Team message from ${senderInfo.username}: ${message}`);

        } catch (error) {
            console.error('Error sending team message:', error);
            socket.emit('team_error', { message: 'Failed to send message' });
        }
    });

    socket.on('update_team_ready_status', async (data) => {
        try {
            const { userId, ready } = data;

            if (userId !== socket.userId) {
                socket.emit('team_error', { message: 'Unauthorized request' });
                return;
            }

            const teamId = userTeams.get(userId);
            if (!teamId) {
                socket.emit('team_error', { message: 'Not in a team' });
                return;
            }

            const team = activeTeams.get(teamId);
            if (!team) {
                socket.emit('team_error', { message: 'Team not found' });
                return;
            }

            const member = team.members.find((m: { userId: any; }) => m.userId === userId);
            if (member) {
                member.ready = ready;
            }

            io.to(teamId).emit('team_ready_status_updated', {
                userId,
                ready,
                team
            });

        } catch (error) {
            console.error('Error updating ready status:', error);
            socket.emit('team_error', { message: 'Failed to update ready status' });
        }
    });

    // Debug event to check active users
    socket.on('debug_active_users', () => {
        console.log("📊 DEBUG: Active Users Map:");
        for (const [userId, userInfo] of activeUsers.entries()) {
            console.log(`  ${userId}: ${userInfo.username} (${userInfo.socketId})`);
        }

        socket.emit('debug_response', {
            activeUsersCount: activeUsers.size,
            currentSocketId: socket.id,
            currentUserId: socket.userId
        });
    });
}