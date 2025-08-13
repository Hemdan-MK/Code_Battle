import { Request, Response } from 'express';
import { DashboardAdminService } from '../../services/admin/dashboardAdminService';

export class DashboardAdminController {
    constructor(private dashboardAdminService: DashboardAdminService) {}

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this.dashboardAdminService.getDashboardStats();
            res.status(200).json(stats);
        } catch (error) {
            res.status(500).json({ message: 'Error getting dashboard stats', error });
        }
    }
}
