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
    googleAuth(data: GoogleAuthRequest): Promise<{ success: boolean; message: string; token: string; user: any; isAdmin: boolean; }>;
    githubAuth(data: GitHubAuthRequest): Promise<{ success: boolean; message: string; token: string; user: any; isAdmin?: boolean }>;
    forgotPassword(data: forgotPassword): Promise<{ success: boolean; message: string; userExists: boolean; tempToken?: string; }>;
    verifyResetPassword(otp: string, tempToken: string): Promise<{ success: boolean; isCorrect: boolean; message: string; }>;
    resetNewPassword(password: string, tempToken: string): Promise<{ success: boolean; message: string; }>;
}
