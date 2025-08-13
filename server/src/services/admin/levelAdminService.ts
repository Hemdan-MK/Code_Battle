import { LevelRepository } from '../../repositories/LevelRepository';
import { ILevel } from '../../models/interfaces/Index';

export class LevelAdminService {
    constructor(private levelRepository: LevelRepository) {}

    async createLevel(data: Partial<ILevel>): Promise<ILevel> {
        return await this.levelRepository.create(data);
    }

    async getLevelById(id: string): Promise<ILevel | null> {
        return await this.levelRepository.findById(id);
    }

    async getAllLevels(): Promise<ILevel[]> {
        return await this.levelRepository.findAll();
    }

    async updateLevel(id: string, data: Partial<ILevel>): Promise<ILevel | null> {
        return await this.levelRepository.update(id, data);
    }

    async deleteLevel(id: string): Promise<void> {
        await this.levelRepository.delete(id);
    }
}
