import mongoose, { Schema } from "mongoose";
import { IOTP } from "./interfaces/Index";

const otpSchema = new Schema<IOTP>({
    userId: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    session: {
        type: String,
        enum: ['forgot' , 'signUp']
    },
    expiresAt: {
        type: Date,
        required: true,
        expires: 0
    }
}, {
    timestamps: true
});


export const OTP = mongoose.model<IOTP>('OTP', otpSchema);
