import Reward from '../models/Reward';
import { IReward } from '../models/interfaces/Index';

export class RewardRepository {
    async create(data: Partial<IReward>): Promise<IReward> {
        const reward = new Reward(data);
        return await reward.save();
    }

    async findById(id: string): Promise<IReward | null> {
        return await Reward.findById(id);
    }

    async findAll(): Promise<IReward[]> {
        return await Reward.find();
    }

    async update(id: string, data: Partial<IReward>): Promise<IReward | null> {
        return await Reward.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await Reward.findByIdAndDelete(id);
    }

    async getRewardStats(): Promise<{ total: number; claimed: number; active: number; expired: number; }> {
        const total = await Reward.countDocuments();
        const claimed = await Reward.countDocuments({ 'issuedTo.isClaimed': true });
        const active = await Reward.countDocuments({ status: 'active' });
        const expired = await Reward.countDocuments({ status: 'expired' });
        return { total, claimed, active, expired };
    }
}
