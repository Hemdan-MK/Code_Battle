import api from "@/services/_axios/axios";
import type { IProblem } from "@/types/index";

interface GetProblemsResponse {
    success: boolean;
    data: IProblem[];
    message: string;
}

interface ProblemResponse {
    success: boolean;
    data: IProblem;
    message: string;
}

class ProblemService {
    private readonly baseUrl = '/admin/problems';

    async getProblems(): Promise<IProblem[]> {
        try {
            const response = await api.get<GetProblemsResponse>(`${this.baseUrl}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch problems');
        } catch (error) {
            console.error('Error fetching problems:', error);
            throw error;
        }
    }

    async getProblemById(id: string): Promise<IProblem> {
        try {
            const response = await api.get<ProblemResponse>(`${this.baseUrl}/${id}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch problem');
        } catch (error) {
            console.error('Error fetching problem:', error);
            throw error;
        }
    }

    async createProblem(problemData: Partial<IProblem>): Promise<IProblem> {
        try {
            const response = await api.post<ProblemResponse>(`${this.baseUrl}`, problemData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to create problem');
        } catch (error) {
            console.error('Error creating problem:', error);
            throw error;
        }
    }

    async updateProblem(id: string, problemData: Partial<IProblem>): Promise<IProblem> {
        try {
            const response = await api.put<ProblemResponse>(`${this.baseUrl}/${id}`, problemData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to update problem');
        } catch (error) {
            console.error('Error updating problem:', error);
            throw error;
        }
    }

    async deleteProblem(id: string): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error('Error deleting problem:', error);
            throw error;
        }
    }
}

const problemService = new ProblemService();
export default problemService;
