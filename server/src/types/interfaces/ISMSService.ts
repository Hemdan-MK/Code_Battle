export interface ISMSService {
    sendOTP(phoneNumber: string | number | null, otp: string): Promise<void>;
}
