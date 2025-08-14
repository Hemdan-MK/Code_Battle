import { ProblemRepository } from '../../repositories/ProblemRepository';
import { IProblem } from '../../models/interfaces/Index';

export class ProblemAdminService {
    constructor(private problemRepository: ProblemRepository) {}

    async createProblem(data: Partial<IProblem>): Promise<IProblem> {
        return await this.problemRepository.create(data);
    }

    async getProblemById(id: string): Promise<IProblem | null> {
        return await this.problemRepository.findById(id);
    }

    async getAllProblems(): Promise<IProblem[]> {
        return await this.problemRepository.findAll();
    }

    async updateProblem(id: string, data: Partial<IProblem>): Promise<IProblem | null> {
        return await this.problemRepository.update(id, data);
    }

    async deleteProblem(id: string): Promise<void> {
        await this.problemRepository.delete(id);
    }
}
