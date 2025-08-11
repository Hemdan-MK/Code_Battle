// utils/socket.js
import { io } from 'socket.io-client';
import { getToken, getUser } from '../utils/tokenUtils';

// Initialize socket connection
const token = getToken();
const username = getUser()?.username


export const socket = io('http://localhost:3000', {
    autoConnect: false,
    auth: {
        token,
        username
    }
});

// Socket connection helpers
export const connectSocket = (token) => {
    if (token) {
        socket.auth = { token };
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

// Team-related socket events
export const teamSocketEvents = {
    createTeam: (userId, gameMode) => {        
        socket.emit('create_team', { userId, gameMode });
    },

    sendTeamInvite: (senderId, receiverId, teamId) => {
        socket.emit('send_team_invite', { senderId, receiverId, teamId });
    },

    respondToTeamInvite: (userId, teamId, accepted) => {
        socket.emit('respond_team_invite', { userId, teamId, accepted });
    },

    leaveTeam: (userId) => {
        socket.emit('leave_team', { userId });
    },

    sendTeamMessage: (senderId, message, timestamp) => {
        socket.emit('send_team_message', { senderId, message, timestamp });
    },

    updateReadyStatus: (userId, ready) => {
        socket.emit('update_team_ready_status', { userId, ready });
    }
};

export default socket;