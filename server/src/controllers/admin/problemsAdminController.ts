import { Request, Response } from 'express';
import { ProblemAdminService } from '../../services/admin/problemAdminService';

export class ProblemsAdminController {
    constructor(private problemAdminService: ProblemAdminService) {}

    async createProblem(req: Request, res: Response): Promise<void> {
        try {
            const problem = await this.problemAdminService.createProblem(req.body);
            res.status(201).json(problem);
        } catch (error) {
            res.status(500).json({ message: 'Error creating problem', error });
        }
    }

    async getProblemById(req: Request, res: Response): Promise<void> {
        try {
            const problem = await this.problemAdminService.getProblemById(req.params.id);
            if (problem) {
                res.status(200).json(problem);
            } else {
                res.status(404).json({ message: 'Problem not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error getting problem', error });
        }
    }

    async getAllProblems(req: Request, res: Response): Promise<void> {
        try {
            const problems = await this.problemAdminService.getAllProblems();
            res.status(200).json(problems);
        } catch (error) {
            res.status(500).json({ message: 'Error getting problems', error });
        }
    }

    async updateProblem(req: Request, res: Response): Promise<void> {
        try {
            const problem = await this.problemAdminService.updateProblem(req.params.id, req.body);
            if (problem) {
                res.status(200).json(problem);
            } else {
                res.status(404).json({ message: 'Problem not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating problem', error });
        }
    }

    async deleteProblem(req: Request, res: Response): Promise<void> {
        try {
            await this.problemAdminService.deleteProblem(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting problem', error });
        }
    }
}
