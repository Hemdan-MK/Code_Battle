import { IOTP, IUser } from "../../models/interfaces/Index";

export interface IUserRepository {
    create(userData: Partial<IUser>): Promise<IUser>;
    findById(id: string): Promise<IUser | null>;
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findByGoogleId(googleId: string): Promise<IUser | null>;
    findByGithubId(githubId: string): Promise<IUser | null>;
    update(id: string, updates: Partial<IUser>): Promise<IUser | null>;
    delete(id: string): Promise<boolean>;
    findByEmailWithPassword(email: string): Promise<IUser | null>;
}

export interface IOTPRepository {
    create(otpData: Partial<IOTP>): Promise<IOTP>;
    findByUserIdAndType(userId: string): Promise<IOTP | null>;
    deleteByUserIdAndType(userId: string,): Promise<boolean>;
    deleteExpired(): Promise<number>;
}