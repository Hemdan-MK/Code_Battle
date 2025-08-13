import { Request, Response } from 'express';
import { RewardAdminService } from '../../services/admin/rewardAdminService';

export class RewardsAdminController {
    constructor(private rewardAdminService: RewardAdminService) {}

    async createReward(req: Request, res: Response): Promise<void> {
        try {
            const reward = await this.rewardAdminService.createReward(req.body);
            res.status(201).json(reward);
        } catch (error) {
            res.status(500).json({ message: 'Error creating reward', error });
        }
    }

    async getRewardById(req: Request, res: Response): Promise<void> {
        try {
            const reward = await this.rewardAdminService.getRewardById(req.params.id);
            if (reward) {
                res.status(200).json(reward);
            } else {
                res.status(404).json({ message: 'Reward not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting reward', error });
        }
    }

    async getAllRewards(req: Request, res: Response): Promise<void> {
        try {
            const rewards = await this.rewardAdminService.getAllRewards();
            res.status(200).json(rewards);
        } catch (error) {
            res.status(500).json({ message: 'Error getting rewards', error });
        }
    }

    async updateReward(req: Request, res: Response): Promise<void> {
        try {
            const reward = await this.rewardAdminService.updateReward(req.params.id, req.body);
            if (reward) {
                res.status(200).json(reward);
            } else {
                res.status(404).json({ message: 'Reward not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating reward', error });
        }
    }

    async deleteReward(req: Request, res: Response): Promise<void> {
        try {
            await this.rewardAdminService.deleteReward(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting reward', error });
        }
    }
}
