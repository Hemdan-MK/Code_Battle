import {
    LoginRequest,
    SignupRequest,
    OTPVerificationRequest,
    ResendOTPRequest,
    GoogleAuthRequest,
    GitHubAuthRequest,
    forgotPassword,
    SignupResponse,
    AuthResponse
} from '../index';

export interface IAuthService {
    login(data: LoginRequest): Promise<AuthResponse>;
    signup(data: SignupRequest): Promise<SignupResponse>;
    verifyOTP(data: OTPVerificationRequest): Promise<AuthResponse>;
    resendOTP(data: ResendOTPRequest): Promise<{ success: boolean, message: string }>;
    googleAuth(data: GoogleAuthRequest): Promise<AuthResponse>;
    githubAuth(data: GitHubAuthRequest): Promise<AuthResponse>;
    forgotPassword(data: forgotPassword): Promise<{ success: boolean; message: string; userExists: boolean; tempToken?: string; }>;
    verifyResetPassword(otp: string, tempToken: string): Promise<{ success: boolean; isCorrect: boolean; message: string; }>;
    resetNewPassword(password: string, tempToken: string): Promise<{ success: boolean; message: string; }>;
    refreshToken(token: string): Promise<{ success: boolean; token: string; }>;
}
