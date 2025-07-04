import bcrypt from 'bcrypt';

import { UserRepository } from '../../repositories/UserRepository';
import { CreateUser, UpdateUser, GetUsers } from '../../types/index';

export class UserService {

    constructor(private userRepository: UserRepository) { }

    async getUsers(query: GetUsers) {
        return await this.userRepository.getUsers(query);
    }

    async getUserById(id: string) {
        return await this.userRepository.findById(id);
    }

    async createUser(userData: CreateUser) {

        const existingUserByEmail = await this.userRepository.findByEmail(userData.email);
        if (existingUserByEmail) {
            throw new Error('User with this email already exists');
        }

        // Check if user already exists by username (if provided)
        if (userData.username) {
            const existingUserByUsername = await this.userRepository.findByUsername(userData.username);
            if (existingUserByUsername) {
                return new Error('User with this username already exists');
            }
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const userToCreate = {
            ...userData,
            password: hashedPassword,
            isEmailVerified : true
        };

        return await this.userRepository.create(userToCreate);
    }

    async updateUser(id: string, updateData: UpdateUser) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (updateData.email && updateData.email !== existingUser.email) {
            const userWithEmail = await this.userRepository.findByEmail(updateData.email);
            if (userWithEmail && userWithEmail.id !== id) {
                throw new Error('User with this email already exists');
            }
        }

        if (updateData.username && updateData.username !== existingUser.username) {
            const userWithUsername = await this.userRepository.findByUsername(updateData.username);
            if (userWithUsername && userWithUsername.id !== id) {
                throw new Error('User with this username already exists');
            }
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 12);
        }

        return await this.userRepository.update(id, updateData);
    }

    async banUser(id: string) {
        return await this.userRepository.banUser(id);
    }

    async getUserStats() {
        return await this.userRepository.getUserStats();
    }
}






// // services/userService.ts

// import { UserRepository } from '../../repositories/UserRepository';
// import {
//     User,
//     UserStats,
//     GetUsersQuery,
//     GetUsersResponse,
//     CreateUserDto,
//     UpdateUserDto,
//     UserFilters,
//     PaginationOptions
// } from '../types/user.types';


// export class UserService {
//     private userRepository: UserRepository;

//     constructor() {
//         this.userRepository = new UserRepository();
//     }

//     /**
//      * Get paginated users with filters
//      */
//     async getUsers(query: GetUsersQuery): Promise<GetUsersResponse> {
//         try {
//             const { page = 1, limit = 10, search = '', status } = query;

//             const filters: UserFilters = {
//                 search: search.trim(),
//                 status: status && status !== 'all' ? status : undefined
//             };

//             const paginationOptions: PaginationOptions = {
//                 page: Math.max(1, page),
//                 limit: Math.min(100, Math.max(1, limit)), // Limit max results to 100
//                 sortBy: 'createdAt',
//                 sortOrder: 'desc'
//             };

//             const result = await this.userRepository.findUsersWithPagination(
//                 filters,
//                 paginationOptions
//             );

//             return {
//                 users: result.users,
//                 totalPages: result.totalPages,
//                 totalUsers: result.totalCount,
//                 currentPage: paginationOptions.page
//             };
//         } catch (error) {
//             throw new Error('Failed to retrieve users' );
//         }
//     }

//     /**
//      * Get user statistics
//      */
//     async getUserStats(): Promise<UserStats> {
//         try {
//             const stats = await this.userRepository.getUserStats();
//             return stats;
//         } catch (error) {
//             throw new Error('Failed to retrieve user statistics');
//         }
//     }

//     /**
//      * Get user by ID
//      */
//     async getUserById(id: string): Promise<User | null> {
//         try {
//             if (!id) {
//                 throw new Error('User ID is required');
//             }

//             const user = await this.userRepository.findById(id);
//             return user;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to retrieve user');
//         }
//     }

//     /**
//      * Create new user
//      */
//     async createUser(userData: CreateUserDto): Promise<User> {
//         try {
//             // Check if user already exists
//             const existingUser = await this.userRepository.findByEmail(userData.email);
//             if (existingUser) {
//                 throw new Error('User with this email already exists');
//             }

//             const existingUsername = await this.userRepository.findByUsername(userData.username);
//             if (existingUsername) {
//                 throw new Error('Username is already taken');
//             }

//             // Hash password
//             const hashedPassword = await hashPassword(userData.password);

//             // Create user with default values
//             const newUserData: CreateUserDto & Partial<User> = {
//                 ...userData,
//                 password: hashedPassword,
//                 status: 'offline',
//                 rank: 'Silver',
//                 xp: 0,
//                 reports: 0
//             };

//             const user = await this.userRepository.create(newUserData);

//             // Remove password from response
//             const { password, ...userWithoutPassword } = user as any;
//             return userWithoutPassword;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to create user' );
//         }
//     }

//     /**
//      * Update user
//      */
//     async updateUser(id: string, updateData: UpdateUserDto): Promise<User> {
//         try {
//             const existingUser = await this.userRepository.findById(id);
//             if (!existingUser) {
//                 throw new Error('User not found' );
//             }

