import { Play, Square, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { getUser } from "@/utils/tokenUtils";
import AvatarCard from "./AvatarCard";
import TeamChat from "./TeamChat";
import TeamSelectionModal from "./TeamSelectionModal";
import InviteModal from "./InviteModal";
import { useSocket } from "@/hooks/useSocket";

const gameTypes = [
    { id: 'solo', name: 'Solo Queue', description: '1v1 battles' },
    { id: 'team3v3', name: 'Team 3v3', description: '3v3 team battles' },
];

const TeamSelection = ({ team, onInviteFriend, onToggleReady, currentUserId }) => {
    const maxTeamSize = 3;
    const emptySlots = maxTeamSize - (team?.members?.length || 0);
    const isLeader = team?.leader === currentUserId;

    return (
        <div className="flex justify-center space-x-6">
            {team?.members?.map((member) => (
                <AvatarCard
                    key={member.userId}
                    user={{
                        username: member.username,
                        avatar: member.avatar,
                        rank: member.rank
                    }}
                    isCurrentUser={member.userId === currentUserId}
                    isReady={member.ready}
                    onToggleReady={member.userId === currentUserId ? onToggleReady : null}
                />
            ))}

            {isLeader && [...Array(emptySlots)].map((_, index) => (
                <AvatarCard
                    key={`empty-${index}`}
                    user={{}}
                    showAddButton={true}
                    onAdd={onInviteFriend}
                />
            ))}
        </div>
    );
};

const GameModeSelection = () => {
    const [selectedMode, setSelectedMode] = useState('solo');
    const [isStarted, setIsStarted] = useState(false);
    const [team, setTeam] = useState(null);
    const [showTeamModal, setShowTeamModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState(null);
    const [friends, setFriends] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionAttempts, setConnectionAttempts] = useState(0);

    const user = getUser();
    const currentUserId = user.id;
    const socket = useSocket();

    // Initialize socket connection
    useEffect(() => {
        if (!socket || !currentUserId) {
            console.error("No socket or user ID available");
            return;
        }

        // Connection handlers
        socket.on('connect', () => {
            console.log("Connected to socket:", socket.id);
            setIsConnected(true);
            setConnectionAttempts(0);

            // Request friends list on connect
            socket.emit('get_friends_list', { userId: currentUserId });
        });

        socket.on('connect_error', (error) => {
            console.error("Connection error:", error);
            setIsConnected(false);
            setConnectionAttempts(prev => prev + 1);
        });

        socket.on('disconnect', (reason) => {
            console.log("Disconnected:", reason);
            setIsConnected(false);
        });

        // Auth handlers
        socket.on('auth_success', (data) => {
            console.log("Auth success:", data);
        });

        socket.on('auth_error', (data) => {
            console.error("Auth error:", data);
        });

        // Friends handlers
        socket.on('friends_list', (data) => {
            console.log("Friends list received:", data.friends);
            setFriends(data.friends || []);
        });

        socket.on('friends_error', (data) => {
            console.error("Friends error:", data.message);
            setFriends([]);
        });

        // Team handlers
        socket.on('team_created', (data) => {
            console.log("Team created:", data.team);
            setTeam(data.team);
        });

        socket.on('team_member_joined', (data) => {
            console.log("Team member joined:", data);
            setTeam(data.team);
        });

        socket.on('team_member_left', (data) => {
            console.log("Team member left:", data);
            setTeam(data.team);
        });

        socket.on('team_left', () => {
            console.log("Left team");
            setTeam(null);
        });

        socket.on('team_leader_changed', (data) => {
            console.log("Team leader changed:", data);
            setTeam(prev => prev ? { ...prev, leader: data.newLeader.userId } : prev);
        });

        socket.on('team_ready_status_updated', (data) => {
            console.log("Team ready status updated:", data);
            setTeam(data.team);
        });

        // Invitation handlers - ADD MORE DEBUG LOGS
        socket.on('team_invite_received', (data) => {
            console.log("🔥 TEAM INVITE RECEIVED IN FRONTEND:", data);
            console.log("📊 Current showInviteModal state:", showInviteModal);
            console.log("📊 Current inviteData state:", inviteData);

            setInviteData(data);
            setShowInviteModal(true);

            // Add a timeout to check if states were updated
            setTimeout(() => {
                console.log("📊 After setState - showInviteModal:", showInviteModal);
                console.log("📊 After setState - inviteData:", inviteData);
            }, 100);
        });

        socket.on('team_invite_sent', (data) => {
            console.log('Team invite sent:', data.message);
            // Show success message to user
        });

        socket.on('team_invite_accepted', (data) => {
            console.log(`${data.username} joined your team!`);
        });

        socket.on('team_invite_rejected', (data) => {
            console.log(`${data.username} declined your invitation`);
        });

        socket.on('team_error', (data) => {
            console.error('Team error:', data.message);
            // Show error message to user
        });

        // ADD A CATCH-ALL LISTENER FOR DEBUGGING
        socket.onAny((eventName, ...args) => {
            console.log(`📡 Socket event received: ${eventName}`, args);
        });

        // Cleanup function
        return () => {
            console.log("Cleaning up socket connection");
            socket.off(); // Remove all listeners
        };
    }, [currentUserId, socket]);

    // ADD USEEFFECT TO MONITOR STATE CHANGES
    useEffect(() => {
        console.log("🔍 showInviteModal changed to:", showInviteModal);
    }, [showInviteModal]);

    useEffect(() => {
        console.log("🔍 inviteData changed to:", inviteData);
    }, [inviteData]);

    const handleModeChange = (mode) => {
        if (team && mode !== selectedMode) {
            handleLeaveTeam();
        }
        setSelectedMode(mode);
    };

    const handleStart = () => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        if (!isStarted && selectedMode === 'team3v3' && !team) {
            console.log("Creating team for game mode:", selectedMode);
            socket.emit('create_team', {
                userId: currentUserId,
                gameMode: selectedMode
            });
        }
        setIsStarted(!isStarted);
    };

    const handleInviteFriend = () => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        console.log("Requesting friends list for invite");
        // Refresh friends list before showing modal
        socket.emit('get_friends_list', { userId: currentUserId });
        setShowTeamModal(true);
    };

    const handleSelectFriend = (friendId) => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        if (!team) {
            console.error("No team to invite to");
            return;
        }

        console.log("🚀 Sending team invite to friend:", friendId, "for team:", team.id);
        console.log("🚀 Current user ID:", currentUserId);

        socket.emit('send_team_invite', {
            senderId: currentUserId,
            receiverId: friendId,
            teamId: team.id
        });

        setShowTeamModal(false);
    };

    const handleLeaveTeam = () => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        if (team) {
            console.log("Leaving team:", team.id);
            socket.emit('leave_team', { userId: currentUserId });
        }
    };

    const handleToggleReady = () => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        if (team) {
            const currentMember = team.members.find(m => m.userId === currentUserId);
            console.log("Toggling ready status from:", currentMember?.ready, "to:", !currentMember?.ready);

            socket.emit('update_team_ready_status', {
                userId: currentUserId,
                ready: !currentMember?.ready
            });
        }
    };

    const handleInviteResponse = (accepted) => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        if (inviteData) {
            console.log("Responding to invite:", accepted ? "accepted" : "rejected");

            socket.emit('respond_team_invite', {
                userId: currentUserId,
                teamId: inviteData.teamId,
                accepted
            });
        }
        setShowInviteModal(false);
        setInviteData(null);
    };

    const createTeam = () => {
        if (!socket || !isConnected) {
            console.error("Socket not connected");
            return;
        }

        console.log("Creating team manually for game mode:", selectedMode);
        socket.emit('create_team', {
            userId: currentUserId,
            gameMode: selectedMode
        });
    };

    const isInTeam = !!team;
    const canStart = selectedMode === 'solo' || (isInTeam && team.members.every(m => m.ready));

    // Filter online friends for team invitations
    const onlineFriends = friends.filter(friend => friend.status === 'online');

    return (
        <div className="pt-20 flex items-start space-x-8">
            <div className="flex-1 flex flex-col items-center space-y-8">
                {/* Connection Status */}
                {!isConnected && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg">
                        Connection lost... Attempting to reconnect ({connectionAttempts}/5)
                    </div>
                )}

                {/* DEBUG INFO - ALWAYS SHOW */}
                {/* <div className="bg-yellow-800 p-4 rounded-lg text-sm text-black">
                    <div><strong>DEBUG INFO:</strong></div>
                    <div>Socket Connected: {isConnected ? 'Yes' : 'No'}</div>
                    <div>Socket ID: {socketRef.current?.id || 'Not connected'}</div>
                    <div>Current User ID: {currentUserId}</div>
                    <div>Show Invite Modal: {showInviteModal.toString()}</div>
                    <div>Invite Data: {inviteData ? JSON.stringify(inviteData) : 'null'}</div>
                    <div>Friends Count: {friends.length}</div>
                    <div>Online Friends: {onlineFriends.length}</div>
                    <div>Team: {team ? `${team.members.length} members` : 'None'}</div>
                </div> */}

                {/* Game Mode Selection */}
                <div className="flex space-x-8">
                    {gameTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => handleModeChange(type.id)}
                            className={`pb-4 px-6 text-lg font-bold transition-all duration-300 border-b-2 ${selectedMode === type.id
                                ? 'text-cyan-400 border-cyan-400'
                                : 'text-purple-400 border-transparent hover:text-white'
                                }`}
                        >
                            {type.name.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Team/Solo Display */}
                {selectedMode === 'solo' ? (
                    <div className="flex justify-center">
                        <AvatarCard
                            user={{
                                username: user.username,
                                avatar: '/image/default-avatar.webp',
                                rank: 'TOXIC'
                            }}
                            isCurrentUser={true}
                            isReady={true}
                        />
                    </div>
                ) : (
                    <>
                        {isInTeam ? (
                            <TeamSelection
                                team={team}
                                onInviteFriend={handleInviteFriend}
                                onToggleReady={handleToggleReady}
                                currentUserId={currentUserId}
                            />
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="text-purple-400 text-lg">
                                    Create a team to start playing
                                </div>
                                <button
                                    onClick={createTeam}
                                    disabled={!isConnected}
                                    className={`px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 ${isConnected
                                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    <Users className="w-5 h-5" />
                                    <span>CREATE TEAM</span>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-6 items-center">
                    <button
                        onClick={handleStart}
                        disabled={!canStart || !isConnected}
                        className={`px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 ${isStarted
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : canStart && isConnected
                                ? 'bg-cyan-500 hover:bg-cyan-600 text-black'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isStarted ? (
                            <div className="flex items-center space-x-2">
                                <Square className="w-6 h-6" />
                                <span>STOP</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Play className="w-6 h-6" />
                                <span>START</span>
                            </div>
                        )}
                    </button>

                    {isInTeam && (
                        <button
                            onClick={handleLeaveTeam}
                            disabled={!isConnected}
                            className={`px-8 py-4 rounded-lg font-semibold transition-colors ${isConnected
                                ? 'bg-red-700 hover:bg-red-600 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            LEAVE TEAM
                        </button>
                    )}
                </div>

                {/* Force show invite modal button for testing */}
                {/* <button
                    onClick={() => {
                        console.log("🧪 FORCING INVITE MODAL TO SHOW");
                        setInviteData({
                            teamId: 'test_team',
                            senderId: 'test_sender',
                            senderName: 'Test User',
                            gameMode: 'team3v3',
                            teamSize: 1,
                            maxSize: 3
                        });
                        setShowInviteModal(true);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-black rounded"
                >
                    🧪 Test Invite Modal
                </button> */}
            </div>

            {/* Team Chat */}
            {selectedMode === 'team3v3' && isInTeam && (
                <div className="w-80">
                    <TeamChat team={team} currentUserId={currentUserId} />
                </div>
            )}

            {/* Team Selection Modal */} 
            
            {showTeamModal && (
                <TeamSelectionModal
                    friends={onlineFriends}
                    onSelectFriend={handleSelectFriend}
                    onClose={() => setShowTeamModal(false)}
                />
            )}

            {/* Invite Modal - ADD MORE DEBUG INFO */}
            {showInviteModal && inviteData && (
                <InviteModal
                    inviteData={inviteData}
                    onAccept={() => handleInviteResponse(true)}
                    onDecline={() => handleInviteResponse(false)}
                    onClose={() => setShowInviteModal(false)}
                />
            )}

            {/* Show debug info if modal should be showing but isn't */}
            {showInviteModal && !inviteData && (
                <div className="fixed inset-0 bg-red-500/50 flex items-center justify-center z-50">
                    <div className="bg-white text-black p-4 rounded">
                        <h3>DEBUG: Modal should show but inviteData is null</h3>
                        <p>showInviteModal: {showInviteModal.toString()}</p>
                        <p>inviteData: {JSON.stringify(inviteData)}</p>
                        <button onClick={() => setShowInviteModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameModeSelection;