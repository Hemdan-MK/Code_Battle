import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
    _id: string;
    token: string;
    username: string;
    name: string;
    refreshToken: string;
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
    isBanned: boolean;


    
    // reports: number,
    // GamePlayed: Number | null;
    // Rank: string | null;
    // Profileimage: string | null;
    // CurrentAvatar: ObjectId | null;
    // CurrentTitle: string | null;
    // Level: Number | null;
    // Online: Boolean | null;
    // XP: Number | null;
    // collections: {
    //     Avatar: ObjectId[] | null;
    //     Title: ObjectId[] | null;
    // };
    Timestamp: Date | null;
}

export interface IOTP extends Document {
    userId: string;
    otp: string;
    type: 'email' | 'phone';
    expiresAt: Date;
    createdAt: Date;
    session: "forgotpassword" | "signup";
}