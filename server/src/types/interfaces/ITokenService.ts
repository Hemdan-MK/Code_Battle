export interface ITokenService {
    generateAccessToken(userId: string): string;
    generateRefreshToken(userId: string): string;
    generateTempToken(userId: string, purpose?: 'otp_verification' | 'password_reset' | 'email_change'): string;
}
