import jwt from 'jsonwebtoken';
import { AccessTokenPayload, RefreshTokenPayload, TempTokenPayload } from '../../types';
import { ITokenService } from '../../types/interfaces/ITokenService';

export class TokenService implements ITokenService {
    generateAccessToken(userId: string): string {
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

    generateRefreshToken(userId: string): string {
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

    generateTempToken(userId: string, purpose: 'otp_verification' | 'password_reset' | 'email_change' = 'otp_verification'): string {
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
}
