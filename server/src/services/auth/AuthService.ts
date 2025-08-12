import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IUserRepository, IOTPRepository } from '../../repositories/interfaces/index';
import { } from '../../repositories/OTPRepository';
import { EmailService } from './EmailService';
import { SMSService } from './SMSService';
import { GoogleAuthService } from './GoogleAuthService';
import { IGitHubAuthService } from '../../types/interfaces/IGitHubAuthService';
import { ITokenService } from '../../types/interfaces/ITokenService';
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
} from '../../types/index';

import { IUser } from '../../models/interfaces/Index';
import axios from 'axios';
import { IAuthService } from '../../types/interfaces/IAuthService';
import { IEmailService } from '../../types/interfaces/IEmailService';
import { IGoogleAuthService } from '../../types/interfaces/IGoogleAuthService';
import { ISMSService } from '../../types/interfaces/ISMSService';


export class AuthService implements IAuthService {
    constructor(
        private userRepository: IUserRepository,
        private otpRepository: IOTPRepository,
        private emailService: IEmailService,
        private smsService: ISMSService,
        private googleAuthService: IGoogleAuthService,
        private githubAuthService: IGitHubAuthService,
        private tokenService: ITokenService
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
        const token = this.tokenService.generateAccessToken(user._id);
        const refreshToken = this.tokenService.generateRefreshToken(user._id);

        return {
            success: true,
            message: 'Login successful',
            token,
            refreshToken,
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
        const tempToken = this.tokenService.generateTempToken(user._id);

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
        const token = this.tokenService.generateAccessToken(userId.toString());
        const refreshToken = this.tokenService.generateRefreshToken(userId.toString());

        return {
            success: true,
            message: 'OTP verified successfully',
            token,
            refreshToken,
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

    async googleAuth({ access_token, id_token }: GoogleAuthRequest): Promise<AuthResponse> {

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
        const token = this.tokenService.generateAccessToken(user._id);
        const refreshToken = this.tokenService.generateRefreshToken(user._id);

        return {
            success: true,
            message: 'Google authentication successful',
            token,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                phone: user.phone
            },
            isAdmin: user.role === "admin"

        };
    }

    async githubAuth(data: GitHubAuthRequest): Promise<AuthResponse> {
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
        const token = this.tokenService.generateAccessToken(user._id);
        const refreshToken = this.tokenService.generateRefreshToken(user._id);

        return {
            success: true,
            message: 'GitHub authentication successful',
            token,
            refreshToken,
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

        const tempToken = this.tokenService.generateTempToken(user._id);


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

    async refreshToken(token: string): Promise<{ success: boolean; token: string; }> {
        try {
            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as RefreshTokenPayload;
            const userId = decoded.userId;

            const newAccessToken = this.tokenService.generateAccessToken(userId.toString());

            return {
                success: true,
                token: newAccessToken
            };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
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