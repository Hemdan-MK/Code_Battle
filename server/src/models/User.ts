import { model, Schema } from "mongoose";
import { IUser } from "./interfaces/Index";
import { number } from "zod";

const userSchema = new Schema<IUser>({
    token: { type: String, required: false },
    username: { type: String, required: true },
    refreshToken: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false, },
    isPhoneVerified: { type: Boolean, default: false, },
    status: {
        type: String,
        default: 'offline'
    },
    rank: { type: String, default: 'Unranked' },
    xp: {
        type: Number,
        default: 10
    },
    isBanned: {
        type: Boolean,
        default: false
    },

    // GamePlayed: { type: Number, default: 0 },
    // Rank: { type: String, default: null },
    // Profileimage: { type: String, default: null },
    // CurrentAvatar: { type: Schema.Types.ObjectId, ref: 'Avatar', default: null },
    // CurrentTitle: { type: String, default: null },
    // Level: { type: Number, default: 1 },
    // Online: { type: Boolean, default: false },
    // XP: { type: Number, default: 0 },
    // collections: {
    //     Avatar: [{ type: Schema.Types.ObjectId, ref: 'Avatar' }],
    //     Title: [{ type: Schema.Types.ObjectId, ref: 'Title' }]
    // },
    Timestamp: { type: Date, default: Date.now },
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
