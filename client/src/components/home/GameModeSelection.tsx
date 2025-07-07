import { Play, Square } from "lucide-react";
import AvatarCard from "./AvatarCard";
import { useState } from "react";


const TeamSelection = ({ gameType, onAddFriend }) => {
    const currentUser = { name: 'RaineShadow', avatar: '/image/image-1.webp', rank: 'TOXIC' };
    const teamMembers = [
        // { name: 'Sh0tty', avatar: '/image/image-1.webp', rank: 'HUNTSMAN' },
        // { name: 'Gafiltha', avatar: '/image/image-1.webp', rank: 'OLD DOG' },
    ];

    const maxTeamSize = 3; // Only 3v3 now
    const emptySlots = maxTeamSize - teamMembers.length - 1; // -1 for current user

    return (
        <div className="flex justify-center space-x-6">
            {/* Current User */}
            <AvatarCard user={currentUser} isCurrentUser={true} />

            {/* Team Members */}
            {teamMembers.map((member, index) => (
                <AvatarCard key={index} user={member} />
            ))}

            {/* Empty Slots */}
            {[...Array(emptySlots)].map((_, index) => (
                <AvatarCard
                    key={`empty-${index}`}
                    user={{}}
                    showAddButton={true}
                    onAdd={onAddFriend}
                />
            ))}
        </div>
    );
};

const gameTypes = [
    { id: 'solo', name: 'Solo Queue', description: '1v1 battles' },
    { id: 'team3v3', name: 'Team 3v3', description: '3v3 team battles' },
];



const GameModeSelection = () => {
    const [selectedMode, setSelectedMode] = useState('solo');
    const [isStarted, setIsStarted] = useState(false);

    const handleStart = () => {
        setIsStarted(!isStarted);
    };

    return (
        <div className="pt-20 flex flex-col items-center space-y-8">
            {/* Game Mode Tabs */}
            <div className="flex space-x-8">
                {gameTypes.map((type) => (
                    <button
                        key={type.id}
                        onClick={() => setSelectedMode(type.id)}
                        className={`pb-4 px-6 text-lg font-bold transition-all duration-300 border-b-2 ${selectedMode === type.id
                            ? 'text-cyan-400 border-cyan-400'
                            : 'text-purple-400 border-transparent hover:text-white'
                            }`}
                    >
                        {type.name.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Team Selection */}
            {selectedMode === 'solo' ? (
                <div className="flex justify-center">
                    <AvatarCard
                        user={{ name: 'RaineShadow', avatar: '/image/image-1.webp', rank: 'TOXIC' }}
                        isCurrentUser={true}
                    />
                </div>
            ) : (
                <TeamSelection
                    gameType={selectedMode}
                    onAddFriend={() => console.log('Add friend clicked')}
                />
            )}

            {/* Action Buttons */}
            <div className="flex space-x-6 items-center">


                <button
                    onClick={handleStart}
                    className={`px-12 py-4 rounded-lg font-bold text-xl transition-all duration-300 ${isStarted
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-black'
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

                <button className="px-8 py-4 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors">
                    LEAVE PARTY
                </button>
            </div>
        </div>
    );
};


export default GameModeSelection;