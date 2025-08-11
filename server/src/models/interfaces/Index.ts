import { Document, ObjectId, Types } from "mongoose";

export interface IUser extends Document {
    _id: string;
    token: string;
    username: string;
    tag: string;
    refreshToken?: string;
    email: string;
    password: string;
    phone: number | null;
    role: 'user' | 'admin';
    googleId: string | null;
    githubId: string | null;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    status: 'online' | 'offline',
    rank: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Unranked',
    xp: number,
    level?: number;
    isBanned: boolean;
    currentAvatar?: Types.ObjectId | null;
    currentTitle?: string;
    currentGame?: 'In Game' | 'Available' ; 
    collections?: {
        Avatar: Array<Types.ObjectId>;
        Title: Array<Types.ObjectId>;
    };
    gamePlayed?: number;
    friends: Types.ObjectId[];
    pendingFriendRequests?: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IOTP extends Document {
    userId: string;
    otp: string;
    expiresAt: Date;
    createdAt: Date;
    session: "forgot" | "signUp";
}