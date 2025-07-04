import { SignupRequest, AuthResponse, JWTPayload, TempTokenPayload } from '../../types';

export interface IAuthService {
    login(email: string, password: string): Promise<AuthResponse>;
    signup(userData: SignupRequest): Promise<{ tempToken: string; message: string }>;
    verifyOTP(otp: string, tempToken: string, method: 'email' | 'phone'): Promise<AuthResponse>;
    resendOTP(tempToken: string, method: 'email' | 'phone'): Promise<void>;
    verifyToken(token: string): Promise<JWTPayload>;
    verifyTempToken(token: string): Promise<TempTokenPayload>;
}

