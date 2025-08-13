import Level from '../models/Level';
import { ILevel } from '../models/interfaces/Index';

export class LevelRepository {
    async create(data: Partial<ILevel>): Promise<ILevel> {
        const level = new Level(data);
        return await level.save();
    }

    async findById(id: string): Promise<ILevel | null> {
        return await Level.findById(id);
    }

    async findByLevel(level: number): Promise<ILevel | null> {
        return await Level.findOne({ levelNumber: level });
    }

    async findAll(): Promise<ILevel[]> {
        return await Level.find();
    }

    async update(id: string, data: Partial<ILevel>): Promise<ILevel | null> {
        return await Level.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<void> {
        await Level.findByIdAndDelete(id);
    }
}
