export const JWT_EXPIRES_IN = '1h';
export const JWT_REFRESH_EXPIRES_IN = '7d';
export const JWT_TEMP_EXPIRES_IN = '1h';
export const OTP_EXPIRES_IN_MINUTES = 10;
export const OTP_LENGTH = 6;

export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_NOT_FOUND: 'User not found',
    USER_ALREADY_EXISTS: 'User with this email already exists',
    USERNAME_TAKEN: 'Username is already taken',
    INVALID_OTP: 'Invalid OTP',
    OTP_EXPIRED: 'OTP expired',
    EMAIL_NOT_VERIFIED: 'Please verify your email before logging in',
    TEMP_TOKEN_REQUIRED: 'Temporary token required',
    ACCESS_TOKEN_REQUIRED: 'Access token required',
    INVALID_TOKEN: 'Invalid or expired token',
    GOOGLE_AUTH_FAILED: 'Google authentication failed',
    GITHUB_AUTH_FAILED: 'GitHub authentication failed'
};