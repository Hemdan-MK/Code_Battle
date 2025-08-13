import Problem from '../models/Problem';
import { IProblem } from '../models/interfaces/Index'; // I'll need to create this interface

export class ProblemRepository {
    async create(data: Partial<IProblem>): Promise<IProblem> {
        const problem = new Problem(data);
        return await problem.save();
    }

    async findById(id: string): Promise<IProblem | null> {
        return await Problem.findById(id);
    }

    async findAll(): Promise<IProblem[]> {
        return await Problem.find();
    }

    async update(id: string, data: Partial<IProblem>): Promise<IProblem | null> {
        return await Problem.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await Problem.findByIdAndDelete(id);
    }
}
