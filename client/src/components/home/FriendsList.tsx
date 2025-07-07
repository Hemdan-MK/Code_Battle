import { MessageCircle, Send, UserMinus, UserPlus, X } from "lucide-react";
import { useState } from "react";


const mockFriends = [
    { id: 1, name: 'RaineShadow', status: 'online', game: 'In Party (Competitive)', avatar: '/image/image-1.webp', rank: 'TOXIC' },
    { id: 2, name: 'Sh0tty', status: 'online', game: 'In Party (Competitive)', avatar: '/image/image-1.webp', rank: 'HUNTSMAN' },
    { id: 3, name: 'Gafiltha', status: 'online', game: 'In Party (Competitive)', avatar: '/image/image-1.webp', rank: 'OLD DOG' },
    { id: 4, name: 'OprahsBigJugs', status: 'online', game: 'Competitive 5 - 1', avatar: '/image/image-1.webp', rank: 'MASTER' },
    { id: 5, name: 'BugHunter', status: 'away', game: 'Away', avatar: '/image/image-1.webp', rank: 'SILVER' },
    { id: 6, name: 'AlgoMaster', status: 'offline', game: 'Offline', avatar: '/image/image-1.webp', rank: 'GOLD' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },
    { id: 7, name: 'DataKnight', status: 'offline', game: 'Last seen 2 days ago', avatar: '/image/image-1.webp', rank: 'PLATINUM' },

];


const FriendsList = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [message, setMessage] = useState('');
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friendUsername, setFriendUsername] = useState('');

    const onlineFriends = mockFriends.filter(f => f.status === 'online');
    const offlineFriends = mockFriends.filter(f => f.status !== 'online');

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return 'bg-green-500';
            case 'away': return 'bg-yellow-500';
            case 'offline': return 'bg-purple-500';
            default: return 'bg-purple-500';
        }
    };

    const openChat = (friend) => {
        setSelectedFriend(friend);
        setChatOpen(true);
    };

    const addFriend = () => {
        if (friendUsername.trim()) {
            // Add friend logic here
            setFriendUsername('');
            setShowAddFriend(false);
        }
    };

    return (
        <div className="pt-20 h-screen max-h-screen flex flex-col bg-gradient-to-b from-purple-900/0 to-black/60 backdrop-blur-xl border-l border-purple-700/50">
            {/* Friends Header */}
            <div className="flex-shrink-0 p-4 border-b border-purple-500/50">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-lg">FRIENDS</h3>
                    <button
                        onClick={() => setShowAddFriend(true)}
                        className="p-2 hover:bg-purple-700/30 rounded-lg transition-colors"
                    >
                        <UserPlus className="w-5 h-5 text-purple-400" />
                    </button>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-400 font-semibold">{onlineFriends.length} ONLINE</span>
                    <span className="text-purple-400">{offlineFriends.length} OFFLINE</span>
                </div>
            </div>

            {/* Scrollable Friends List */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-120px)]">
                <div className="h-full">
                    {/* Online Friends */}
                    {onlineFriends.length > 0 && (
                        <div className="p-4">
                            <div className="space-y-3">
                                {onlineFriends.map((friend) => (
                                    <div key={friend.id} className="group">
                                        <div className="flex items-center space-x-3 p-3 hover:bg-purple-700/20 rounded-lg transition-colors">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    <img
                                                        src={friend.avatar}
                                                        alt={friend.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/image/default-avatar.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-purple-900`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-white font-semibold truncate">{friend.name}</p>
                                                    <span className="text-xs bg-purple-700 text-purple-300 px-2 py-1 rounded uppercase flex-shrink-0">
                                                        {friend.rank}
                                                    </span>
                                                </div>
                                                <p className="text-cyan-400 text-sm truncate">{friend.game}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button
                                                    onClick={() => openChat(friend)}
                                                    className="p-2 hover:bg-purple-600/30 rounded-lg transition-colors"
                                                >
                                                    <MessageCircle className="w-4 h-4 text-purple-400" />
                                                </button>
                                                <button className="p-2 hover:bg-red-600/30 rounded-lg transition-colors">
                                                    <UserMinus className="w-4 h-4 text-purple-400 hover:text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Offline Friends */}
                    {offlineFriends.length > 0 && (
                        <div className="p-4 border-t border-purple-700/30">
                            <div className="space-y-3">
                                {offlineFriends.map((friend) => (
                                    <div key={friend.id} className="group">
                                        <div className="flex items-center space-x-3 p-3 hover:bg-purple-700/20 rounded-lg transition-colors opacity-60">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full overflow-hidden">
                                                    <img
                                                        src={friend.avatar}
                                                        alt={friend.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = '/image/default-avatar.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-purple-900`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-purple-400 font-semibold truncate">{friend.name}</p>
                                                    <span className="text-xs bg-purple-800 text-purple-500 px-2 py-1 rounded uppercase flex-shrink-0">
                                                        {friend.rank}
                                                    </span>
                                                </div>
                                                <p className="text-purple-500 text-sm truncate">{friend.game}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button className="p-2 hover:bg-red-600/30 rounded-lg transition-colors">
                                                    <UserMinus className="w-4 h-4 text-purple-400 hover:text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state padding */}
                    <div className="h-4"></div>
                </div>
            </div>

            {/* Add Friend Modal */}
            {showAddFriend && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
                    <div className="bg-purple-800 border border-purple-600 rounded-lg p-6 w-80">
                        <h3 className="text-white font-bold text-lg mb-4">Add Friend</h3>
                        <input
                            type="text"
                            value={friendUsername}
                            onChange={(e) => setFriendUsername(e.target.value)}
                            placeholder="Enter username"
                            className="w-full bg-purple-700 text-white px-4 py-3 rounded-lg border border-purple-600 focus:outline-none focus:border-purple-500 mb-4"
                        />
                        <div className="flex space-x-3">
                            <button
                                onClick={addFriend}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Add Friend
                            </button>
                            <button
                                onClick={() => setShowAddFriend(false)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Panel */}
            {chatOpen && selectedFriend && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col z-50">
                    <div className="p-4 border-b border-purple-700/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img
                                    src={selectedFriend.avatar}
                                    alt={selectedFriend.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/image/default-avatar.jpg';
                                    }}
                                />
                            </div>
                            <div>
                                <span className="text-white font-semibold">{selectedFriend.name}</span>
                                <p className="text-purple-400 text-sm">{selectedFriend.game}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="text-purple-400 hover:text-white p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="text-right">
                                <div className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg max-w-xs">
                                    Hey! Want to team up for some matches?
                                </div>
                            </div>
                            <div className="text-left">
                                <div className="inline-block bg-purple-700 text-white px-4 py-2 rounded-lg max-w-xs">
                                    Sure! I'm ready for competitive
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-purple-700/50">
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-purple-700 text-white px-4 py-3 rounded-lg border border-purple-600 focus:outline-none focus:border-purple-500"
                            />
                            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default FriendsList;