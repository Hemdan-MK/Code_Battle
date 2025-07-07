import { Crown, Shield, Star, Target, Trophy, Zap } from "lucide-react";

const ProfileOverview = () => {
    return (
        <div className="pt-20 h-full flex flex-col p-6 bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-xl border-r border-purple-700/50">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full overflow-hidden">
                        <img
                            src="/image/image-1.webp"
                            alt="Profile Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/image/default-avatar.jpg';
                            }}
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">RaineShadow</h2>
                    <p className="text-cyan-400 text-sm font-semibold">TOXIC</p>
                </div>
            </div>

            {/* Level & XP */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-purple-300 text-sm">Level 47</span>
                    <span className="text-purple-400 text-xs">2,847 / 3,000 XP</span>
                </div>
                <div className="w-full bg-purple-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-400 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-white font-semibold">24</span>
                    </div>
                    <p className="text-purple-400 text-xs">Wins</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-purple-400" />
                        <span className="text-white font-semibold">Gold</span>
                    </div>
                    <p className="text-purple-400 text-xs">Rank</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Target className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold">87%</span>
                    </div>
                    <p className="text-purple-400 text-xs">Win Rate</p>
                </div>
                <div className="bg-black/40 rounded-lg p-3 border border-purple-700/50">
                    <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-white font-semibold">156</span>
                    </div>
                    <p className="text-purple-400 text-xs">Matches</p>
                </div>
            </div>

            {/* Recent Achievements */}
            <div className="flex-1">
                <h3 className="text-white font-semibold mb-3 text-sm">Recent Achievements</h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-purple-300 text-xs">First Blood</span>
                    </div>
                    <div className="flex items-center space-x-2 p-2 bg-black/20 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="text-purple-300 text-xs">Flawless Victory</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ProfileOverview;