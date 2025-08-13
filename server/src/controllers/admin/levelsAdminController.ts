import { Request, Response } from 'express';
import { LevelAdminService } from '../../services/admin/levelAdminService';

export class LevelsAdminController {
    constructor(private levelAdminService: LevelAdminService) {}

    async createLevel(req: Request, res: Response): Promise<void> {
        try {
            const level = await this.levelAdminService.createLevel(req.body);
            res.status(201).json(level);
        } catch (error) {
            res.status(500).json({ message: 'Error creating level', error });
        }
    }

    async getLevelById(req: Request, res: Response): Promise<void> {
        try {
            const level = await this.levelAdminService.getLevelById(req.params.id);
            if (level) {
                res.status(200).json(level);
            } else {
                res.status(404).json({ message: 'Level not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting level', error });
        }
    }

    async getAllLevels(req: Request, res: Response): Promise<void> {
        try {
            const levels = await this.levelAdminService.getAllLevels();
            res.status(200).json(levels);
        } catch (error) {
            res.status(500).json({ message: 'Error getting levels', error });
        }
    }

    async updateLevel(req: Request, res: Response): Promise<void> {
        try {
            const level = await this.levelAdminService.updateLevel(req.params.id, req.body);
            if (level) {
                res.status(200).json(level);
            } else {
                res.status(404).json({ message: 'Level not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating level', error });
        }
    }

    async deleteLevel(req: Request, res: Response): Promise<void> {
        try {
            await this.levelAdminService.deleteLevel(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting level', error });
        }
    }
}
