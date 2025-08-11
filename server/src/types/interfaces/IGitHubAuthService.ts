export interface IGitHubAuthService {
    exchangeCode(code: string): Promise<any>;
}
