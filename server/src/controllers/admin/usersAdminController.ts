// controllers/userController.ts

import { Request, Response, NextFunction } from 'express';
import { UserAdminService } from '../../services/admin/userAdminService';
import { GetUsers, CreateUser, UpdateUser } from '../../types/index';
import { io } from '../../server';
import { activeUsers } from '../../socket/store/userStore';


export class UsersAdminController {

    constructor(private userService: UserAdminService) { }

    /**
     * Get paginated users with filters
     */
    async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const statusRaw = req.query.status;

            const query: GetUsers = {
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10,
                search: (req.query.search as string) || '',
                status: (statusRaw === 'banned') ? 'banned' : 'all'
            };

            const result = await this.userService.getUsers(query);
            
            const response = {
                success: true,
                data: {
                    users: result.users,
                    totalPages: result.totalPages,
                    totalCount: result.totalCount
                },
                message: 'Users retrieved successfully'
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }


    /**
     * Get user by ID
     */
    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.userService.getUserById(id);

            if (!user) {
                throw new Error('User not found');
            }

            const response = {
                success: true,
                data: user,
                message: 'User retrieved successfully'
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new user
     */
    async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData: CreateUser = req.body;
            console.log(userData);
            
            const newUser = await this.userService.createUser(userData);

            const response = {
                success: true,
                data: newUser,
                message: 'User created successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * edit button modal 
     */
    async editRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;

            const userInfo = await this.userService.getUserById(id)

            const response = {
                success: true,
                data: userInfo,
                message: 'User details passed successfully'
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
    /**
     * Update user
     */
    async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const updateData: UpdateUser = req.body;

            const updatedUser = await this.userService.updateUser(id, updateData);

            const response = {
                success: true,
                data: updatedUser,
                message: 'User updated successfully'
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Ban user
     */
    async banStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const bannedUser = await this.userService.banUser(id);

            // Check if the banned user is currently online
            const activeUser = activeUsers.get(id);
            if (activeUser) {
                const socketId = activeUser.socketId;
                const socket = io.sockets.sockets.get(socketId);
                if (socket) {
                    // Notify the user they have been banned
                    socket.emit('you_are_banned', { message: 'You have been banned by an administrator.' });

                    // Force disconnect the user
                    socket.disconnect(true);
                }
            }

            const response = {
                success: true,
                data: bannedUser,
                message: 'User banned successfully'
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const stats = await this.userService.getUserStats();

            res.status(200).json({
                success: true,
                message: "User statistics fetched successfully",
                data: stats,
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Something went wrong while fetching user stats",
            });
        }
    };
}