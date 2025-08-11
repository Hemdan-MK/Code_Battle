import { Trophy, Lock } from "lucide-react";
import { useState } from "react";


interface Avatar {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'iconic';
    icon: string;
    unlocked: boolean;
}

interface Title {
    id: string;
    name: string;
    description: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'iconic';
    unlocked: boolean;
}



const RewardsSection = () => {
    const [selectedAvatar, setSelectedAvatar] = useState('avatar-1');
    const [selectedTitle, setSelectedTitle] = useState('title-1');

    const avatars: Avatar[] = [
        { id: 'avatar-1', name: 'Cyber Warrior', rarity: 'common', icon: '🤖', unlocked: true },
        { id: 'avatar-2', name: 'Code Ninja', rarity: 'rare', icon: '🥷', unlocked: true },
        { id: 'avatar-3', name: 'Digital Wizard', rarity: 'epic', icon: '🧙‍♂️', unlocked: true },
        { id: 'avatar-4', name: 'Quantum Hacker', rarity: 'legendary', icon: '👨‍💻', unlocked: false },
        { id: 'avatar-5', name: 'AI Overlord', rarity: 'legendary', icon: '🤖', unlocked: false },
        { id: 'avatar-6', name: 'Bug Hunter', rarity: 'rare', icon: '🐛', unlocked: true },
    ];

    const titles: Title[] = [
        { id: 'title-1', name: 'Code Apprentice', description: 'Complete your first battle', rarity: 'common', unlocked: true },
        { id: 'title-2', name: 'Victory Seeker', description: 'Win 10 battles', rarity: 'rare', unlocked: true },
        { id: 'title-3', name: 'Algorithm Master', description: 'Solve 50 challenges', rarity: 'epic', unlocked: true },
        { id: 'title-4', name: 'Grand Champion', description: 'Reach top 100 leaderboard', rarity: 'legendary', unlocked: false },
        { id: 'title-5', name: 'Speed Demon', description: 'Win a battle in under 5 minutes', rarity: 'rare', unlocked: true },
    ];


    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return 'text-gray-400 border-gray-400';
            case 'rare': return 'text-blue-400 border-blue-400';
            case 'epic': return 'text-purple-400 border-purple-400';
            case 'legendary': return 'text-yellow-400 border-yellow-400';
            default: return 'text-gray-400 border-gray-400';
        }
    };

    return (
        <div className="pt-20 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Reward Collection</h2>
            </div>

            {/* Avatar Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Avatars</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4">
                    {avatars.map((avatar) => (
                        <div
                            key={avatar.id}
                            onClick={() => avatar.unlocked && setSelectedAvatar(avatar.id)}
                            className={`relative p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedAvatar === avatar.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : avatar.unlocked
                                    ? `${getRarityColor(avatar.rarity)} bg-gray-700/30 hover:bg-gray-700/50`
                                    : 'border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <div className="text-center">
                                <div className="text-2xl lg:text-3xl mb-2">{avatar.icon}</div>
                                <h4 className="text-white text-xs lg:text-sm font-medium">{avatar.name}</h4>
                                <p className={`text-xs mt-1 ${getRarityColor(avatar.rarity).split(' ')[0]}`}>
                                    {avatar.rarity.toUpperCase()}
                                </p>
                            </div>
                            {!avatar.unlocked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                                    <Lock className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Title Selection */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Titles</h3>
                <div className="space-y-3">
                    {titles.map((title) => (
                        <div
                            key={title.id}
                            onClick={() => title.unlocked && setSelectedTitle(title.id)}
                            className={`p-3 lg:p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedTitle === title.id
                                ? 'border-purple-500 bg-purple-500/10'
                                : title.unlocked
                                    ? `${getRarityColor(title.rarity)} bg-gray-700/30 hover:bg-gray-700/50`
                                    : 'border-gray-600 bg-gray-800/30 opacity-50 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <div className="flex-1">
                                    <h4 className="text-white font-medium text-sm lg:text-base">{title.name}</h4>
                                    <p className="text-gray-400 text-xs lg:text-sm mt-1">{title.description}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-1 rounded ${getRarityColor(title.rarity).split(' ')[0]} border ${getRarityColor(title.rarity).split(' ')[1]}`}>
                                        {title.rarity.toUpperCase()}
                                    </span>
                                    {!title.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
};

export default RewardsSection;