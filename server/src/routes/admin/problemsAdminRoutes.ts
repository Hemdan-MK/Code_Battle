import { Router } from 'express';
import { ProblemsAdminController } from '../../controllers/admin/problemsAdminController';
import { ProblemAdminService } from '../../services/admin/problemAdminService';
import { ProblemRepository } from '../../repositories/ProblemRepository';
import { authenticateToken, checkRole } from '../../middleware/auth';

const router = Router();
const problemRepository = new ProblemRepository();
const problemService = new ProblemAdminService(problemRepository);
const problemsController = new ProblemsAdminController(problemService);

router.get('/problems', authenticateToken, checkRole('admin'), problemsController.getAllProblems.bind(problemsController));
router.get('/problem/:id', authenticateToken, checkRole('admin'), problemsController.getProblemById.bind(problemsController));
router.post('/problem', authenticateToken, checkRole('admin'), problemsController.createProblem.bind(problemsController));
router.put('/problem/:id', authenticateToken, checkRole('admin'), problemsController.updateProblem.bind(problemsController));
router.delete('/problem/:id', authenticateToken, checkRole('admin'), problemsController.deleteProblem.bind(problemsController));

export default router;
