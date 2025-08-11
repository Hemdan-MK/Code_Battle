import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository, IOTPRepository } from '../repositories/interfaces/index';
import { } from '../repositories/OTPRepository';
import { EmailService } from './AuthServices/EmailService';
import { SMSService } from './AuthServices/SMSService';
import { GoogleAuthService } from './AuthServices/GoogleAuthService';
import { GitHubAuthService } from './AuthServices/GitHubAuthService';
import {
    LoginRequest,
    SignupRequest,
    OTPVerificationRequest,
    ResendOTPRequest,
    GoogleAuthRequest,
    GitHubAuthRequest,
    AccessTokenPayload,
    RefreshTokenPayload,
    TempTokenPayload,
    forgotPassword,
    SignupResponse,
    AuthResponse
} from '../types/index';

import { IUser } from '../models/interfaces/Index';
import axios from 'axios';


export class AuthService {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOTPRepository,
        private emailService: EmailService,
        private smsService: SMSService,
        private googleAuthService: GoogleAuthService,
        private githubAuthService: GitHubAuthService
    ) { }

    async login(data: LoginRequest): Promise<AuthResponse> {
        const { email, password } = data;

        // Find user with password

        const user = await this.userRepository.findByEmailWithPassword(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        console.log(user);

        // Check password
        if (!user.password) {
            throw new Error('Please login with your OAuth provider');
        }


        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid credentials pass');
        }

        // Check if user is verified
        if (!user.isEmailVerified) {
            throw new Error('Please verify your email before logging in');
        }
        if (user.isBanned) {
            throw new Error('Banned user');
        }

        // Generate tokens
        const token = this.generateAccessToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id);

        return {
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            },
            isAdmin: user.role === "admin"
        };
    }

    async signup(data: SignupRequest): Promise<SignupResponse> {
        const { username, email, password, phoneNumber } = data;

        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const existingUsername = await this.userRepository.findByUsername(username);
        if (existingUsername) {
            throw new Error('Username is already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await this.userRepository.create({
            email,
            username,
            phone: Number(phoneNumber),
            password: hashedPassword,
            isEmailVerified: false,
            isPhoneVerified: false
        });

        // Generate and send OTP
        const session = "signUp"
        await this.generateAndSendOTP(user._id, session);
        await this.generateAndSendOTP(user._id, session);

        // Generate temp token
        const tempToken = this.generateTempToken(user._id);

        return {
            success: true,
            message: "Signup initialize successfully",
            tempToken,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            }
        };
    }

    async verifyOTP(data: OTPVerificationRequest): Promise<AuthResponse> {
        const { otp, tempToken } = data;

        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET!) as TempTokenPayload;
        const userId = decoded.userId;
        console.log(userId);

        // Find OTP
        const otpRecord = await this.otpRepository.findByUserIdAndType(userId.toString());
        console.log(otpRecord);

        if (!otpRecord) {
            throw new Error('OTP not found or expired');
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            throw new Error('Invalid OTP');
        }

        // Get user
        const user = await this.userRepository.findById(userId.toString());
        if (!user) {
            throw new Error('User not found');
        }

        // Update verification status
        const updates: Partial<IUser> = {};
        updates.isEmailVerified = true;


        await this.userRepository.update(userId.toString(), updates);

        // Delete OTP
        await this.otpRepository.deleteByUserIdAndType(userId.toString());

        // Generate tokens
        const token = this.generateAccessToken(userId.toString());
        const refreshToken = this.generateRefreshToken(userId.toString());

        return {
            success: true,
            message: 'OTP verified successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            }
        };
    }

    async resendOTP(data: ResendOTPRequest): Promise<{ success: boolean, message: string }> {
        const { tempToken, where } = data;


        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET!) as TempTokenPayload;
        const userId = decoded.userId;

        // Generate and send new OTP
        await this.generateAndSendOTP(userId.toString(), where);

        return {
            success: true,
            message: "Resend OTP Success"
        };
    }

    async googleAuth({ access_token, id_token }: GoogleAuthRequest): Promise<{
        success: boolean; message: string; token: string; user: any; isAdmin: boolean;
    }> {

        const { data: googleUser } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userData = {
            email: googleUser.email,
            username: googleUser.name,
            picture: googleUser.picture,
            googleId: googleUser.sub,
        };

        // Check if user exists
        let user = await this.userRepository.findByGoogleId(userData.googleId);

        if (!user) {
            // Check if user exists with same email
            user = await this.userRepository.findByEmail(userData.email);

            if (user) {
                // Link Google account
                await this.userRepository.update(user._id, { googleId: userData.googleId });
            } else {
                // Create new user
                const randomPassword = Math.random().toString(36).slice(-8);
                const hashedPassword = await bcrypt.hash(randomPassword, 12);

                user = await this.userRepository.create({
                    email: userData.email,
                    username: userData.email.split('@')[0],
                    phone: 0,   // change in edit
                    password: hashedPassword,
                    googleId: googleUser.sub,
                    isEmailVerified: true
                });
            }
        }

        if (user.isBanned) {
            throw new Error('Banned user');
        }

        // Generate token
        const token = this.generateAccessToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id)

        return {
            success: true,
            message: 'Google authentication successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            },
            isAdmin: user.role === "admin"

        };
    }

    async githubAuth(data: GitHubAuthRequest): Promise<{ success: boolean; message: string; token: string; user: any; isAdmin?: boolean }> {
        const { code } = data;

        // Exchange code for access token and get user info
        // const githubUser = await this.githubAuthService.exchangeCode(code);
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.VITE_GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );
        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) throw new Error('Failed to get GitHub access token');

        // 2. Get user info from GitHub
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const githubUser = userResponse.data;

        // Check if user exists
        let user = await this.userRepository.findByGithubId(githubUser.id.toString());

        if (!user) {
            // Check if user exists with same email
            if (githubUser.email) {
                user = await this.userRepository.findByEmail(githubUser.email);
            }

            if (user) {
                // Link GitHub account
                await this.userRepository.update(user._id, { githubId: githubUser.id.toString() });
            } else {
                const randomPassword = Math.random().toString(36).slice(-8); // e.g., "jdh38dfk"
                const hashedPassword = await bcrypt.hash(randomPassword, 12);
                // Create new user
                user = await this.userRepository.create({
                    email: githubUser.email || '',
                    username: githubUser.login,
                    password: hashedPassword,
                    phone: 0,
                    githubId: githubUser.id.toString(),
                    isEmailVerified: !!githubUser.email
                });
            }
        }

        // Generate token
        const token = this.generateAccessToken(user._id);
        const refreshToken = this.generateRefreshToken(user._id)

        return {
            success: true,
            message: 'GitHub authentication successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            },
            isAdmin: user.role === "admin"
        };
    }

    private async generateAndSendOTP(userId: string, session: 'forgot' | 'signUp'): Promise<void> {
        // Delete existing OTP
        await this.otpRepository.deleteByUserIdAndType(userId);

        // Generate new OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP
        await this.otpRepository.create({
            userId,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
        });

        // Get user
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Send OTP
        await this.emailService.sendOTP(user.email, otp, session);

    }

    private generateAccessToken(userId: string): string {
        const payload: AccessTokenPayload = {
            userId,
            type: 'access'
        };

        return jwt.sign(
            payload,
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );
    }

    private generateRefreshToken(userId: string): string {
        const payload: RefreshTokenPayload = {
            userId,
            type: 'refresh'
        };

        return jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: '7d' }
        );
    }

    private generateTempToken(userId: string, purpose: 'otp_verification' | 'password_reset' | 'email_change' = 'otp_verification'): string {
        const payload: TempTokenPayload = {
            userId,
            type: 'temp',
            purpose
        };

        return jwt.sign(
            payload,
            process.env.JWT_TEMP_SECRET!,
            { expiresIn: '1h' }
        );
    }

    async forgotPassword(data: forgotPassword): Promise<{
        success: boolean;
        message: string;
        userExists: boolean;
        tempToken?: string;
    }> {
        const { email } = data;

        const check = await this.userRepository.findByEmail(email);
        if (!check) {
            return {
                success: true,
                message: 'Email Verification successful',
                userExists: false
            };
        }

        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const session = 'forgot'
        await this.generateAndSendOTP(user._id, session);

        const tempToken = this.generateTempToken(user._id);


        return {
            success: true,
            message: 'Email Verification successful',
            tempToken,
            userExists: true
        };
    }

    async verifyResetPassword(otp: string, tempToken: string): Promise<{
        success: boolean;
        isCorrect: boolean;
        message: string;
    }> {

        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET!) as TempTokenPayload;
        const userId = decoded.userId;

        // Find OTP
        const otpRecord = await this.otpRepository.findByUserIdAndType(userId.toString());
        if (!otpRecord) {
            throw new Error('OTP not found or expired');
        }

        // Verify OTP
        if (otpRecord.otp !== otp) {
            return {
                success: true,
                message: 'OTP verification unsuccessfully',
                isCorrect: false
            };
        }

        // Delete OTP
        await this.otpRepository.deleteByUserIdAndType(userId.toString());

        return {
            success: true,
            message: 'OTP verified successfully',
            isCorrect: true
        };
    }

    async resetNewPassword(password: string, tempToken: string): Promise<{
        success: boolean;
        message: string;
    }> {

        // Verify temp token
        const decoded = jwt.verify(tempToken, process.env.JWT_TEMP_SECRET!) as TempTokenPayload;
        const userId = decoded.userId;

        const user = await this.userRepository.findById(userId.toString());
        if (!user) {
            throw new Error('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const updatedUser = await this.userRepository.update(userId.toString(), {
            password: hashedPassword
        });

        if (!updatedUser) {
            throw new Error('Failed to update password');
        }

        return {
            success: true,
            message: 'Password reset successfully',
        };
    }
}