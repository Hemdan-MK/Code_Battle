import { IUser } from "../models/interfaces/Index";
import User from "../models/User";
import { GetUsers, UserRank, UserStats, UserStatus } from "../types";
import { IUserRepository } from "./interfaces";



export class UserRepository implements IUserRepository {

  async create(userData: Partial<IUser>): Promise<IUser> {
    
    const user = new User(userData);

    return await user.save();
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async findByGoogleId(googleId: string): Promise<IUser | null> {
    return await User.findOne({ googleId });
  }

  async findByGithubId(githubId: string): Promise<IUser | null> {
    return await User.findOne({ githubId });
  }

  async update(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  async banUser(id: string): Promise<boolean> {
    const user = await User.findById(id);
    if (!user) return false;
    const result = await User.findByIdAndUpdate(id, { isBanned: !user.isBanned });
    return !!result
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async getUsers({ page, limit, search, status }: GetUsers) {
    const query: any = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Query by isBanned field
    if (status === 'banned') {
      query.isBanned = true;
    }

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    return {
      users,
      totalCount,
      totalPages,
    };
  }


  async getUserStats(): Promise<UserStats> {
    const users = await User.find();

    const stats: UserStats = {
      total: users.length,
      online: 0,
      offline: 0,
      banned: 0,
      ranks: {
        diamond: 0,
        gold: 0,
        silver: 0,
        bronze: 0,
        iron: 0,
        unranked: 0
      }
    };

    users.forEach(user => {
      const status = user.status as UserStatus;
      const rank = user.rank as UserRank;

      if (status === 'online') stats.online++;
      if (status === 'offline') stats.offline++;
      if (status === 'banned') stats.banned++;

      if (rank in stats.ranks) stats.ranks[rank]++;
    });

    return stats;
  }

}
