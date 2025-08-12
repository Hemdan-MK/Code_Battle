import { useEffect, useState } from "react";
import { Crown, Shield, Star, Target, Trophy, Zap } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";

interface User {
    _id: string;
    username: string;
    tag: string;
    email: string;
    phone: number;
    role: string;
    status: string;
    rank: string;
    level: number;
    xp: number;
    currentTitle: string;
    gamePlayed: number;
    friends: string[];
    currentAvatar?: {
        _id: string;
        imageUrl: string;
    };
}

const ProfileOverview = () => {
    const [user, setUser] = useState<User | null>(null);
    const { socket, isConnected } = useSocket();
    const [isLoading, setIsLoading] = useState(true);

    // Calculate XP progress for current level
    const calculateXPForLevel = (level: number) => {
        return level * 100; // Assuming 100 XP per level, adjust as needed
    };

    const getXPProgress = () => {
        if (!user) return { current: 0, required: 100, percentage: 0 };

        const currentLevelXP = calculateXPForLevel(user.level - 1);
        const nextLevelXP = calculateXPForLevel(user.level);
        const currentXP = user.xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        const percentage = Math.min((currentXP / requiredXP) * 100, 100);

        return {
            current: currentXP,
            required: requiredXP,
            percentage
        };
    };

    // Calculate win rate (assuming you'll add wins/losses to user model later)
    const calculateWinRate = () => {
        if (!user || user.gamePlayed === 0) return 0;
        // For now, using a placeholder calculation
        // You might want to add wins/losses fields to your user model
        return Math.min(Math.round((user.gamePlayed * 0.6)), 100); // Placeholder
    };

    const getRankColor = (rank: string) => {
        switch (rank.toLowerCase()) {
            case 'bronze': return 'text-orange-400';
            case 'silver': return 'text-gray-400';
            case 'gold': return 'text-yellow-400';
            case 'platinum': return 'text-blue-400';
            case 'diamond': return 'text-purple-400';
            case 'master': return 'text-red-400';
            default: return 'text-gray-500';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'busy': return 'bg-red-500';
            default: return 'bg-gray-500';
        }
    };

    useEffect(() => {
        // Define handlers to ensure stable function references for listeners
        const handleDetailResponse = (data: { user: User }) => {
            setUser(data.user);
            setIsLoading(false);
        };
        const handleError = (error: { message: string }) => {
            console.error('Socket error in ProfileOverview:', error);
            setIsLoading(false);
        };
        const handleConnectError = (error: { message: string }) => {
            console.error('Connection error in ProfileOverview:', error);
            setIsLoading(false);
        };

        if (socket) {
            // Set up listeners
            socket.on('detail_resp', handleDetailResponse);
            socket.on('error', handleError);
            socket.on('connect_error', handleConnectError);

            // Request data if we are already connected
            if (isConnected) {
                socket.emit('get_Details');
            }
        }

        // Cleanup function to remove listeners on component unmount or re-render
        return () => {
            if (socket) {
                socket.off('detail_resp', handleDetailResponse);
                socket.off('error', handleError);
                socket.off('connect_error', handleConnectError);
            }
        };
    }, [socket, isConnected]);

    if (isLoading) {
        return (
            <div className="pt-20 h-full flex flex-col p-6 bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-xl border-r border-purple-700/50">
                <div className="flex items-center justify-center h-full">
                    <div className="text-purple-400 text-sm">Loading profile...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="pt-20 h-full flex flex-col p-6 bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-xl border-r border-purple-700/50">
                <div className="flex items-center justify-center h-full">
                    <div className="text-red-400 text-sm">Failed to load profile</div>
                </div>
            </div>
        );
    }

    const xpProgress = getXPProgress();

    return (
        <div className="pt-20 h-full flex flex-col p-6 bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-xl border-r border-purple-700/50">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                            src={user.currentAvatar?.imageUrl || "/image/image-1.webp"}
                            alt="Profile Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/image/default-avatar.webp';
                            }}
                        />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${getStatusColor(user.status)} rounded-full border-2 border-black flex items-center justify-center`}>
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center justify-between text-xs mt-1">
                        <div className="flex items-center gap-x-2">
                            <h2 className="text-xl font-bold text-white">{user.username}</h2>
                            <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-xl shadow-sm gap-x-2">
                                <span className="text-cyan-300 text-sm font-light">#{user.tag}</span>
                            </div>                        </div>
                    </div>
                    <p className="text-cyan-400 text-sm font-semibold">{user.currentTitle}</p>
                </div>
            </div>

            {/* Level & XP */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm">Level {user.level}</span>
                    <span className="text-purple-400 text-xs">
                        {xpProgress.current} / {xpProgress.required} XP
                    </span>
                </div>
                <div className="w-full bg-purple-800 rounded-full h-2">
                    <div
                        className="bg-gradient-to-r from-cyan-500 to-purple-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${xpProgress.percentage}%` }}
                    ></div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">
                            {Math.round(user.gamePlayed * 0.6) || 0}
                        </span>
                    </div>
                    <p className="text-purple-400 text-xs">Wins</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Star className={`w-4 h-4 ${getRankColor(user.rank)}`} />
                        <span className="text-white font-semibold">{user.rank}</span>
                    </div>
                    <p className="text-purple-400 text-xs">Rank</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold">{calculateWinRate()}%</span>
                    </div>
                    <p className="text-purple-400 text-xs">Win Rate</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-semibold">{user.gamePlayed}</span>
                    </div>
                    <p className="text-purple-400 text-xs">Matches</p>
                </div>
            </div>

            {/* User Info */}
            {/* <div className="mb-4">
                <div className="bg-black/20 rounded-lg p-3 border border-purple-700/30">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-purple-300">Friends:</span>
                        <span className="text-white">{user.friends.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-purple-300">Tag:</span>
                        <span className="text-cyan-400">#{user.tag}</span>
                    </div>
                </div>
            </div> */}

            {/* Recent Achievements */}
            <div className="flex-1">
                <h3 className="text-white font-semibold mb-3 text-sm">Recent Achievements</h3>
                <div className="space-y-2">
                    {user.level >= 10 && (
                        <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                            <Crown className="w-4 h-4 text-yellow-400" />
                            <span className="text-purple-300 text-xs">Level Master</span>
                        </div>
                    )}
                    {user.gamePlayed >= 5 && (
                        <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-purple-300 text-xs">Veteran Player</span>
                        </div>
                    )}
                    {user.friends.length >= 3 && (
                        <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                            <Star className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-300 text-xs">Social Butterfly</span>
                        </div>
                    )}
                    {user.gamePlayed === 0 && (
                        <div className="text-purple-400 text-xs text-center py-4">
                            Play your first match to unlock achievements!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileOverview;