// socket/store/userStore.ts
import { Types } from 'mongoose';

export interface IActiveUser {
    socketId: string;
    username: string;
    tag: string;
    currentAvatar: Types.ObjectId | null | undefined;
    status: 'online' | 'offline';
    currentGame?: "In Game" | "Available";
    lastSeen: Date;
}

export interface IFriendInfo {
    id: string;
    username: string;
    currentAvatar?: Types.ObjectId | null;
    status: string;
    currentGame: string;
    rank: string;
    lastSeen?: Date;
}

// Store active users and their socket connections
export const activeUsers = new Map<string, IActiveUser>();
export const userRooms = new Map<string, string>();

// Team-related stores
export const activeTeams = new Map();   // teamId -> { members: [], leader: userId, mode: string }
export const userTeams = new Map();     // userId -> teamId