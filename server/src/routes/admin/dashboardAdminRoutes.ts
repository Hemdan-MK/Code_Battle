import { Router } from 'express';
import { DashboardAdminController } from '../../controllers/admin/dashboardAdminController';
import { DashboardAdminService } from '../../services/admin/dashboardAdminService';
import { UserRepository } from '../../repositories/UserRepository';
import { ProblemRepository } from '../../repositories/ProblemRepository';
import { RewardRepository } from '../../repositories/RewardRepository';
import { authenticateToken, checkRole } from '../../middleware/auth';

const router = Router();
const userRepository = new UserRepository();
const problemRepository = new ProblemRepository();
const rewardRepository = new RewardRepository();
const dashboardService = new DashboardAdminService(userRepository, problemRepository, rewardRepository);
const dashboardController = new DashboardAdminController(dashboardService);

router.get('/dashboard/stats', authenticateToken, checkRole('admin'), dashboardController.getDashboardStats.bind(dashboardController));

export default router;
