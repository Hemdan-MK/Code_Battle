import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export const signupSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be less than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email format'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    phoneNumber: z.string()
        .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
});

export const otpVerificationSchema = z.object({
    otp: z.string().length(6, 'OTP must be 6 digits'),
    tempToken: z.string().min(1, "Token is required"),
});

export const resendOTPSchema = z.object({
    where: z.enum(['signUp', 'forgot']),
    tempToken: z.string().min(1, "Token is required"),
});


export const googleAuthSchema = z.object({
    credential: z.string().min(1, 'Google Credential (code) is required'),
});

export const githubAuthSchema = z.object({
    code: z.string().min(1, 'GitHub authorization code is required')
});

export const forgotPasswordSchema = z.object({
    email: z.string().email('Invalid email format'),
})

export const verifyResetPasswordSchema = z.string().length(6, 'OTP must be 6 digits');

export const newPasswordSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
})