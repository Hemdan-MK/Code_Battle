import { useState, useEffect, useRef } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";

const TeamChat = ({ team, currentUserId }) => {
    const socket = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Socket event listeners for team chat
        socket.on('team_message_received', (messageData) => {
            setMessages(prev => [...prev, messageData]);
        });

        return () => {
            socket.off('team_message_received');
        };
    }, [socket]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !team) return;

        const messageData = {
            senderId: currentUserId,
            message: newMessage.trim(),
            timestamp: new Date().toISOString()
        };

        socket.emit('send_team_message', messageData);
        setNewMessage("");
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!team) return null;

    return (
        <div className="bg-gradient-to-b from-purple-900/30 to-black/50 backdrop-blur-sm border border-purple-600/50 rounded-lg h-96 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-purple-600/30 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-white font-bold">Team Chat</h3>
                <div className="text-purple-400 text-sm">
                    ({team.members?.length || 0}/3)
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                    <div className="text-purple-400 text-center text-sm mt-8">
                        No messages yet. Start chatting with your team!
                    </div>
                ) : (
                    messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                                    message.senderId === currentUserId
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-purple-700/50 text-white'
                                }`}
                            >
                                {message.senderId !== currentUserId && (
                                    <div className="text-xs text-purple-300 mb-1">
                                        {message.senderName}
                                    </div>
                                )}
                                <div className="text-sm">{message.message}</div>
                                <div className="text-xs opacity-70 mt-1">
                                    {formatTime(message.timestamp)}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-purple-600/30">
                <div className="flex space-x-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-purple-800/30 border border-purple-600/50 rounded-lg px-3 py-2 text-white placeholder-purple-400 focus:outline-none focus:border-cyan-400 transition-colors"
                        maxLength={500}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TeamChat;