import { RewardRepository } from '../../repositories/RewardRepository';
import { IReward } from '../../models/interfaces/Index';

export class RewardAdminService {
    constructor(private rewardRepository: RewardRepository) {}

    async createReward(data: Partial<IReward>): Promise<IReward> {
        return await this.rewardRepository.create(data);
    }

    async getRewardById(id: string): Promise<IReward | null> {
        return await this.rewardRepository.findById(id);
    }

    async getAllRewards(): Promise<IReward[]> {
        return await this.rewardRepository.findAll();
    }

    async updateReward(id: string, data: Partial<IReward>): Promise<IReward | null> {
        return await this.rewardRepository.update(id, data);
    }

    async deleteReward(id: string): Promise<void> {
        await this.rewardRepository.delete(id);
    }
}
