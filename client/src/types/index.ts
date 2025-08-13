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
    newSignups: number;
    ranks: Record<UserRank, number>;
}

export interface DashboardStats {
    userStats: UserStats;
    // TODO: Add other stats
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

export interface ApiResponse<T = unknown> {
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

export interface ITestCase {
    input: string;
    output: string;
    isPublic: boolean;
}

export interface IProblem {
    _id?: string;
    problemId: number;
    slug: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    categories: string[];
    description: string;
    constraints?: string | null;
    testCases: ITestCase[];
    functionSignature?: string | null;
    codeTemplates?: Map<string, string> | null;
    officialSolution?: string | null;
    createdBy?: string | null; // Assuming createdBy is a user ID string
    createdAt: Date;
    updatedAt: Date;
    status: 'draft' | 'published' | 'archived';
}

export interface IIssuedTo {
    userId?: string | null;
    issuedAt: Date;
    claimedAt?: Date | null;
    isClaimed: boolean;
}

export interface IReward {
    _id?: string;
    rewardId: number;
    name: string;
    description?: string | null;
    rewardType: 'avatar' | 'title';
    rewardImage?: string | null;
    avatar?: string | null;
    title?: string | null;
    unlockType: 'level_based' | 'rank_based';
    requiredLevel?: number | null;
    requiredRank?: number | null;
    issuedTo?: IIssuedTo[];
    startDate?: Date | null;
    endDate?: Date | null;
    status: 'active' | 'inactive' | 'expired';
    createdAt: Date;
    updatedAt: Date;
}

export interface ILevel {
    _id?: string;
    levelNumber: number;
    reward: string; // Reward ID
    description?: string | null;
    issuedTo?: IIssuedTo[];
    createdAt: Date;
    updatedAt: Date;
}