// socket/auth/authHandler.ts
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { IUser } from '../../../models/interfaces/Index';

interface JwtPayload {
    userId: string;
}

declare module "socket.io" {
    interface Socket {
        userId?: string;
        user?: IUser;
    }
}

export const setupAuth = (io: Server) => {
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            console.log("Authentication token received:", token);

            if (!token) {
                return next(new Error('No token provided'));
            }

            // Verify JWT token with proper typing
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
            console.log("Token decoded:", decoded);

            // Validate user exists in database
            const user = await User.findById(decoded.userId).select('_id username currentAvatar tag');

            if (!user) {
                return next(new Error('User not found'));
            }

            // Attach user info to socket
            socket.userId = user._id.toString();
            socket.user = user;

            next();
        } catch (error: any) {
            console.error('Socket authentication error:', error);
            if (error.name === 'JsonWebTokenError') {
                next(new Error('Invalid token'));
            } else if (error.name === 'TokenExpiredError') {
                next(new Error('Token expired'));
            } else {
                next(new Error('Authentication failed'));
            }
        }
    });
};