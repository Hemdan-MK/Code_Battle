// utils/messageUtils.js
import mongoose from 'mongoose';
import Message from '../models/Message'; // Adjust path as needed

class MessageUtils {

    // Get unread message count for a user
    static async getUnreadCount(userId: any) {
        try {
            const count = await Message.countDocuments({
                receiverId: userId,
                messageType: 'private',
                isRead: false,
                isDeleted: false
            });
            return count;
        } catch (error) {
            console.error('Error getting unread count:', error);
            return 0;
        }
    }

    // Get recent conversations for a user
    static async getRecentConversations(userId: any, limit = 10) {
        try {
            const recentMessages = await Message.aggregate([
                {
                    $match: {
                        messageType: 'private',
                        isDeleted: false,
                        $or: [
                            { senderId: new mongoose.Types.ObjectId(userId) },
                            { receiverId: new mongoose.Types.ObjectId(userId) }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
                                '$receiverId',
                                '$senderId'
                            ]
                        },
                        lastMessage: { $first: '$$ROOT' }
                    }
                },
                {
                    $limit: limit
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        userId: '$_id',
                        username: '$user.username',
                        avatar: '$user.currentAvatar',
                        lastMessage: '$lastMessage.content',
                        lastMessageTime: '$lastMessage.createdAt',
                        isLastMessageRead: '$lastMessage.isRead'
                    }
                },
                {
                    $sort: { lastMessageTime: -1 }
                }
            ]);

            return recentMessages;
        } catch (error) {
            console.error('Error getting recent conversations:', error);
            return [];
        }
    }

    // Clean old messages (run as a cron job)
    static async cleanOldMessages(daysOld = 30) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysOld);

            const result = await Message.updateMany(
                {
                    createdAt: { $lt: cutoffDate },
                    isDeleted: false
                },
                {
                    $set: {
                        isDeleted: true,
                        deleteAt: new Date()
                    }
                }
            );

            console.log(`Marked ${result.modifiedCount} old messages for deletion`);
            return result.modifiedCount;
        } catch (error) {
            console.error('Error cleaning old messages:', error);
            return 0;
        }
    }

    // Delete all messages for a user (for account deletion)
    static async deleteAllUserMessages(userId: any) {
        try {
            const result = await Message.updateMany(
                {
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                },
                {
                    $set: {
                        isDeleted: true,
                        deleteAt: new Date()
                    }
                }
            );

            console.log(`Marked ${result.modifiedCount} messages for deletion for user ${userId}`);
            return result.modifiedCount;
        } catch (error) {
            console.error('Error deleting user messages:', error);
            return 0;
        }
    }

    // Search messages
    static async searchMessages(userId: any, query: any, messageType = 'private', limit = 50) {
        try {
            let searchCriteria;

            if (messageType === 'private') {
                searchCriteria = {
                    content: { $regex: query, $options: 'i' },
                    isDeleted: false,
                    messageType: messageType,
                    $or: [
                        { senderId: userId },
                        { receiverId: userId }
                    ]
                };
            } else {
                searchCriteria = {
                    content: { $regex: query, $options: 'i' },
                    isDeleted: false,
                    messageType: messageType
                };
            }

            const messages = await Message.find(searchCriteria)
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('senderId', 'username currentAvatar')
                .populate('receiverId', 'username currentAvatar');

            return messages;
        } catch (error) {
            console.error('Error searching messages:', error);
            return [];
        }
    }

    // Get message statistics for a user
    static async getUserMessageStats(userId: any) {
        try {
            const stats = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { senderId: new mongoose.Types.ObjectId(userId) },
                            { receiverId: new mongoose.Types.ObjectId(userId) }
                        ],
                        isDeleted: false
                    }
                },
                {
                    $group: {
                        _id: '$messageType',
                        count: { $sum: 1 },
                        sent: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
                                    1,
                                    0
                                ]
                            }
                        },
                        received: {
                            $sum: {
                                $cond: [
                                    { $eq: ['$receiverId', new mongoose.Types.ObjectId(userId)] },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);

            return stats;
        } catch (error) {
            console.error('Error getting user message stats:', error);
            return [];
        }
    }
}

module.exports = MessageUtils;