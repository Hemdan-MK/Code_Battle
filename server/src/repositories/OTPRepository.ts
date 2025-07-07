import { IOTP } from "../models/interfaces/Index";
import { OTP } from "../models/OTP";
import { IOTPRepository } from "./interfaces";

export class OTPRepository implements IOTPRepository {
    async create(otpData: Partial<IOTP>): Promise<IOTP> {
        const otp = new OTP(otpData);
        return await otp.save();
    }

    async findByUserIdAndType(userId: string): Promise<IOTP | null> {
        return await OTP.findOne({ userId });
    }

    async deleteByUserIdAndType(userId: string): Promise<boolean> {
        const result = await OTP.deleteOne({ userId });
        return result.deletedCount > 0;
    }

    async deleteExpired(): Promise<number> {
        const result = await OTP.deleteMany({ expiresAt: { $lt: new Date() } });
        return result.deletedCount;
    }
}
