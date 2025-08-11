import { X, Users, Crown } from "lucide-react";

const TeamSelectionModal = ({ friends, onSelectFriend, onClose }) => {
    console.log("TeamSelectionModal - All friends:", friends);

    const onlineFriends = friends.filter(friend => friend.status === 'online');
    console.log("TeamSelectionModal - Online friends:", onlineFriends);
    console.log("TeamSelectionModal - Online friends count:", onlineFriends.length);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-purple-900/90 to-black/90 backdrop-blur-md border border-purple-600/50 rounded-lg w-96 max-h-96 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-purple-600/30 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-white font-bold">
                            Invite Friends ({onlineFriends.length} online)
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-purple-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Friends List */}
                <div className="p-4 max-h-80 overflow-y-auto">
                    {friends.length === 0 ? (
                        <div className="text-purple-400 text-center py-8">
                            No friends found. Add some friends first!
                        </div>
                    ) : onlineFriends.length === 0 ? (
                        <div className="space-y-4">
                            <div className="text-purple-400 text-center py-4">
                                No online friends available to invite
                            </div>

                            {/* Show offline friends for debugging */}
                            <div className="text-xs text-gray-400">
                                <div className="font-semibold mb-2">Offline Friends:</div>
                                {friends.filter(f => f.status !== 'online').map((friend) => (
                                    <div key={friend.id} className="flex items-center space-x-2 p-2 bg-gray-800/30 rounded">
                                        <img
                                            src={friend.avatar || '/image/default-avatar.webp'}
                                            alt={friend.username}
                                            className="w-6 h-6 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/image/default-avatar.webp';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <div>{friend.username}</div>
                                            <div className="text-red-400">Status: {friend.status}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {onlineFriends.map((friend) => (
                                <div
                                    key={friend.id}
                                    className="flex items-center justify-between p-3 bg-purple-800/30 hover:bg-purple-700/40 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center space-x-3">
                                        <img
                                            src={friend.avatar || '/image/default-avatar.webp'}
                                            alt={friend.username}
                                            className="w-10 h-10 rounded-full object-cover"
                                            onError={(e) => {
                                                e.target.src = '/image/default-avatar.webp';
                                            }}
                                        />
                                        <div>
                                            <div className="text-white font-medium">
                                                {friend.username}
                                            </div>
                                            <div className="text-sm text-purple-400">
                                                {friend.rank || 'UNRANKED'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <div className="flex items-center space-x-1">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <span className="text-xs text-green-400">
                                                {friend.game || 'Online'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => {
                                                console.log("Inviting friend:", friend);
                                                onSelectFriend(friend.id);
                                            }}
                                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded font-medium transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            Invite
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-purple-600/30 bg-purple-900/20">
                    <div className="text-xs text-purple-400 text-center">
                        Only online friends can be invited to your team
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamSelectionModal;