import React, { useEffect, useState } from 'react';
import levelService from '@/services/admin/levelService';
import type { ILevel } from '@/types/index';

const LevelManagement: React.FC = () => {
    const [levels, setLevels] = useState<ILevel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const data = await levelService.getLevels();
                setLevels(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch levels');
            } finally {
                setLoading(false);
            }
        };

        fetchLevels();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Level Management</h2>
                <button
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Level Reward
                </button>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Level Number</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Reward</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {levels.map((level: ILevel) => (
                                <tr key={level._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-white">{level.levelNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-white">{level.reward}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-500/10 transition-colors">View</button>
                                        <button className="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded hover:bg-yellow-500/10 transition-colors">Edit</button>
                                        <button className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LevelManagement;
