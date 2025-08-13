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

    addPassword = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];

            // Assuming the new password is in the body, will add validation schema later
            const { newPassword } = req.body;
            if (!newPassword) {
                return res.status(400).json({ message: 'New password is required' });
            }

            const result = await this.profileService.addPassword({ newPassword, token });
            return res.json(result);
        } catch (error) {
            next(error);
        }
    };

    getMatchHistory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const token = authHeader.split(' ')[1];

            const result = await this.profileService.getMatchHistory(token);
            return res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
