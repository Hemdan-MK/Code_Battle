import { UserRepository } from '../../repositories/UserRepository';
import { ProblemRepository } from '../../repositories/ProblemRepository';
import { RewardRepository } from '../../repositories/RewardRepository';

export class DashboardAdminService {
    constructor(
        private userRepository: UserRepository,
        private problemRepository: ProblemRepository,
        private rewardRepository: RewardRepository
    ) {}

    async getDashboardStats() {
        const userStats = await this.userRepository.getUserStats();
        const problemStats = await this.problemRepository.getProblemStats();
        const rewardStats = await this.rewardRepository.getRewardStats();

        return {
            userStats,
            problemStats,
            rewardStats
        };
    }
}
