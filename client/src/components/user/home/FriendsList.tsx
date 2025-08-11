import { MessageCircle, Send, UserMinus, UserPlus, X, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { addIndividualMessage, clearIndividualChat } from '@/redux/chatSlice'
import { getToken, getUser } from "@/utils/tokenUtils";
import { addError } from "@/redux/authSlice";
import type { RootState } from "@/redux/store";

// Constants 
const SOCKET_URL = 'http://localhost:3000';
const TYPING_TIMEOUT = 1000;
const DEFAULT_AVATAR = '/image/default-avatar.webp';

// Utility functions
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const getStatusColor = (status) => {
    const colors = {
        'online': 'bg-green-500',
        'offline': 'bg-purple-500'
    };
    return colors[status] || 'bg-purple-500';
};

const FriendsList = () => {
    const dispatch = useDispatch();
    const messages = useSelector((state: RootState) => state.chat.individual);

    // State
    const [socket, setSocket] = useState(null);
    const [friends, setFriends] = useState([]);
    const [currentUser, setCurrentUser] = useState({ id: '', username: '' });
    const [chatOpen, setChatOpen] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [message, setMessage] = useState('');
    const [showAddFriend, setShowAddFriend] = useState(false);
    const [friendUsername, setFriendUsername] = useState('');
    const [friendTagName, setFriendTagName] = useState('');
    const [typingUsers, setTypingUsers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [addFriendStatus, setAddFriendStatus] = useState({ message: '', type: '' }); // success, error, or empty
    const [isModalClosing, setIsModalClosing] = useState(false);
    const [friendRequests, setFriendRequests] = useState([]); // Pending friend requests
    const [showFriendRequestPopup, setShowFriendRequestPopup] = useState(false);

    // Refs
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const modalRef = useRef(null);

    // Memoized values
    const { onlineFriends, offlineFriends } = useMemo(() => ({
        onlineFriends: friends.filter(f => f.status === 'online'),
        offlineFriends: friends.filter(f => f.status !== 'online')
    }), [friends]);

    // Socket connection and authentication
    useEffect(() => {
        const validateTokenAndConnect = async () => {
            const token = getToken();
            const username = getUser().username

            if (!token) {
                dispatch(addError('No authentication token found. Please log in again.'));
                setLoading(false);
                return;
            }

            try {
                const newSocket = io(SOCKET_URL, {
                    auth: {
                        token,
                        username
                    }
                });
                console.log("-------------------");
                console.log(newSocket);
                
                console.log("-------------------");
                

                // Auth success handler
                const handleAuthSuccess = (data) => {
                    setCurrentUser({
                        id: data.userId,
                        username: data.username
                    });
                    setSocket(newSocket);
                    setLoading(false);
                    // Request friends list
                    newSocket.emit('get_friends', { userId: data.userId });
                };

                // Auth error handler
                const handleAuthError = (data) => {
                    dispatch(addError(data.message || 'Authentication failed. Please log in again.'));
                    setLoading(false);
                    newSocket.disconnect();
                };

                newSocket.on('auth_success', handleAuthSuccess);
                newSocket.on('auth_error', handleAuthError);

                return () => {
                    newSocket.off('auth_success', handleAuthSuccess);
                    newSocket.off('auth_error', handleAuthError);
                    newSocket.disconnect();
                };
            } catch (error) {
                console.error('Socket connection error:', error);
                dispatch(addError('Failed to connect to server. Please try again.'));
                setLoading(false);
            }
        };

        validateTokenAndConnect();
    }, [dispatch]);

    useEffect(() => {
        if (!socket || !currentUser.id) return;

        if (!isValidObjectId(currentUser.id)) {
            setError('Invalid user ID format');
            setLoading(false);
            return;
        }

        // Friends list handler
        const handleFriendsList = (data) => {
            setFriends(data.friends);
            setLoading(false);
        };

        // Friends error handler
        const handleFriendsError = (data) => {
            setError(data.message);
            setLoading(false);
        };

        // Friend status update handler
        const handleFriendStatusUpdate = (data) => {
            const { userId, status, game } = data;
            setFriends(prevFriends =>
                prevFriends.map(friend =>
                    friend.id === userId
                        ? { ...friend, status, game: game || friend.game }
                        : friend
                )
            );
        };

        // Private message handler
        const handlePrivateMessage = (messageData) => {
            const { senderId, message, timestamp, senderName } = messageData;
            const newMessage = {
                id: messageData.id,
                text: message,
                sender: senderId,
                timestamp: new Date(timestamp),
                senderName
            };

            dispatch(addIndividualMessage({
                partnerId: senderId,
                msg: newMessage
            }));
        };

        // Message sent confirmation handler
        const handleMessageSent = (messageData) => {
            const { receiverId, message, timestamp } = messageData;
            const newMessage = {
                id: messageData.id,
                text: message,
                sender: currentUser.id,
                timestamp: new Date(timestamp),
                senderName: currentUser.username
            };

            dispatch(addIndividualMessage({
                partnerId: receiverId,
                msg: newMessage
            }));
        };

        // Typing indicator handler
        const handleTyping = (data) => {
            const { userId, isTyping } = data;
            setTypingUsers(prev => ({ ...prev, [userId]: isTyping }));
        };

        // Friend request handlers
        const handleFriendRequestReceived = (data) => {
            console.log('Friend request received:', data);
            const { senderId, senderName, senderAvatar } = data;

            // Add to friend requests list
            setFriendRequests(prev => {
                // Avoid duplicates
                if (prev.some(req => req.senderId === senderId)) {
                    return prev;
                }
                return [...prev, {
                    senderId,
                    senderUsername: senderName,
                    senderAvatar: senderAvatar || DEFAULT_AVATAR,
                    timestamp: new Date()
                }];
            });

            // Show popup if not already visible
            setShowFriendRequestPopup(true);
            setAddFriendStatus({ message: 'Friend request received!', type: 'success' });
        };

        const handleFriendRequestSent = (data) => {
            console.log('Friend request sent:', data.message);
            setAddFriendStatus({ message: 'Friend request sent successfully!', type: 'success' });
            // Clear form after successful send
            setTimeout(() => {
                setFriendUsername('');
                setFriendTagName('');
                setAddFriendStatus({ message: '', type: '' });
            }, 2000);
        };

        const handleFriendRequestError = (data) => {
            console.error('Friend request error:', data.message);
            let errorMessage = data.message;

            // Handle specific error cases
            if (data.message.includes('already friends') || data.message.includes('friend already exists')) {
                errorMessage = 'You are already friends with this user!';
            } else if (data.message.includes('not found') || data.message.includes('User not found')) {
                errorMessage = 'User not found. Please check the username and tag.';
            } else if (data.message.includes('pending')) {
                errorMessage = 'Friend request already pending!';
            }

            setAddFriendStatus({ message: errorMessage, type: 'error' });
        };

        const handleFriendAdded = (data) => {
            console.log('Friend added:', data);
            socket.emit('get_friends', { userId: currentUser.id });
            setAddFriendStatus({ message: 'Friend added successfully!', type: 'success' });
        };

        const handleFriendRequestAccepted = (data) => {
            console.log('Friend request accepted:', data);
            socket.emit('get_friends', { userId: currentUser.id });
            setAddFriendStatus({ message: 'Friend request accepted!', type: 'success' });
        };

        // Register all event listeners
        socket.on('friends_list', handleFriendsList);
        socket.on('friends_error', handleFriendsError);
        socket.on('friend_status_update', handleFriendStatusUpdate);
        socket.on('receive_private_message', handlePrivateMessage);
        socket.on('message_sent', handleMessageSent);
        socket.on('user_typing', handleTyping);
        socket.on('friend_request_received', handleFriendRequestReceived);
        socket.on('friend_request_sent', handleFriendRequestSent);
        socket.on('friend_request_error', handleFriendRequestError);
        socket.on('friend_added', handleFriendAdded);
        socket.on('friend_request_accepted', handleFriendRequestAccepted);
        socket.on('friend_removed', handleFriendRemoved);


        // Cleanup function
        return () => {
            socket.off('friends_list', handleFriendsList);
            socket.off('friends_error', handleFriendsError);
            socket.off('friend_status_update', handleFriendStatusUpdate);
            socket.off('receive_private_message', handlePrivateMessage);
            socket.off('message_sent', handleMessageSent);
            socket.off('user_typing', handleTyping);
            socket.off('friend_request_received', handleFriendRequestReceived);
            socket.off('friend_request_sent', handleFriendRequestSent);
            socket.off('friend_request_error', handleFriendRequestError);
            socket.off('friend_added', handleFriendAdded);
            socket.off('friend_request_accepted', handleFriendRequestAccepted);
            socket.off('friend_removed', handleFriendRemoved);

        };
    }, [socket, currentUser.id, currentUser.username, dispatch]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, selectedFriend]);

    // Auto-hide friend request popup if no requests
    useEffect(() => {
        if (friendRequests.length === 0) {
            setShowFriendRequestPopup(false);
        }
    }, [friendRequests]);

    // Clear status message after 5 seconds
    useEffect(() => {
        if (addFriendStatus.message) {
            const timer = setTimeout(() => {
                setAddFriendStatus({ message: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [addFriendStatus.message]);

    // Event handlers
    const openChat = useCallback((friend) => {
        setSelectedFriend(friend);
        console.log("this is it : ");
        console.log(friend);
        
        
        setChatOpen(true);
    }, []);

    const closeChat = useCallback(() => {
        if (selectedFriend) {
            dispatch(clearIndividualChat({ partnerId: selectedFriend.id }));
        }
        setChatOpen(false);
        setSelectedFriend(null);
    }, [selectedFriend, dispatch]);

    const sendMessage = useCallback(() => {
        if (!message.trim() || !selectedFriend || !socket) return;

        const messageData = {
            senderId: currentUser.id,
            receiverId: selectedFriend.id,
            message: message.trim(),
            timestamp: new Date().toISOString()
        };

        socket.emit('send_private_message', messageData);
        setMessage('');

        // Stop typing indicator
        socket.emit('typing_stop', {
            senderId: currentUser.id,
            receiverId: selectedFriend.id
        });
    }, [message, selectedFriend, socket, currentUser.id]);

    const handleTyping = useCallback((e) => {
        const value = e.target.value;
        setMessage(value);

        if (selectedFriend && socket) {
            // Send typing start
            socket.emit('typing_start', {
                senderId: currentUser.id,
                receiverId: selectedFriend.id
            });

            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            // Set new timeout to stop typing
            typingTimeoutRef.current = setTimeout(() => {
                socket.emit('typing_stop', {
                    senderId: currentUser.id,
                    receiverId: selectedFriend.id
                });
            }, TYPING_TIMEOUT);
        }
    }, [selectedFriend, socket, currentUser.id]);

    const addFriend = useCallback(() => {
        if (!friendUsername.trim() || !friendTagName.trim() || !socket) {
            setAddFriendStatus({ message: 'Please enter both username and tag', type: 'error' });
            return;
        }

        // Clear any existing status
        setAddFriendStatus({ message: '', type: '' });

        socket.emit('send_friend_request', {
            senderId: currentUser.id,
            receiverUsername: friendUsername.trim(),
            receiverTag: friendTagName.trim()
        });
    }, [friendUsername, friendTagName, socket, currentUser.id]);

    const removeFriend = useCallback((friendId) => {
        if (!socket || !friendId) return;

        // if (confirm('Are you sure you want to remove this friend?')) {
            socket.emit('remove_friend', {
                userId: currentUser.id,
                friendId: friendId
            });
        // }
    }, [socket, currentUser.id]);

    const handleFriendRemoved = (data) => {
        console.log('Friend removed:', data);

        socket.emit('get_friends', { userId: currentUser.id });
        setAddFriendStatus({ message: 'Friend removed successfully!', type: 'success' });
    };

    const acceptFriendRequest = useCallback((senderId) => {
        if (!socket || !senderId) return;

        socket.emit('accept_friend_request', {
            userId: currentUser.id,
            requesterId: senderId
        });

        // Remove from local state immediately for better UX
        setFriendRequests(prev => prev.filter(req => req.senderId !== senderId));
    }, [socket, currentUser.id]);

    const rejectFriendRequest = useCallback((senderId) => {
        if (!socket || !senderId) return;

        // Since reject is not implemented on server, we'll just remove from local state
        setFriendRequests(prev => prev.filter(req => req.senderId !== senderId));
        setAddFriendStatus({
            message: 'Reject friend feature not yet implemented on server',
            type: 'error'
        });

        socket.emit('reject_friend_request', {
            userId: currentUser.id,
            requesterId: senderId
        });
    }, [socket, currentUser.id]);

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    }, [sendMessage]);

    const closeAddFriendModal = useCallback(() => {
        setIsModalClosing(true);

        // Wait for animation to complete before actually closing
        setTimeout(() => {
            setShowAddFriend(false);
            setFriendUsername('');
            setFriendTagName('');
            setAddFriendStatus({ message: '', type: '' });
            setIsModalClosing(false);
        }, 200); // Match the fadeOut animation duration
    }, []);

    // Handle modal key press (Escape to close)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && showAddFriend) {
                closeAddFriendModal();
            }
        };

        if (showAddFriend) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [showAddFriend, closeAddFriendModal]);

    // Loading state
    if (loading) {
        return (
            <div className="pt-20 h-screen flex items-center justify-center bg-gradient-to-b from-purple-900/0 to-black/60 backdrop-blur-xl">
                <div className="text-white text-lg">Loading friends...</div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="pt-20 h-screen flex items-center justify-center bg-gradient-to-b from-purple-900/0 to-black/60 backdrop-blur-xl">
                <div className="text-red-400 text-lg">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="pt-20 h-screen max-h-screen flex flex-col bg-gradient-to-b from-purple-900/0 to-black/60 backdrop-blur-xl">
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden max-h-[calc(100vh-120px)] border-l border-purple-700/50">
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
                                                        src={friend.avatar || DEFAULT_AVATAR}
                                                        alt={friend.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-purple-900`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-white font-semibold truncate">{friend.username}</p>
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
                                                    title="Send Message"
                                                >
                                                    <MessageCircle className="w-4 h-4 text-purple-400" />
                                                </button>
                                                <button
                                                    onClick={() => removeFriend(friend.id)}
                                                    className="p-2 hover:bg-red-600/30 rounded-lg transition-colors"
                                                    title="Remove Friend"
                                                >
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
                                                        src={friend.avatar || DEFAULT_AVATAR}
                                                        alt={friend.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-purple-900`}></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-purple-400 font-semibold truncate">{friend.username}</p>
                                                    <span className="text-xs bg-purple-800 text-purple-500 px-2 py-1 rounded uppercase flex-shrink-0">
                                                        {friend.rank}
                                                    </span>
                                                </div>
                                                <p className="text-purple-500 text-sm truncate">{friend.status}</p>
                                            </div>
                                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                <button
                                                    onClick={() => removeFriend(friend.id)}
                                                    className="p-2 hover:bg-red-600/30 rounded-lg transition-colors"
                                                    title="Remove Friend"
                                                >
                                                    <UserMinus className="w-4 h-4 text-purple-400 hover:text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state */}
                    {friends.length === 0 && (
                        <div className="flex items-center justify-center h-full text-purple-400">
                            <div className="text-center">
                                <p className="text-lg mb-2">No friends yet</p>
                                <p className="text-sm">Add some friends to get started!</p>
                            </div>
                        </div>
                    )}

                    <div className="h-4"></div>
                </div>
            </div>

            {/* Add Friend Modal */}
            {showAddFriend && (
                <div
                    className={`fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-200 ${isModalClosing ? 'animate-fadeOut' : 'animate-fadeIn'
                        }`}
                    onClick={closeAddFriendModal}
                >
                    <div
                        ref={modalRef}
                        onClick={(e) => e.stopPropagation()}
                        className={`relative w-[90%] max-w-md bg-gray-800 border border-purple-500 rounded-2xl p-6 shadow-xl transform transition-all duration-200 ease-out ${isModalClosing ? 'animate-slideOutScale' : 'animate-slideInScale'
                            }`}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeAddFriendModal}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>

                        <h3 className="text-white text-2xl font-bold mb-6 text-center">Add a Friend</h3>

                        {/* Status Message */}
                        {addFriendStatus.message && (
                            <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${addFriendStatus.type === 'success'
                                ? 'bg-green-900/30 border border-green-500/50'
                                : 'bg-red-900/30 border border-red-500/50'
                                }`}>
                                {addFriendStatus.type === 'success' ? (
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400" />
                                )}
                                <span className={`text-sm ${addFriendStatus.type === 'success' ? 'text-green-300' : 'text-red-300'
                                    }`}>
                                    {addFriendStatus.message}
                                </span>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {/* Username Input */}
                            <div className="flex-1">
                                <label className="block text-sm text-gray-300 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={friendUsername}
                                    onChange={(e) => setFriendUsername(e.target.value)}
                                    placeholder="e.g. john_doe"
                                    className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>

                            {/* Tag Input */}
                            <div className="w-[100px]">
                                <label className="block text-sm text-gray-300 mb-1">Tag</label>
                                <input
                                    type="text"
                                    value={friendTagName}
                                    onChange={(e) => setFriendTagName(e.target.value)}
                                    placeholder="#1234"
                                    className="w-full bg-gray-900 text-white px-3 py-2.5 rounded-lg border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={addFriend}
                                disabled={!friendUsername.trim() || !friendTagName.trim()}
                                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition duration-200"
                            >
                                Add Friend
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Friend Request Popup */}
            {showFriendRequestPopup && friendRequests.length > 0 && (
                <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-slideInFromBottom">
                    <div className="bg-gray-800 border border-purple-500 rounded-lg shadow-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-semibold text-sm">Friend Requests</h4>
                            <button
                                onClick={() => setShowFriendRequestPopup(false)}
                                className="text-purple-400 hover:text-white p-1"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {friendRequests.map((request) => (
                                <div key={request.senderId} className="flex items-center space-x-3 p-2 bg-gray-700/50 rounded-lg">
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <img
                                            src={request.senderAvatar}
                                            alt={request.senderUsername}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-sm font-medium truncate">
                                            {request.senderUsername}
                                        </p>
                                        <p className="text-purple-400 text-xs">
                                            wants to be friends
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-1 flex-shrink-0">
                                        <button
                                            onClick={() => acceptFriendRequest(request.senderId)}
                                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                            title="Accept"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            onClick={() => rejectFriendRequest(request.senderId)}
                                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs transition-colors"
                                            title="Reject"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {friendRequests.length > 1 && (
                            <div className="mt-3 pt-2 border-t border-purple-700/50">
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => friendRequests.forEach(req => acceptFriendRequest(req.senderId))}
                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                    >
                                        Accept All
                                    </button>
                                    <button
                                        onClick={() => friendRequests.forEach(req => rejectFriendRequest(req.senderId))}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                                    >
                                        Reject All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Chat Panel */}
            {chatOpen && selectedFriend && (
                <div className="pt-20 absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col z-50">
                    <div className="p-4 border-b border-purple-700/50 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img
                                    src={selectedFriend.avatar || DEFAULT_AVATAR}
                                    alt={selectedFriend.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <span className="text-white font-semibold">{selectedFriend.username}</span>
                                <p className="text-purple-400 text-sm">{selectedFriend.game}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeChat}
                            className="text-purple-400 hover:text-white p-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-4">
                            {messages[selectedFriend.id]?.map((msg) => (
                                <div key={msg.id} className={msg.sender === currentUser.id ? "text-right" : "text-left"}>
                                    <div className={`inline-block px-4 py-2 rounded-lg max-w-xs ${msg.sender === currentUser.id
                                        ? "bg-purple-600 text-white"
                                        : "bg-purple-700 text-white"
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <div className="text-xs text-purple-400 mt-1">
                                        {msg.timestamp.toLocaleTimeString()}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {typingUsers[selectedFriend.id] && (
                                <div className="text-left">
                                    <div className="inline-block bg-gray-900 text-purple-300 px-4 py-2 rounded-full">
                                        <div className="flex space-x-1 items-end ">
                                            <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:0ms]"></span>
                                            <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:200ms]"></span>
                                            <span className="w-2 h-2 bg-purple-300 rounded-full animate-bounce [animation-delay:400ms]"></span>
                                        </div>
                                    </div>
                                </div>
                            )}



                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 border-t border-purple-700/50">
                        <div className="flex space-x-3">
                            <input
                                type="text"
                                value={message}
                                onChange={handleTyping}
                                onKeyPress={handleKeyPress}
                                placeholder="Type a message..."
                                className="flex-1 bg-purple-700 text-white px-4 py-3 rounded-lg border border-purple-600 focus:outline-none focus:border-purple-500"
                            />
                            <button
                                onClick={sendMessage}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
                            >
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