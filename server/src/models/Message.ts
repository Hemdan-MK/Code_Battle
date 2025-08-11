import mongoose, { Document, Model, Schema } from 'mongoose';

// Define the interface for the Message document
export interface IMessage extends Document {
    content: string;
    senderId: mongoose.Types.ObjectId;
    senderName: string;
    senderAvatar?: string;
    messageType: 'private' | 'team';
    receiverId?: mongoose.Types.ObjectId;
    teamId?: string;
    isRead: boolean;
    isDeleted: boolean;
    deleteAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    markAsRead(): Promise<IMessage>;
}

// Define the interface for the Message model (static methods)
interface IMessageModel extends Model<IMessage> {
    getPrivateChat(userId1: string, userId2: string, limit?: number): Promise<IMessage[]>;
    getTeamChat(teamId: string, limit?: number): Promise<IMessage[]>;
    deleteTeamMessagesForUser(teamId: string, userId: string): Promise<any>;
    deleteAllTeamMessages(teamId: string): Promise<any>;
    deletePrivateMessagesForUser(userId: string): Promise<any>;
}

const messageSchema = new Schema<IMessage>({
    // Message content
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 2000
    },
    
    // Sender information
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    senderName: {
        type: String,
        required: true
    },
    
    senderAvatar: {
        type: String,
        default: '/image/default-avatar.webp'
    },
    
    // Message type: 'private' or 'team'
    messageType: {
        type: String,
        enum: ['private', 'team'],
        required: true
    },
    
    // For private messages
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: function(this: IMessage, value: any): boolean {
                return this.messageType !== 'private' || (this.messageType === 'private' && value != null);
            },
            message: 'receiverId is required for private messages'
        }
    },
    
    // For team messages
    teamId: {
        type: String,
        validate: {
            validator: function(this: IMessage, value: any): boolean {
                return this.messageType !== 'team' || (this.messageType === 'team' && value != null && value.trim().length > 0);
            },
            message: 'teamId is required for team messages'
        }
    },
    
    // Message status
    isRead: {
        type: Boolean,
        default: false
    },
    
    // Soft delete flag
    isDeleted: {
        type: Boolean,
        default: false
    },
    
    // Auto-delete timestamp (for team messages when user leaves/logs out)
    deleteAt: {
        type: Date,
        index: { expireAfterSeconds: 0 }
    }
    
}, {
    timestamps: true // This adds createdAt and updatedAt automatically
});

// Index for efficient querying
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 }); // Private messages
messageSchema.index({ teamId: 1, createdAt: -1 }); // Team messages
messageSchema.index({ messageType: 1, createdAt: -1 });
messageSchema.index({ deleteAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Static method to get private chat history
messageSchema.statics.getPrivateChat = function(userId1: string, userId2: string, limit = 50): Promise<IMessage[]> {
    return this.find({
        messageType: 'private',
        isDeleted: false,
        $or: [
            { senderId: userId1, receiverId: userId2 },
            { senderId: userId2, receiverId: userId1 }
        ]
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'username currentAvatar')
    .populate('receiverId', 'username currentAvatar');
};

// Static method to get team chat history
messageSchema.statics.getTeamChat = function(teamId: string, limit = 50): Promise<IMessage[]> {
    return this.find({
        messageType: 'team',
        teamId: teamId,
        isDeleted: false
    })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('senderId', 'username currentAvatar');
};

// Static method to delete team messages when user leaves
messageSchema.statics.deleteTeamMessagesForUser = function(teamId: string, userId: string) {
    // Set deleteAt to current time for immediate deletion
    return this.updateMany(
        {
            messageType: 'team',
            teamId: teamId,
            senderId: userId
        },
        {
            $set: { 
                deleteAt: new Date(),
                isDeleted: true 
            }
        }
    );
};

// Static method to delete all team messages when team is disbanded
messageSchema.statics.deleteAllTeamMessages = function(teamId: string) {
    return this.updateMany(
        {
            messageType: 'team',
            teamId: teamId
        },
        {
            $set: { 
                deleteAt: new Date(),
                isDeleted: true 
            }
        }
    );
};

// Static method to delete private chat when user logs out (optional)
messageSchema.statics.deletePrivateMessagesForUser = function(userId: string) {
    return this.updateMany(
        {
            messageType: 'private',
            $or: [{ senderId: userId }, { receiverId: userId }]
        },
        {
            $set: { 
                deleteAt: new Date(),
                isDeleted: true 
            }
        }
    );
};

// Instance method to mark message as read
messageSchema.methods.markAsRead = function(this: IMessage): Promise<IMessage> {
    this.isRead = true;
    return this.save();
};

const Message = mongoose.model<IMessage, IMessageModel>('Message', messageSchema);

export default Message;