import api from "@/services/_axios/axios";
import type { DashboardStats } from "@/types/index";

interface DashboardStatsResponse {
    success: boolean;
    data: DashboardStats;
    message: string;
}

class DashboardService {
    private readonly baseUrl = '/admin/dashboard';

    async getDashboardStats(): Promise<DashboardStats> {
        try {
            const response = await api.get<DashboardStatsResponse>(`${this.baseUrl}/stats`);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch dashboard stats');
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }
}

const dashboardService = new DashboardService();
export default dashboardService;
