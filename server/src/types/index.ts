import z from "zod";
import { forgotPasswordSchema, githubAuthSchema, googleAuthSchema, loginSchema, newPasswordSchema, otpVerificationSchema, resendOTPSchema, signupSchema, verifyResetPasswordSchema } from "../schemas/authSchemas";
import { ObjectId } from "mongoose";

export type LoginRequest = z.infer<typeof loginSchema>;
export type SignupRequest = z.infer<typeof signupSchema>;
export type OTPVerificationRequest = z.infer<typeof otpVerificationSchema>;
export type ResendOTPRequest = z.infer<typeof resendOTPSchema>;
export type forgotPassword = z.infer<typeof forgotPasswordSchema>;
export type newPassword = z.infer<typeof newPasswordSchema>;
export type verifyResetPassword = z.infer<typeof verifyResetPasswordSchema>

export interface JWTPayload {
    userId: ObjectId | string;             // string first 
    iat?: number;
    exp?: number;
}

export interface AccessTokenPayload extends JWTPayload {
    type: 'access';
}

export interface RefreshTokenPayload extends JWTPayload {
    type: 'refresh';
}

export interface TempTokenPayload extends JWTPayload {
    type: 'temp';
    purpose: 'otp_verification' | 'password_reset' | 'email_change';
}



export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        phone: Number | null;
    };
    isAdmin?: boolean;
}

export interface SignupResponse {
    success : boolean;
    message :string;
    tempToken: string;
    user: {
        id: string;
        email: string;
        username: string;
        phone: number | null;
    };
}



export interface GoogleAuthRequest {
    access_token: string;
    id_token: string;
}

export interface GitHubAuthRequest {
    code: string
}



////////////////////////////

// admin side
// ---------------

export interface GetUsers {
    page: number;
    limit: number;
    search: string;
    status: 'all' | 'banned';
}

export interface CreateUser {
    username: string;
    email: string;
    password: string;
    phone: number;
    role: 'user' | 'admin';
    xp: number,
}

export interface UpdateUser {
    username: string;
    email: string;
    password: string;
    phone: number;
    role: 'user' | 'admin';
    xp: number,
}



export type UserStatus = 'online' | 'offline' | 'banned' | 'away' | 'in game';
export type UserRank = 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Unranked';

export interface UserStats {
    total: number;
    online: number;
    offline: number;
    banned: number;
    ranks: {
        Diamond: number;
        Platinum: number;
        Gold: number;
        Silver: number;
        Unranked: number;
    };
}
