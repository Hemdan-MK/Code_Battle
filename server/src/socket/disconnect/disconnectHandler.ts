// socket/disconnect/disconnectHandler.ts
import { Socket, Server } from 'socket.io';
import User from '../../models/User';
import { IActiveUser, activeTeams, userTeams } from '../store/userStore';

export const handleDisconnect = async (
    socket: Socket,
    io: Server,
    activeUsers: Map<string, IActiveUser>,
    reason: string
) => {
    console.log('User disconnected:', socket.id, 'Reason:', reason);

    // Find and remove user from active users
    let disconnectedUserId: string | null = null;
    let disconnectedUserInfo: IActiveUser | null = null;

    for (const [userId, userInfo] of activeUsers.entries()) {
        if (userInfo.socketId === socket.id) {
            disconnectedUserId = userId;
            disconnectedUserInfo = userInfo;
            activeUsers.delete(userId);
            break;
        }
    }

    if (disconnectedUserId) {
        try {
            // Handle team cleanup
            const teamId = userTeams.get(disconnectedUserId);
            if (teamId) {
                const team = activeTeams.get(teamId);
                if (team) {
                    // Remove user from team
                    team.members = team.members.filter((member: { userId: string; }) => member.userId !== disconnectedUserId);
                    userTeams.delete(disconnectedUserId);

                    if (team.members.length === 0) {
                        // Delete empty team
                        activeTeams.delete(teamId);
                    } else if (team.leader === disconnectedUserId && team.members.length > 0) {
                        // Transfer leadership to first remaining member
                        team.leader = team.members[0].userId;
                        io.to(teamId).emit('team_leader_changed', {
                            newLeader: team.members[0]
                        });
                    }

                    // Notify remaining team members
                    io.to(teamId).emit('team_member_left', {
                        userId: disconnectedUserId,
                        username: disconnectedUserInfo?.username || 'Unknown',
                        team
                    });
                }
            }

            // Only update to offline if it wasn't already handled by logout
            if (reason !== 'client namespace disconnect') {
                await User.findByIdAndUpdate(disconnectedUserId, {
                    status: 'offline',
                    lastSeen: new Date()
                });

                // Notify friends about offline status
                const user = await User.findById(disconnectedUserId).populate('friends', '_id');
                if (user && user.friends) {
                    const friendIds = user.friends.map((friend: any) => friend._id.toString());

                    friendIds.forEach((friendId: string) => {
                        const friendInfo = activeUsers.get(friendId);
                        if (friendInfo) {
                            io.to(friendInfo.socketId).emit('friend_status_update', {
                                userId: disconnectedUserId,
                                status: 'offline',
                                lastSeen: new Date(),
                                username: disconnectedUserInfo?.username || 'Unknown'
                            });
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error updating offline status on disconnect:', error);
        }
    }
};