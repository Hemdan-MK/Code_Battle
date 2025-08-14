import { Router } from 'express';
import { RewardsAdminController } from '../../controllers/admin/rewardsAdminController';
import { RewardAdminService } from '../../services/admin/rewardAdminService';
import { RewardRepository } from '../../repositories/RewardRepository';
import { authenticateToken, checkRole } from '../../middleware/auth';

const router = Router();
const rewardRepository = new RewardRepository();
const rewardService = new RewardAdminService(rewardRepository);
const rewardsController = new RewardsAdminController(rewardService);

router.get('/rewards', authenticateToken, checkRole('admin'), rewardsController.getAllRewards.bind(rewardsController));
router.get('/rewards/:id', authenticateToken, checkRole('admin'), rewardsController.getRewardById.bind(rewardsController));
router.post('/rewards', authenticateToken, checkRole('admin'), rewardsController.createReward.bind(rewardsController));
router.put('/rewards/:id', authenticateToken, checkRole('admin'), rewardsController.updateReward.bind(rewardsController));
router.delete('/rewards/:id', authenticateToken, checkRole('admin'), rewardsController.deleteReward.bind(rewardsController));

export default router;
