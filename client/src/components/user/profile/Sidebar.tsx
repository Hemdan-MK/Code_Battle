import { addError } from "@/redux/authSlice";
import { logoutThunk } from "@/redux/thunk";
import { getToken, getUser } from "@/utils/tokenUtils";
import { Shield, Star, Trophy, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { io } from "socket.io-client";

const Sidebar = ({ setActiveSection, activeSection }) => {
    const dispatch = useDispatch();
    const [socket, setSocket] = useState(null);
    const SOCKET_URL = 'http://localhost:3000';

    useEffect(() => {
        const validateTokenAndConnect = async () => {
            const token = getToken();
            const user = getUser();

            if (!token) {
                dispatch(addError('No authentication token found. Please log in again.'));
                return;
            }

            try {
                const newSocket = io(SOCKET_URL, {
                    auth: {
                        token,
                        username: user.username
                    }
                });

                // Store socket reference
                setSocket(newSocket);

                // Handle logout confirmation from server
                newSocket.on('logout_confirmed', () => {
                    console.log('Logout confirmed by server');
                });

                // Handle logout errors
                newSocket.on('logout_error', (data) => {
                    console.error('Logout error:', data.message);
                    dispatch(addError(data.message));
                });

                newSocket.on('update_status', handleLogout);

                return () => {
                    newSocket.disconnect();
                };
            } catch (error) {
                console.error('Socket connection error:', error);
                dispatch(addError('Failed to connect to server. Please try again.'));
            }
        };

        validateTokenAndConnect();
    }, [dispatch]);

    const handleLogout = () => {
        const user = getUser();

        // Emit logout event to server before dispatching logout
        if (socket && user) {
            socket.emit('user_logout', {
                userId: user.id // Adjust based on your user object structure
            });
        }

        // Dispatch logout action
        dispatch(logoutThunk());
    };

    return (
        <div className="pt-20 h-full flex flex-col">
            {/* Header */}
            <div className="p-4 lg:p-6 border-b border-gray-700/50">
                <h1 className="text-xl lg:text-2xl font-bold text-white">Player Profile</h1>
                <p className="text-gray-400 text-sm lg:text-base">Manage your account</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 lg:p-6 space-y-2">
                <button
                    onClick={() => setActiveSection('security')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${activeSection === 'security'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                >
                    <Shield size={20} />
                    <span>Security</span>
                </button>

                <button
                    onClick={() => setActiveSection('rewards')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${activeSection === 'rewards'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }`}
                >
                    <Trophy size={20} />
                    <span>Rewards</span>
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed text-left"
                    disabled
                >
                    <User size={20} />
                    <span>Match History</span>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded ml-auto">Soon</span>
                </button>

                <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 cursor-not-allowed text-left"
                    disabled
                >
                    <Star size={20} />
                    <span>Payment</span>
                    <span className="text-xs bg-gray-600 px-2 py-1 rounded ml-auto">Soon</span>
                </button>
            </nav>

            {/* Logout Button */}
            <div className="p-4 lg:p-6 border-t border-gray-700/50">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left text-red-400 hover:text-red-300 hover:bg-red-900/20"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;