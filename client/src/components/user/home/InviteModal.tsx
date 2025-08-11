import { Users, Check, X, Crown } from "lucide-react";

const InviteModal = ({ inviteData, onAccept, onDecline, onClose }) => {
    if (!inviteData) return null;

    const { senderName, gameMode, teamSize, maxSize } = inviteData;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-b from-purple-900/90 to-black/90 backdrop-blur-md border border-purple-600/50 rounded-lg w-96 overflow-hidden">
                {/* Header */}
                <div className="p-6 text-center border-b border-purple-600/30">
                    <div className="w-16 h-16 bg-cyan-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-cyan-400" />
                    </div>
                    <h3 className="text-white font-bold text-xl mb-2">Team Invitation</h3>
                    <p className="text-purple-300">
                        <span className="text-cyan-400 font-medium">{senderName}</span> invited you to join their team
                    </p>
                </div>

                {/* Team Details */}
                <div className="p-6 space-y-4">
                    <div className="bg-purple-800/30 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-purple-400">Game Mode:</span>
                            <span className="text-white font-medium">
                                {gameMode === 'team3v3' ? 'Team 3v3' : gameMode}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-purple-400">Current Team Size:</span>
                            <span className="text-white font-medium">
                                {teamSize}/{maxSize}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-purple-400">Team Leader:</span>
                            <span className="text-cyan-400 font-medium flex items-center space-x-1">
                                <Crown className="w-3 h-3" />
                                <span>{senderName}</span>
                            </span>
                        </div>
                    </div>

                    <div className="text-center text-sm text-purple-400">
                        Do you want to join this team?
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 border-t border-purple-600/30 flex space-x-3">
                    <button
                        onClick={onDecline}
                        className="flex-1 px-4 py-3 bg-red-600/20 border border-red-600/50 hover:bg-red-600/30 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <X className="w-4 h-4" />
                        <span>Decline</span>
                    </button>

                    <button
                        onClick={onAccept}
                        className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                        <Check className="w-4 h-4" />
                        <span>Accept</span>
                    </button>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-purple-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default InviteModal;