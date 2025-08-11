export interface IEmailService {
    sendOTP(email: string, otp: string, session: "forgot" | "signUp"): Promise<void>;
}
