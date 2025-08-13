import {
    Users,
    FileText,
    Shield,
    BarChart3,
    AlertTriangle
} from 'lucide-react';


const Dashboard = () => {
    const stats = [
        { label: 'Total Users', value: '12,543', change: '+12%', icon: Users, color: 'from-blue-500 to-cyan-500' },
        { label: 'Active Matches', value: '89', change: '+5%', icon: Shield, color: 'from-green-500 to-emerald-500' },
        { label: 'Revenue', value: '$45,230', change: '+18%', icon: BarChart3, color: 'from-purple-500 to-violet-500' },
        { label: 'Problems', value: '234', change: '+3%', icon: FileText, color: 'from-orange-500 to-red-500' },
    ];

    const mockReports = [
        { id: 1, reporter: 'user123', reported: 'cheater456', reason: 'Code plagiarism', status: 'pending', date: '2024-06-03' },
        { id: 2, reporter: 'cleancode', reported: 'spammer789', reason: 'Inappropriate behavior', status: 'resolved', date: '2024-06-02' },
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                                    <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                                    <p className="text-sm text-green-400 font-medium">{stat.change}</p>
                                </div>
                                <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Shield className="text-violet-400" size={20} />
                        Recent Matches
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600/50 hover:border-purple-500/30 transition-colors">
                                <div>
                                    <p className="font-semibold text-white">1v1 Battle #{1000 + i}</p>
                                    <p className="text-sm text-gray-400">coder123 vs devmaster</p>
                                    <p className="text-xs text-violet-300 mt-1">Duration: 15:32</p>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-medium shadow-md">
                                        Completed
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <AlertTriangle className="text-red-400" size={20} />
                        Pending Reports
                    </h3>
                    <div className="space-y-4">
                        {mockReports.filter(r => r.status === 'pending').map(report => (
                            <div key={report.id} className="flex items-center justify-between p-4 bg-red-900/20 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-colors">
                                <div>
                                    <p className="font-semibold text-white">{report.reason}</p>
                                    <p className="text-sm text-gray-400">
                                        <span className="text-blue-400">{report.reporter}</span> reported <span className="text-red-400">{report.reported}</span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">{report.date}</p>
                                </div>
                                <button className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg">
                                    Review
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20">
                <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg">
                        Create Tournament
                    </button>
                    <button className="p-4 bg-gradient-to-br from-green-600 to-green-700 rounded-lg text-white font-medium hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg">
                        Add Problem
                    </button>
                    <button className="p-4 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg text-white font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg">
                        Send Broadcast
                    </button>
                    <button className="p-4 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg text-white font-medium hover:from-orange-700 hover:to-orange-800 transition-all duration-200 shadow-md hover:shadow-lg">
                        System Status
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard