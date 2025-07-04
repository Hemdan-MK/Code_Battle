import React, { useState, useEffect } from 'react';
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
  Bell
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeRoute, setActiveRoute] = useState('dashboard');

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
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-900 text-white flex flex-col`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className={`font-bold text-xl ${!sidebarOpen && 'hidden'}`}>CodeBattle Admin</h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-700 rounded">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <nav className="flex-1 p-4">
          {sidebarItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveRoute(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${activeRoute === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
                  }`}
              >
                <Icon size={20} />
                <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">{activeRoute}</h2>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <span className="font-medium">Admin User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};


export default AdminLayout;