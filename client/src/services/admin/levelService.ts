import api from "@/services/_axios/axios";
import type { ILevel } from "@/types/index";

interface GetLevelsResponse {
    success: boolean;
    data: ILevel[];
    message: string;
}

interface LevelResponse {
    success: boolean;
    data: ILevel;
    message: string;
}

class LevelService {
    private readonly baseUrl = '/admin/levels';

    async getLevels(): Promise<ILevel[]> {
        try {
            const response = await api.get<GetLevelsResponse>(`${this.baseUrl}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch levels');
        } catch (error) {
            console.error('Error fetching levels:', error);
            throw error;
        }
    }

    async getLevelById(id: string): Promise<ILevel> {
        try {
            const response = await api.get<LevelResponse>(`${this.baseUrl}/${id}`);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to fetch level');
        } catch (error) {
            console.error('Error fetching level:', error);
            throw error;
        }
    }

    async createLevel(levelData: Partial<ILevel>): Promise<ILevel> {
        try {
            const response = await api.post<LevelResponse>(`${this.baseUrl}`, levelData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to create level');
        } catch (error) {
            console.error('Error creating level:', error);
            throw error;
        }
    }

    async updateLevel(id: string, levelData: Partial<ILevel>): Promise<ILevel> {
        try {
            const response = await api.put<LevelResponse>(`${this.baseUrl}/${id}`, levelData);
            if (response.data.success) {
                return response.data.data;
            }
            throw new Error(response.data.message || 'Failed to update level');
        } catch (error) {
            console.error('Error updating level:', error);
            throw error;
        }
    }

    async deleteLevel(id: string): Promise<void> {
        try {
            await api.delete(`${this.baseUrl}/${id}`);
        } catch (error) {
            console.error('Error deleting level:', error);
            throw error;
        }
    }
}

const levelService = new LevelService();
export default levelService;
