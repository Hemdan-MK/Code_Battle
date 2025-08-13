import { useEffect, useState } from 'react';
import { getMatchHistoryAPI } from '@/services/user/getDetailsService';
import { Loader2, Shield, Sword, Crown } from 'lucide-react';
import { getUser } from '@/utils/tokenUtils';

const MatchHistorySection = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const currentUser = getUser();

    useEffect(() => {
        const fetchMatchHistory = async () => {
            try {
                setIsLoading(true);
                const response = await getMatchHistoryAPI();
                if (response.success) {
                    setMatches(response.data);
                } else {
                    setError(response.message || 'Failed to fetch match history.');
                }
            } catch (err) {
                setError(err.message || 'An error occurred while fetching match history.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatchHistory();
    }, []);

    if (isLoading) {
        return (
            <div className="pt-20 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="ml-4 text-white text-lg">Loading match history...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="pt-20 flex justify-center items-center">
                <span className="text-red-400">{error}</span>
            </div>
        );
    }

    return (
        <div className="pt-20 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Match History</h2>
            </div>

            {matches.length === 0 ? (
                <p className="text-gray-400">No matches played yet.</p>
            ) : (
                <div className="space-y-4">
                    {matches.map((match) => {
                        const isWin = match.teams[match.winner].players.some(p => p.userId === currentUser.id);
                        return (
                            <div key={match._id} className={`bg-gray-800/50 p-4 rounded-lg border-l-4 ${isWin ? 'border-green-500' : 'border-red-500'}`}>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-white">{match.gameMode === 'solo' ? 'Solo Match' : 'Team 3v3'}</p>
                                        <p className={`text-sm font-semibold ${isWin ? 'text-green-400' : 'text-red-400'}`}>
                                            {isWin ? 'Victory' : 'Defeat'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-300">{new Date(match.date).toLocaleDateString()}</p>
                                        <p className="text-xs text-gray-500">{new Date(match.date).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MatchHistorySection;
