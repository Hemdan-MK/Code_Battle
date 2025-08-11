import { Request, Response, NextFunction } from 'express';
import { ProfileService } from '../../services/user/profileService';
import { updateUsername, updatePassword } from '../../schemas/authSchemas';

export class ProfileController {
    constructor(private profileService: ProfileService) { }

    details = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];

            const result = await this.profileService.details(token);
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    updateUsername = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];

            const validatedData = updateUsername.parse(req.body);
            const result = await this.profileService.updateUsername({ ...validatedData, token });
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];

            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];

            const validatedData = updatePassword.parse(req.body);
            const result = await this.profileService.updatePassword({ ...validatedData, token });
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };
}
