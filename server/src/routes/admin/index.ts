import { Router } from 'express';
import usersAdminRoutes from './usersAdminRoutes';
import problemsAdminRoutes from './problemsAdminRoutes';
import rewardsAdminRoutes from './rewardsAdminRoutes';
import levelsAdminRoutes from './levelsAdminRoutes';
import dashboardAdminRoutes from './dashboardAdminRoutes';

const router = Router();

router.use(usersAdminRoutes);
router.use(problemsAdminRoutes);
router.use(rewardsAdminRoutes);
router.use(levelsAdminRoutes);
router.use(dashboardAdminRoutes);

export default router;
