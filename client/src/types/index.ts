export interface DecodedToken {
    id: string;
    username: string;
    role: string;
}



// admin side
// ----------------

export type UserStatus = 'online' | 'offline' | 'banned' | 'away' | 'in game';
export type UserRank = 'unranked' | 'iron' | 'bronze' | 'silver' | 'gold' | 'diamond';

export interface User {
    _id?: string;
    id: string;
    username: string;
    email: string;
    phone: number;
    status: UserStatus;
    rank: UserRank;
    xp: number;
    joinDate: string;
    reports: number;
    createdAt: Date;
    updatedAt: Date;
    isBanned: boolean;
    lastLogin?: Date;
}

export interface UserStats {
    total: number;
    online: number;
    offline: number;
    banned: number;
    ranks: Record<UserRank, number>;
}

export interface GetUsersQuery {
    page?: number;
    limit?: number;
    search?: string;
    status?: UserStatus | 'all';
}

export interface GetUsersResponse {
    users: User[];
    totalPages: number;
    totalUsers: number;
    currentPage: number;
}

export interface BanUserRequest {
    action: 'ban' | 'unban';
}

export interface ApiResponse<T = any> {
    success: boolean;
    data: T;
    message?: string;
}

export interface CreateUser {
    username: string;
    email: string;
    password: string;
    phone: number;
    rank: UserRank;
    xp: number;
    role: 'admin' | 'user'
}

export interface UpdateUser {
    username: string;
    email: string;
    phone: number;
    rank?: UserRank;
    xp?: number;
    role: 'admin' | 'user'
}

export interface UserFilters {
    search?: string;
    status?: UserStatus;
    rank?: UserRank;
    minXp?: number;
    maxXp?: number;
}

export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: keyof User;
    sortOrder?: 'asc' | 'desc';
}