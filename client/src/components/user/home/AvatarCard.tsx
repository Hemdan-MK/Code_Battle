import { Plus } from "lucide-react";

const getRankImage = (rank) => {
    const rankImages = {
        'TOXIC': '/image/rank-toxic.png',
        'HUNTSMAN': '/image/rank-huntsman.png',
        'OLD DOG': '/image/rank-olddog.png',
        'MASTER': '/image/rank-master.png',
        'SILVER': '/image/rank-silver.png',
        'GOLD': '/image/rank-gold.png',
        'PLATINUM': '/image/rank-platinum.png',
    };
    return rankImages[rank] || '/image/default-rank.webp';
};

const AvatarCard = ({
    user,
    isCurrentUser = false,
    showAddButton = false,
    onAdd = null,
    isReady = false,
    onToggleReady = null
}) => {
    return (
        <div className="relative group">
            <div className="bg-gradient-to-b from-purple-800/50 to-purple-900/50 backdrop-blur-sm border border-purple-600/50 rounded-t-3xl rounded-b-lg overflow-hidden">
                {/* Character Image */}
                <div className="aspect-[3/4] bg-gradient-to-b from-purple-900/20 to-black/40 flex items-center justify-center relative">
                    {showAddButton ? (
                        <button
                            onClick={onAdd}
                            className="w-75 h-75 flex items-center justify-center text-purple-400 hover:text-white transition-colors"
                        >
                            <Plus className="w-12 h-12" />
                        </button>
                    ) : (
                        <img
                            src={user.avatar || '/image/default-avatar.webp'}
                            alt={user.username}
                            className="w-75 h-full object-cover"
                        />
                    )}

                    {/* Ready Status */}
                    {!showAddButton && (
                        <div className="absolute top-4 left-4">
                            {isCurrentUser && onToggleReady ? (
                                <button
                                    onClick={onToggleReady}
                                    className={`px-3 py-1 rounded font-bold text-sm transition-colors ${isReady
                                            ? 'bg-green-500 text-black hover:bg-green-600'
                                            : 'bg-red-500 text-white hover:bg-red-600'
                                        }`}
                                >
                                    {isReady ? 'READY' : 'NOT READY'}
                                </button>
                            ) : (
                                <div className={`px-3 py-1 rounded font-bold text-sm ${isReady
                                        ? 'bg-green-500 text-black'
                                        : 'bg-red-500 text-white'
                                    }`}>
                                    {isReady ? 'READY' : 'NOT READY'}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* User Info */}
                {!showAddButton && (
                    <div className="p-4 text-center">
                        <h3 className="text-white font-bold text-lg mb-1">{user.username}</h3>
                        <p className="text-purple-400 text-sm font-medium">{user.rank}</p>
                    </div>
                )}
            </div>

            {/* Diamond Bottom with Rank Image */}
            <div className="flex justify-center">
                <div className="w-10 h-10 bg-gradient-to-b from-purple-800/50 to-purple-900/50 border border-purple-600/50 transform rotate-45 relative">
                    {!showAddButton && (
                        <div className="absolute inset-1 rounded-sm flex items-center justify-center transform -rotate-45">
                            <img
                                src={getRankImage(user.rank)}
                                alt={user.rank}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    console.error("Failed to load rank image:", (e.target as HTMLImageElement).src);
                                    (e.target as HTMLImageElement).src = '/image/rank-silver.png';
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AvatarCard;