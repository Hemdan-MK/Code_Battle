import jwt, { JwtPayload } from 'jsonwebtoken';
import { IUserRepository } from '../../repositories/interfaces';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import Match from '../../models/Match';



export interface UserProfileResponse {
    username: string;
    tag: string;
    email: string;
    phone: number | null;
    rank: 'unranked' | 'iron' | 'bronze' | 'silver' | 'gold' | 'diamond';
    level?: number;
    xp: number;
    hasPassword?: boolean;
    currentAvatar?: Types.ObjectId | null;
    currentTitle?: string;
    collections?: {
        Avatar: Types.ObjectId[];
        Title: Types.ObjectId[];
    };
    gamePlayed?: number;
    friends: Types.ObjectId[];
    pendingFriendRequests?: Types.ObjectId[];
}

interface Response {
    success: boolean;
    message: string;
}



export class ProfileService {
    constructor(
        private userRepository: IUserRepository,
    ) { }

    async details(token: string): Promise<UserProfileResponse> {

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

        const user = await this.userRepository.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }
        return {
            username: user.username,
            tag: user.tag,
            email: user.email,
            phone: user.phone,
            rank: user.rank,
            level: user.level,
            xp: user.xp,
            hasPassword: !!user.password, // Check if password field exists and is not empty
            currentAvatar: user.currentAvatar,
            currentTitle: user.currentTitle,
            collections: user.collections,
            gamePlayed: user.gamePlayed,
            friends: user.friends,
            pendingFriendRequests: user.pendingFriendRequests
        }
    }

    async updateUsername(data: {
        username: string;
        tag: string;
        token: string;
    }): Promise<Response> {
        const { username, tag, token } = data

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

        const user = await this.userRepository.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }
        await this.userRepository.update(user._id, { username: username, tag: tag })
        return {
            success: true,
            message: "username updation success"
        };
    }

    async updatePassword(data: {
        currentPassword: string;
        newPassword: string;
        token: string;
    }): Promise<Response> {
        const { currentPassword, newPassword, token } = data

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

        const user = await this.userRepository.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPassword) {
            return {
                success :false,
                message : 'Check your Current password ...pls'
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const updatedUser = await this.userRepository.update(user._id, {
            password: hashedPassword
        });

        if (!updatedUser) {
            throw new Error('Failed to update password');
        }


        return {
            success: true,
            message: "password updation success"
        };
    }

    async addPassword(data: {
        newPassword: string;
        token: string;
    }): Promise<Response> {
        const { newPassword, token } = data;

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
        const user = await this.userRepository.findById(decoded.userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.hasPassword) {
            throw new Error('User already has a password. Use the change password functionality.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await this.userRepository.update(user._id, {
            password: hashedPassword,
            hasPassword: true
        });

        return {
            success: true,
            message: "Password added successfully"
        };
    }

    async getMatchHistory(token: string): Promise<any[]> {
        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
        const userId = new Types.ObjectId(decoded.userId);

        const matches = await Match.find({ "teams.players.userId": userId })
            .sort({ date: -1 })
            .limit(20); // Limit to the last 20 matches for performance

        return matches;
    }
}