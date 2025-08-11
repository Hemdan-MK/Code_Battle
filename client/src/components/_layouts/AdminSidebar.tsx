import {
  Users,
  Trophy,
  Settings,
  FileText,
  BarChart3,
  MessageSquare,
  ShoppingCart,
  AlertTriangle,
  Menu,
  X,
  Gamepad2
} from 'lucide-react';

export const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, setCurrentPage }) => {
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'problems', label: 'Problems', icon: FileText },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
    { id: 'forum', label: 'Forum Moderation', icon: MessageSquare },
    { id: 'shop', label: 'Black Market', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900 text-white flex flex-col border-r border-purple-500/20`}>
      <div className="p-4 border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gamepad2 className="text-violet-400" size={24} />
            <h1 className={`font-bold text-xl bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent ${!sidebarOpen && 'hidden'}`}>
              CodeBattle Admin
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-purple-700/50 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} className="text-violet-300" /> : <Menu size={20} className="text-violet-300" />}
          </button>
        </div>
      </div>

      <nav className="flex-1 p-4">
        {sidebarItems.map(item => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-all duration-200 group ${active
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-lg shadow-violet-500/25'
                : 'hover:bg-purple-800/30 hover:shadow-md hover:shadow-purple-500/10'
                }`}
            >
              <Icon size={20} className={active ? 'text-white' : 'text-violet-300 group-hover:text-white'} />
              <span className={`${!sidebarOpen && 'hidden'} ${active ? 'text-white font-medium' : 'text-violet-200 group-hover:text-white'}`}>
                {item.label}
              </span>
              {active && (
                <div className="ml-auto w-2 h-2 bg-violet-300 rounded-full animate-pulse"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
            A
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-medium text-white">Admin User</p>
              <p className="text-xs text-violet-300">Super Admin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};