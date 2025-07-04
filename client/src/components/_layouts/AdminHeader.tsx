import React from 'react';
import { Bell } from 'lucide-react';

export const Header = ({ currentPageTitle }) => {
  return (
    <header className="bg-gray-800 border-b border-purple-500/20 px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {currentPageTitle}
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
  );
};