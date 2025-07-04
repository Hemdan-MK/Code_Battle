import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/UserRepository';
import { AccessTokenPayload } from '../types/index';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AccessTokenPayload;

    // Verify token type
    if (decoded.type !== 'access') {
      res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
      return;
    }

    // Verify user exists
    const userRepository = new UserRepository();
    const user = await userRepository.findById(decoded.userId.toString());

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    req.user = { userId: decoded.userId.toString() };
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};
