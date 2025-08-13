import api from "@/services/_axios/axios";
import type { IReward } from "@/types/index";

interface GetRewardsResponse {
    success: boolean;
    data: IReward[];
    message: string;
}

interface RewardResponse {
    success: boolean;
    data: IReward;
    message: string;
}

class RewardService {
    private readonly baseUrl = '/admin/rewards';

    async getRewards(): Promise<IReward[]> {
        try {
            const response = await api.get<GetRewardsResponse>(`${this.baseUrl}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch rewards');
        } catch (error) {
            console.error('Error fetching rewards:', error);
            throw error;
        }
    }

    async getRewardById(id: string): Promise<IReward> {
        try {
            const response = await api.get<RewardResponse>(`${this.baseUrl}/${id}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch reward');
        } catch (error) {
            console.error('Error fetching reward:', error);
            throw error;
        }
    }

    async createReward(rewardData: Partial<IReward>): Promise<IReward> {
        try {
            const response = await api.post<RewardResponse>(`${this.baseUrl}`, rewardData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to create reward');
        } catch (error) {
            console.error('Error creating reward:', error);
            throw error;
        }
    }

    async updateReward(id: string, rewardData: Partial<IReward>): Promise<IReward> {
        try {
            const response = await api.put<RewardResponse>(`${this.baseUrl}/${id}`, rewardData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to update reward');
        } catch (error) {
            console.error('Error updating reward:', error);
            throw error;
        }
    }

    async deleteReward(id: string): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error('Error deleting reward:', error);
            throw error;
        }
    }
}

const rewardService = new RewardService();
export default rewardService;
