import { useState } from 'react';
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
  Bell,
  Gamepad2,
  LogOut
} from 'lucide-react';

import Dashboard from '@/components/adminSession/dashboard';
import UserManagement from '@/components/adminSession/userManagement/main';
import ProblemManagement from '@/components/adminSession/problemManagement/main';
import RewardManagement from '@/components/adminSession/rewardManagement/main';
import LevelManagement from '@/components/adminSession/levelManagement/main';
import { logoutThunk } from '@/redux/thunk';
import { useAppDispatch } from '@/redux/hooks';


const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const dispatch = useAppDispatch()
  async function logout() {
    await dispatch(logoutThunk())
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'problems', label: 'Problems', icon: FileText },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'levels', label: 'Levels', icon: Settings }, // Using Settings icon for now
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
    { id: 'forum', label: 'Forum Moderation', icon: MessageSquare },
    { id: 'shop', label: 'Black Market', icon: ShoppingCart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = sidebarItems.find(item => item.id === currentPage);
    return currentItem ? currentItem.label : 'Dashboard';
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'problems':
        return <ProblemManagement />;
      case 'rewards':
        return <RewardManagement />;
      case 'levels':
        return <LevelManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
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
        <button
          onClick={logout}
          className="group flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-purple-800/50 hover:border-red-500/50"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          <span className="font-medium">Logout</span>
        </button>

        {/* Admin Profile */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-purple-500/20 px-6 py-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                {getCurrentPageTitle()}
              </h2>
              <p className="text-gray-400 text-sm mt-1">Game Administration Portal</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-3 hover:bg-purple-700/30 rounded-lg transition-colors group">
                <Bell size={20} className="text-violet-300 group-hover:text-white" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse shadow-lg">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3 bg-purple-800/30 rounded-lg px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  A
                </div>
                <span className="font-medium text-white">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;