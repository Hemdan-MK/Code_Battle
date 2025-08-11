export interface IGoogleAuthService {
    verifyToken(token: string): Promise<any>;
}
