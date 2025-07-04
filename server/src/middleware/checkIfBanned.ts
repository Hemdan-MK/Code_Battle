import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';


const JWT_SECRET = process.env.JWT_SECRET!

export const checkIfBanned = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        
        const token = authHeader.split(' ')[1];
        console.log(token);

        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

        console.log(decoded.id);
        const userRepository = new UserRepository();
        const user = await userRepository.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isBanned) {
            return res.status(403).json({ success: false, message: 'User is banned' });
        } else {

            next();
        }

    } catch (err) {
        console.error('Middleware error:', err);
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
};
