// socket/types/socketTypes.ts
import { Types } from 'mongoose';

// JWT payload interface
export interface JwtPayload {
    userId: string;
}

// Active user interface
export interface IActiveUser {
    socketId: string;
    username: string;
    tag: string;
    currentAvatar: Types.ObjectId | null | undefined;
    status: 'online' | 'offline';
    currentGame?: "In Game" | "Available";
    lastSeen: Date;
}

// Friend info interface
export interface IFriendInfo {
    id: string;
    username: string;
    currentAvatar?: Types.ObjectId | null;
    status: string;
    currentGame: string;
    rank: string;
    lastSeen?: Date;
}

// Team member interface
export interface ITeamMember {
    userId: string;
    username: string;
    avatar: Types.ObjectId | null | undefined | string;
    rank: string;
    ready: boolean;
}

// Team interface
export interface ITeam {
    id: string;
    leader: string;
    mode: string;
    members: ITeamMember[];
    createdAt: Date;
}

// Message data interface
export interface IMessageData {
    id: string;
    senderId: string;
    receiverId?: string;
    message: string;
    timestamp: string;
    senderName: string;
    senderAvatar?: Types.ObjectId | null | undefined;
}

// Friend request data interface
export interface IFriendRequestData {
    senderId: string;
    senderName: string;
    senderAvatar?: Types.ObjectId | null | undefined;
    message: string;
}

// Team invite data interface
export interface ITeamInviteData {
    teamId: string;
    senderId: string;
    senderName: string;
    gameMode: string;
    teamSize: number;
    maxSize: number;
}

// Status update data interface
export interface IStatusUpdateData {
    userId: string;
    status: string;
    game?: string;
    username: string;
    lastSeen?: Date;
}