//             // If updating email, check for conflicts
//             if (updateData.email && updateData.email !== existingUser.email) {
//                 const emailExists = await this.userRepository.findByEmail(updateData.email);
//                 if (emailExists) {
//                     throw new Error('Email is already in use' );
//                 }
//             }

//             // If updating username, check for conflicts
//             if (updateData.username && updateData.username !== existingUser.username) {
//                 const usernameExists = await this.userRepository.findByUsername(updateData.username);
//                 if (usernameExists) {
//                     throw new Error('Username is already taken' );
//                 }
//             }

//             const updatedUser = await this.userRepository.update(id, updateData);
//             return updatedUser;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to update user' );
//         }
//     }

//     /**
//      * Ban user
//      */
//     async banUser(id: string): Promise<User> {
//         try {
//             const user = await this.userRepository.findById(id);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             if (user.status === 'banned') {
//                 throw new Error('User is already banned' );
//             }

//             const bannedUser = await this.userRepository.update(id, { status: 'banned' });

//             // Log ban action
//             await this.userRepository.logUserActivity(id, 'banned', 'User account banned');

//             return bannedUser;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to ban user' );
//         }
//     }

//     /**
//      * Unban user
//      */
//     async unbanUser(id: string): Promise<User> {
//         try {
//             const user = await this.userRepository.findById(id);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             if (user.status !== 'banned') {
//                 throw new Error('User is not banned' );
//             }

//             const unbannedUser = await this.userRepository.update(id, { status: 'offline' });

//             // Log unban action
//             await this.userRepository.logUserActivity(id, 'unbanned', 'User account unbanned');

//             return unbannedUser;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to unban user' );
//         }
//     }

//     /**
//      * Delete user
//      */
//     async deleteUser(id: string): Promise<void> {
//         try {
//             const user = await this.userRepository.findById(id);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             await this.userRepository.delete(id);

//             // Log deletion
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to delete user' );
//         }
//     }

//     /**
//      * Report user
//      */
//     async reportUser(userId: string, reporterId: string, reason: string): Promise<void> {
//         try {
//             const user = await this.userRepository.findById(userId);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             const reporter = await this.userRepository.findById(reporterId);
//             if (!reporter) {
//                 throw new Error('Reporter not found' );
//             }

//             // Check if already reported by this user
//             const existingReport = await this.userRepository.findUserReport(userId, reporterId);
//             if (existingReport) {
//                 throw new Error('You have already reported this user' );
//             }

//             // Create report
//             await this.userRepository.createUserReport(userId, reporterId, reason);

//             // Increment user's report count
//             await this.userRepository.update(userId, {
//                 reports: (user.reports || 0) + 1
//             });

//             // Log report activity
//             await this.userRepository.logUserActivity(
//                 userId,
//                 'reported',
//                 `Reported by user ${reporter.username}: ${reason}`
//             );
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to report user' );
//         }
//     }

//     /**
//      * Get user activity logs
//      */
//     async getUserActivity(userId: string, page: number = 1, limit: number = 20): Promise<any> {
//         try {
//             const user = await this.userRepository.findById(userId);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             const activity = await this.userRepository.getUserActivity(userId, page, limit);
//             return activity;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to retrieve user activity' );
//         }
//     }

//     /**
//      * Update user status (online/offline)
//      */
//     async updateUserStatus(id: string, status: 'online' | 'offline'): Promise<User> {
//         try {
//             const user = await this.userRepository.findById(id);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             if (user.status === 'banned') {
//                 throw new Error('Cannot update status of banned user', 403);
//             }

//             const updatedUser = await this.userRepository.update(id, {
//                 status,
//                 lastLogin: status === 'online' ? new Date() : user.lastLogin
//             });

//             return updatedUser;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to update user status' );
//         }
//     }

//     /**
//      * Add XP to user
//      */
//     async addUserXP(id: string, xpAmount: number): Promise<User> {
//         try {
//             const user = await this.userRepository.findById(id);
//             if (!user) {
//                 throw new Error('User not found' );
//             }

//             const newXP = (user.xp || 0) + xpAmount;
//             const newRank = this.calculateRank(newXP);

//             const updatedUser = await this.userRepository.update(id, {
//                 xp: newXP,
//                 rank: newRank
//             });

//             // Log XP gain
//             await this.userRepository.logUserActivity(
//                 id,
//                 'xp_gained',
//                 `Gained ${xpAmount} XP. Total: ${newXP}`
//             );

//             return updatedUser;
//         } catch (error) {
//             if (error instanceof Error) {
//                 throw error;
//             }
//             throw new Error('Failed to add user XP' );
//         }
//     }

//     /**
//      * Calculate user rank based on XP
//      */
//     private calculateRank(xp: number): 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Unranked' {
//         if (xp >= 10000) return 'Diamond';
//         if (xp >= 5000) return 'Platinum';
//         if (xp >= 1000) return 'Gold';
//         return 'Unranked';
//     }
// }