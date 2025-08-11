// services/admin/userService.ts

import api from "@/services/_axios/axios";
import type { User, UserStats, UserStatus, CreateUser, UpdateUser } from "@/types/index";

interface GetUsersResponse {
    success: boolean;
    data: {
        users: User[];
        totalCount: number;
        totalPages: number;
    }
    message: string;
}

interface UserResponse {
    success: boolean;
    data: User;
    message: string;
}

interface UserStatsResponse {
    success: boolean;
    data: UserStats;
    message: string;
}

class UserService {
    private readonly baseUrl = '/admin';

    /**
     * Get paginated users with filters
     */
    async getUsers(
        page: number = 1,
        limit: number = 10,
        search: string = '',
        status: UserStatus | 'all' = 'all'
    ): Promise<{
        users: User[];
        totalPages: number;
        totalUsers: number;
    }> {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search,
                status
            });

            const response = await api.get<GetUsersResponse>(`${this.baseUrl}/users?${params}`);

            if (response.data.success) {
                return {
                    users: response.data.data.users,
                    totalPages: response.data.data.totalPages,
                    totalUsers: response.data.data.totalCount
                };
            }

            throw new Error(response.data.message || 'Failed to fetch users');
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        try {
            const response = await api.get<UserResponse>(`${this.baseUrl}/user/${id}`);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch user');
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    /**
     * Create new user
     */
    async createUser(userData: CreateUser): Promise<User> {
        try {
            console.log(userData);
            
            const response = await api.post<UserResponse>(`${this.baseUrl}/create`, userData);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to create user');
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    /**
     * Get user data for edit modal
     */
    async getUserForEdit(id: string): Promise<User> {
        try {
            const response = await api.get<UserResponse>(`${this.baseUrl}/edit/${id}`);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to fetch user for edit');
        } catch (error) {
            console.error('Error fetching user for edit:', error);
            throw error;
        }
    }

    /**
     * Update user
     */
    async updateUser(id: string, updateData: UpdateUser): Promise<User> {
        try {
            const response = await api.put<UserResponse>(`${this.baseUrl}/update/${id}`, updateData);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || 'Failed to update user');
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    }

    /**
     * Ban/Unban user
     */
    async banUser(userId: string, action: 'ban' | 'unban' = 'ban'): Promise<User> {
        try {
            console.log("userId : ", userId);

            const response = await api.patch<UserResponse>(`${this.baseUrl}/user-ban/${userId}`);

            if (response.data.success) {
                return response.data.data;
            }

            throw new Error(response.data.message || `Failed to ${action} user`);
        } catch (error) {
            console.error(`Error ${action}ning user:`, error);
            throw error;
        }
    }

    /**
     * Get user statistics
     */
    async getUserStats(): Promise<UserStats> {
        try {
            // Note: You'll need to implement this endpoint in your backend
            const response = await api.get<UserStatsResponse>(`${this.baseUrl}/users/stats`);


            if (response.data.success) {
                return response.data.data;
            }



            throw new Error(response.data.message || 'Failed to fetch user stats');
        } catch (error) {
            console.error('Error fetching user stats:', error);
            // Return default stats if endpoint doesn't exist yet
            return {
                total: 0,
                online: 0,
                offline: 0,
                banned: 0,
                ranks: { Diamond: 0, Platinum: 0, Gold: 0, Silver: 0, Unranked: 0 }
            };
        }
    }
}

const userService = new UserService();
export default userService;