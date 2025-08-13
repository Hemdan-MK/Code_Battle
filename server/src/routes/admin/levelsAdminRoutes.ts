import { Router } from 'express';
import { LevelsAdminController } from '../../controllers/admin/levelsAdminController';
import { LevelAdminService } from '../../services/admin/levelAdminService';
import { LevelRepository } from '../../repositories/LevelRepository';
import { authenticateToken, checkRole } from '../../middleware/auth';

const router = Router();
const levelRepository = new LevelRepository();
const levelService = new LevelAdminService(levelRepository);
const levelsController = new LevelsAdminController(levelService);

router.get('/levels', authenticateToken, checkRole('admin'), levelsController.getAllLevels.bind(levelsController));
router.get('/level/:id', authenticateToken, checkRole('admin'), levelsController.getLevelById.bind(levelsController));
router.post('/level', authenticateToken, checkRole('admin'), levelsController.createLevel.bind(levelsController));
router.put('/level/:id', authenticateToken, checkRole('admin'), levelsController.updateLevel.bind(levelsController));
router.delete('/level/:id', authenticateToken, checkRole('admin'), levelsController.deleteLevel.bind(levelsController));

export default router;
