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
    rank: 'unranked' | 'iron' | 'bronze' | 'silver' | 'gold' | 'diamond',
    xp: number,
    level?: number;
    elo: number;
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

export interface ITestCase extends Document {
    input: string;
    output: string;
    isPublic: boolean;
}

export interface IProblem extends Document {
    problemId: number;
    slug: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    categories: string[];
    description: string;
    constraints?: string | null;
    testCases: ITestCase[];
    functionSignature?: string | null;
    codeTemplates?: Map<string, string> | null;
    officialSolution?: string | null;
    createdBy?: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
}

export interface IIssuedTo extends Document {
    userId?: Types.ObjectId | null;
    issuedAt: Date;
    claimedAt?: Date | null;
    isClaimed: boolean;
}

export interface IReward extends Document {
    rewardId: number;
    name: string;
    description?: string | null;
    rewardType: 'avatar' | 'title';
    rewardImage?: string | null;
    avatar?: string | null;
    title?: string | null;
    unlockType: 'level_based' | 'rank_based';
    requiredLevel?: number | null;
    requiredRank?: number | null;
    issuedTo?: IIssuedTo[];
    startDate?: Date | null;
    endDate?: Date | null;
    status: 'active' | 'inactive' | 'expired';
    createdAt: Date;
    updatedAt: Date;
}

export interface ILevel extends Document {
    levelNumber: number;
    reward: Types.ObjectId;
    description?: string | null;
    issuedTo?: IIssuedTo[];
    createdAt: Date;
    updatedAt: Date;
}