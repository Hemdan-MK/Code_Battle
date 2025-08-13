import mongoose, { model, Schema } from "mongoose";
import { IUser } from "./interfaces/Index";

const userSchema = new Schema<IUser>({
    token: { type: String, required: false },
    username: { type: String, required: true },
    tag: { type: String, default: "codeBattle" },
    refreshToken: { type: String, },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true, },
    password: { type: String, required: false }, // Changed to not required
    role: { type: String, default: "user" },
    googleId: { type: String, default: null },
    githubId: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false, },
    isPhoneVerified: { type: Boolean, default: false, },
    status: {
        type: String,
        default: 'offline'
    },
    rank: { type: String, default: 'unranked' },
    level: { type: Number, default: 1 },
    xp: {
        type: Number,
        default: 10
    },
    elo: {
        type: Number,
        default: 1200
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    currentAvatar: { type: Schema.Types.ObjectId, ref: 'Avatar', default: null },
    currentTitle: { type: String, default: "Noobie" },

    collections: {
        Avatar: [{ type: Schema.Types.ObjectId, ref: 'Avatar' }],
        Title: [{ type: Schema.Types.ObjectId, ref: 'Title' }]
    },

    gamePlayed: { type: Number, default: 0 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    pendingFriendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true
});

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
