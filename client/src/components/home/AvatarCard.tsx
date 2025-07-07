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
    return rankImages[rank] || '/image/rank-default.png';
};


const AvatarCard = ({ user, isCurrentUser = false, showAddButton = false, onAdd = null }) => {
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
                            src={user.avatar || '/image/default-avatar.jpg'}
                            alt={user.name}
                            className="w-75 h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/image/default-avatar.jpg';
                            }}
                        />
                    )}

                    {/* Ready Status */}
                    {isCurrentUser && (
                        <div className="absolute top-4 left-4 bg-green-500 text-black px-3 py-1 rounded font-bold text-sm">
                            READY
                        </div>
                    )}
                </div>

                {/* User Info */}
                {!showAddButton && (
                    <div className="p-4 text-center">
                        <h3 className="text-white font-bold text-lg mb-1">{user.name}</h3>
                        <p className="text-purple-400 text-sm font-medium">{user.rank}</p>
                    </div>
                )}
            </div>

            {/* Diamond Bottom with Rank Image */}
            <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-b from-purple-800/50 to-purple-900/50 border border-purple-600/50 transform rotate-45 -mt-4 relative">
                    {!showAddButton && (
                        <div className="absolute inset-1 rounded-sm flex items-center justify-center transform -rotate-45">
                            <img
                                src={getRankImage(user.rank)}
                                alt={user.rank}
                                className="w-4 h-4 object-contain"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/image/rank-default.jpg';
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