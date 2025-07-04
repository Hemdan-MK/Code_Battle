import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { 
  User, 
  LogOut, 
  Home, 
  Sparkles, 
  Trophy, 
  Target, 
  Users, 
  Zap,
  Code,
  Sword,
  Crown,
  Shield,
  Gamepad2
} from 'lucide-react';
import { logoutThunk } from '@/redux/thunk';

// Mock types for the example
type AppDispatch = any;

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  async function logout() {
    await dispatch(logoutThunk())
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-black"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Code Elements */}
        <div className="absolute top-16 left-4 md:top-20 md:left-10 opacity-20">
          <div className="animate-bounce">
            <Code className="w-8 h-8 md:w-16 md:h-16 text-purple-400" />
          </div>
        </div>
        <div className="absolute top-32 right-4 md:top-40 md:right-20 opacity-15">
          <div className="animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Target className="w-6 h-6 md:w-12 md:h-12 text-purple-300" />
          </div>
        </div>
        <div className="absolute bottom-32 left-4 md:bottom-40 md:left-20 opacity-15">
          <div className="animate-bounce" style={{ animationDelay: '1s' }}>
            <Trophy className="w-8 h-8 md:w-14 md:h-14 text-purple-500" />
          </div>
        </div>
        <div className="absolute bottom-16 right-4 md:bottom-20 md:right-10 opacity-20">
          <div className="animate-bounce" style={{ animationDelay: '1.5s' }}>
            <Users className="w-6 h-6 md:w-10 md:h-10 text-purple-300" />
          </div>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navigation Header */}
      <nav className="relative z-10 bg-black/40 backdrop-blur-xl border-b border-purple-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg">
                <Sword className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-xl bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                CODE<span className="text-purple-500">BATTLE</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                  <User className="w-4 h-4 text-purple-400" />
                </div>
                <span className="font-medium">Welcome, Warrior!</span>
              </div>
              <button
                onClick={logout}
                className="group flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200 border border-purple-800/50 hover:border-red-500/50"
              >
                <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className={`
          text-center mb-16 transform transition-all duration-1000 delay-300
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="p-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full shadow-2xl shadow-purple-500/25">
                <Crown className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-300 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-purple-300 to-white bg-clip-text text-transparent">
            BATTLE ARENA
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light mb-8 max-w-3xl mx-auto leading-relaxed">
            Welcome to your command center. Track your victories, challenge opponents, and dominate the leaderboards.
          </p>
        </div>

        {/* Stats Cards */}
        <div className={`
          grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transform transition-all duration-1000 delay-500
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          <div className="backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-400">24</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Victories</h3>
            <p className="text-gray-400 text-sm">Battles won</p>
          </div>

          <div className="backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl">
                <Target className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-400">156</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Accuracy</h3>
            <p className="text-gray-400 text-sm">Success rate</p>
          </div>

          <div className="backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-emerald-400">98</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Rank</h3>
            <p className="text-gray-400 text-sm">Global position</p>
          </div>

          <div className="backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-6 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-pink-600 to-red-500 rounded-xl">
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-pink-400">12</span>
            </div>
            <h3 className="text-white font-semibold mb-1">Challenges</h3>
            <p className="text-gray-400 text-sm">Active battles</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className={`
          grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transform transition-all duration-1000 delay-700
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          <div className="group backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-purple-600/50 cursor-pointer">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-2xl mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Quick Battle</h3>
            <p className="text-gray-400 leading-relaxed">Jump into a random match and test your skills against worthy opponents.</p>
          </div>

          <div className="group backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-purple-600/50 cursor-pointer">
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Tournaments</h3>
            <p className="text-gray-400 leading-relaxed">Join weekly tournaments and compete for glory and exclusive rewards.</p>
          </div>

          <div className="group backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-2 hover:border-purple-600/50 cursor-pointer md:col-span-2 lg:col-span-1">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl mb-6 w-fit group-hover:scale-110 transition-transform duration-300">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Practice Arena</h3>
            <p className="text-gray-400 leading-relaxed">Sharpen your skills in the training grounds before entering combat.</p>
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className={`
          backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 transform transition-all duration-1000 delay-900
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          <h2 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
            Hall of Champions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-b from-yellow-900/20 to-transparent rounded-xl border border-yellow-600/30">
              <div className="text-4xl mb-2">🥇</div>
              <div className="text-xl font-bold text-yellow-400 mb-1">CodeMaster</div>
              <div className="text-gray-400">2,847 pts</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-gray-900/20 to-transparent rounded-xl border border-gray-600/30">
              <div className="text-4xl mb-2">🥈</div>
              <div className="text-xl font-bold text-gray-300 mb-1">BugHunter</div>
              <div className="text-gray-400">2,156 pts</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-b from-orange-900/20 to-transparent rounded-xl border border-orange-600/30">
              <div className="text-4xl mb-2">🥉</div>
              <div className="text-xl font-bold text-orange-400 mb-1">AlgoNinja</div>
              <div className="text-gray-400">1,943 pts</div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white rounded-full shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center border border-purple-400/50">
          <Sparkles className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default HomePage;


// // import React, { useState, useEffect } from 'react';
// // import { Users, MessageCircle, Settings, Shield, Award, Trophy, LogOut, Home, ShoppingBag, Globe, Plus, X, Volume2, VolumeX, UserPlus, UserX, Edit3, Bell, BellOff, Search, Filter, MoreVertical, Send, Gamepad2, Zap, Target, Clock } from 'lucide-react';

// // const ValorantInterface = () => {
// //   const [selectedMode, setSelectedMode] = useState('solo');
// //   const [chatMessages, setChatMessages] = useState([
// //     { id: 1, user: 'Phoenix', message: 'Ready for ranked?', time: '10:32', isOwn: false },
// //     { id: 2, user: 'Sage', message: 'Let\'s queue up!', time: '10:35', isOwn: false },
// //     { id: 3, user: 'You', message: 'Give me 2 mins', time: '10:36', isOwn: true }
// //   ]);
// //   const [newMessage, setNewMessage] = useState('');
// //   const [selectedFriend, setSelectedFriend] = useState(null);
// //   const [searchFriends, setSearchFriends] = useState('');
// //   const [showFriendOptions, setShowFriendOptions] = useState(null);
// //   const [notifications, setNotifications] = useState(true);
// //   const [currentTime, setCurrentTime] = useState(new Date());

// //   const [friends, setFriends] = useState([
// //     {
// //       id: 1,
// //       name: 'Phoenix_Fire',
// //       status: 'online',
// //       rank: 'Diamond 2',
// //       rankIcon: '💎',
// //       game: 'In Competitive Match',
// //       avatar: 'PF',
// //       note: 'Good entry fragger',
// //       isMuted: false,
// //       lastSeen: new Date()
// //     },
// //     {
// //       id: 2,
// //       name: 'SageHealer99',
// //       status: 'online',
// //       rank: 'Immortal 1',
// //       rankIcon: '⚡',
// //       game: 'In Lobby',
// //       avatar: 'SH',
// //       note: 'Best support player',
// //       isMuted: false,
// //       lastSeen: new Date()
// //     },
// //     {
// //       id: 3,
// //       name: 'JettDash',
// //       status: 'online',
// //       rank: 'Radiant',
// //       rankIcon: '🔥',
// //       game: 'Available',
// //       avatar: 'JD',
// //       note: 'Insane aim',
// //       isMuted: false,
// //       lastSeen: new Date()
// //     },
// //     {
// //       id: 4,
// //       name: 'SovaRecon',
// //       status: 'away',
// //       rank: 'Ascendant 3',
// //       rankIcon: '🎯',
// //       game: 'Away - 15 min',
// //       avatar: 'SR',
// //       note: 'Intel king',
// //       isMuted: false,
// //       lastSeen: new Date(Date.now() - 15 * 60 * 1000)
// //     },
// //     {
// //       id: 5,
// //       name: 'ReynaFrag',
// //       status: 'offline',
// //       rank: 'Diamond 1',
// //       rankIcon: '💎',
// //       game: 'Last seen 2h ago',
// //       avatar: 'RF',
// //       note: 'Solo queue master',
// //       isMuted: false,
// //       lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000)
// //     },
// //     {
// //       id: 6,
// //       name: 'CypherTrap',
// //       status: 'offline',
// //       rank: 'Immortal 2',
// //       rankIcon: '⚡',
// //       game: 'Last seen 1d ago',
// //       avatar: 'CT',
// //       note: 'Sentinel main',
// //       isMuted: true,
// //       lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000)
// //     }
// //   ]);

// //   const [userStats, setUserStats] = useState({
// //     username: 'VALORANT_LEGEND',
// //     level: 187,
// //     currentXP: 12450,
// //     maxXP: 15000,
// //     rank: 'IMMORTAL 2',
// //     rankIcon: '⚡',
// //     rr: 87,
// //     winRate: 73,
// //     kd: 1.24,
// //     matches: 342,
// //     headshotPercent: 23,
// //     peakRank: 'Radiant',
// //     currentSeason: 'Episode 8 Act 2',
// //     recentMatches: [
// //       { result: 'win', map: 'Bind', score: '13-7', kda: '18/12/4' },
// //       { result: 'loss', map: 'Haven', score: '11-13', kda: '15/14/6' },
// //       { result: 'win', map: 'Split', score: '13-9', kda: '22/10/3' }
// //     ]
// //   });

// //   const navItems = [
// //     { icon: Home, label: 'HOME', active: true },
// //     { icon: Globe, label: 'LEADERBOARD', active: false },
// //     { icon: ShoppingBag, label: 'SHOP', active: false },
// //     { icon: Users, label: 'CONTACTS', active: false },
// //     { icon: Trophy, label: 'CAREER', active: false },
// //     { icon: Settings, label: 'SETTINGS', active: false }
// //   ];

// //   // Update time every minute
// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setCurrentTime(new Date());
// //     }, 60000);
// //     return () => clearInterval(timer);
// //   }, []);

// //   const sendMessage = () => {
// //     if (newMessage.trim()) {
// //       const newMsg = {
// //         id: chatMessages.length + 1,
// //         user: 'You',
// //         message: newMessage,
// //         time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
// //         isOwn: true
// //       };
// //       setChatMessages([...chatMessages, newMsg]);
// //       setNewMessage('');
// //     }
// //   };

// //   const toggleFriendMute = (friendId) => {
// //     setFriends(friends.map(friend =>
// //       friend.id === friendId
// //         ? { ...friend, isMuted: !friend.isMuted }
// //         : friend
// //     ));
// //   };

// //   const removeFriend = (friendId) => {
// //     setFriends(friends.filter(friend => friend.id !== friendId));
// //     setShowFriendOptions(null);
// //   };

// //   const addNote = (friendId, note) => {
// //     setFriends(friends.map(friend =>
// //       friend.id === friendId
// //         ? { ...friend, note: note }
// //         : friend
// //     ));
// //   };

// //   const filteredFriends = friends.filter(friend =>
// //     friend.name.toLowerCase().includes(searchFriends.toLowerCase())
// //   );

// //   const onlineFriends = filteredFriends.filter(f => f.status === 'online');
// //   const awayFriends = filteredFriends.filter(f => f.status === 'away');
// //   const offlineFriends = filteredFriends.filter(f => f.status === 'offline');

// //   const getStatusColor = (status) => {
// //     switch(status) {
// //       case 'online': return 'bg-green-500';
// //       case 'away': return 'bg-yellow-500';
// //       case 'offline': return 'bg-gray-500';
// //       default: return 'bg-gray-500';
// //     }
// //   };

// //   const getGameModeDescription = () => {
// //     return selectedMode === 'solo'
// //       ? 'Queue up for solo competitive matches'
// //       : 'Create or join a team for group play';
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative">

// //       {/* Animated Background Elements */}
// //       <div className="absolute inset-0 overflow-hidden">
// //         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
// //         <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
// //         <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-bounce"></div>

// //         {/* Grid Pattern */}
// //         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.03"%3E%3Cpath d="M0 0h100v100H0z"/%3E%3Cpath d="M25 0v100M50 0v100M75 0v100M0 25h100M0 50h100M0 75h100"/%3E%3C/g%3E%3C/svg%3E')]"></div>
// //       </div>

// //       {/* Main Container */}
// //       <div className="relative z-10 flex h-screen">

// //         {/* Left Panel - User Stats & Info */}
// //         <div className="w-96 bg-black/30 backdrop-blur-xl border-r border-gray-700/30 flex flex-col">

// //           {/* User Profile Section */}
// //           <div className="p-6 border-b border-gray-700/30">
// //             <div className="flex items-center space-x-4 mb-6">
// //               <div className="relative">
// //                 <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
// //                   <Shield className="w-10 h-10 text-white" />
// //                 </div>
// //                 <div className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center">
// //                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
// //                 </div>
// //               </div>
// //               <div className="flex-1">
// //                 <h2 className="text-2xl font-bold text-white">{userStats.username}</h2>
// //                 <p className="text-gray-400">Level {userStats.level}</p>
// //                 <p className="text-sm text-gray-500">{userStats.currentSeason}</p>
// //               </div>
// //             </div>

// //             {/* XP Progress */}
// //             <div className="mb-6">
// //               <div className="flex justify-between text-sm mb-2">
// //                 <span className="text-gray-300">XP Progress</span>
// //                 <span className="text-gray-400">{userStats.currentXP.toLocaleString()} / {userStats.maxXP.toLocaleString()}</span>
// //               </div>
// //               <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner">
// //                 <div
// //                   className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
// //                   style={{width: `${(userStats.currentXP / userStats.maxXP) * 100}%`}}
// //                 >
// //                   <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Current Rank */}
// //             <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-4 backdrop-blur-sm border border-gray-600/30">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-3">
// //                   <div className="text-3xl">{userStats.rankIcon}</div>
// //                   <div>
// //                     <p className="font-bold text-yellow-400 text-lg">{userStats.rank}</p>
// //                     <p className="text-sm text-gray-400">{userStats.rr} RR</p>
// //                   </div>
// //                 </div>
// //                 <div className="text-right">
// //                   <p className="text-xs text-gray-500">Peak Rank</p>
// //                   <p className="text-sm font-semibold text-red-400">{userStats.peakRank}</p>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Detailed Stats */}
// //           <div className="flex-1 p-6 overflow-y-auto">
// //             <h3 className="text-lg font-bold mb-4 flex items-center text-yellow-400">
// //               <Trophy className="w-5 h-5 mr-2" />
// //               Career Statistics
// //             </h3>

// //             {/* Main Stats Grid */}
// //             <div className="grid grid-cols-2 gap-3 mb-6">
// //               <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg p-4 text-center border border-green-700/30">
// //                 <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
// //                 <p className="text-2xl font-bold text-green-400">{userStats.winRate}%</p>
// //                 <p className="text-xs text-gray-400">Win Rate</p>
// //               </div>
// //               <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-lg p-4 text-center border border-blue-700/30">
// //                 <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
// //                 <p className="text-2xl font-bold text-blue-400">{userStats.kd}</p>
// //                 <p className="text-xs text-gray-400">K/D Ratio</p>
// //               </div>
// //               <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-lg p-4 text-center border border-purple-700/30">
// //                 <Gamepad2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
// //                 <p className="text-2xl font-bold text-purple-400">{userStats.matches}</p>
// //                 <p className="text-xs text-gray-400">Matches</p>
// //               </div>
// //               <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-lg p-4 text-center border border-red-700/30">
// //                 <Zap className="w-6 h-6 text-red-400 mx-auto mb-2" />
// //                 <p className="text-2xl font-bold text-red-400">{userStats.headshotPercent}%</p>
// //                 <p className="text-xs text-gray-400">Headshot %</p>
// //               </div>
// //             </div>

// //             {/* Recent Matches */}
// //             <div className="mb-6">
// //               <h4 className="text-md font-semibold mb-3 text-gray-300">Recent Matches</h4>
// //               <div className="space-y-2">
// //                 {userStats.recentMatches.map((match, index) => (
// //                   <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
// //                     <div className="flex items-center justify-between">
// //                       <div className="flex items-center space-x-3">
// //                         <div className={`w-3 h-3 rounded-full ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}></div>
// //                         <div>
// //                           <p className="text-sm font-semibold">{match.map}</p>
// //                           <p className="text-xs text-gray-400">{match.kda}</p>
// //                         </div>
// //                       </div>
// //                       <div className="text-right">
// //                         <p className={`text-sm font-bold ${match.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
// //                           {match.score}
// //                         </p>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Center Panel - Main Content */}
// //         <div className="flex-1 flex flex-col">

// //           {/* Enhanced Navigation Bar */}
// //           <nav className="bg-black/20 backdrop-blur-xl border-b border-gray-700/30 px-8 py-4 shadow-lg">
// //             <div className="flex items-center justify-between">
// //               <div className="flex space-x-6">
// //                 {navItems.map((item, index) => (
// //                   <button
// //                     key={index}
// //                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
// //                       item.active
// //                         ? 'text-red-400 bg-red-400/10 border border-red-400/30 shadow-lg'
// //                         : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
// //                     }`}
// //                   >
// //                     <item.icon className="w-5 h-5" />
// //                     <span className="font-semibold text-sm">{item.label}</span>
// //                   </button>
// //                 ))}
// //               </div>

// //               <div className="flex items-center space-x-4">
// //                 <div className="text-right">
// //                   <p className="text-xs text-gray-400">Current Time</p>
// //                   <p className="text-sm font-semibold">{currentTime.toLocaleTimeString()}</p>
// //                 </div>
// //                 <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-400/10">
// //                   <LogOut className="w-5 h-5" />
// //                   <span className="font-semibold">LOGOUT</span>
// //                 </button>
// //               </div>
// //             </div>
// //           </nav>

// //           {/* Match Mode Toggle Section */}
// //           <div className="px-8 py-8">
// //             <div className="text-center mb-6">
// //               <h2 className="text-2xl font-bold mb-2">Select Game Mode</h2>
// //               <p className="text-gray-400">{getGameModeDescription()}</p>
// //             </div>

// //             <div className="flex justify-center">
// //               <div className="relative bg-gray-800/40 rounded-2xl p-2 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
// //                 <div
// //                   className={`absolute top-2 bottom-2 w-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl transition-all duration-500 ease-out shadow-lg ${
// //                     selectedMode === 'team' ? 'translate-x-32' : 'translate-x-0'
// //                   }`}
// //                 >
// //                   <div className="h-full bg-white/10 rounded-xl"></div>
// //                 </div>
// //                 <div className="relative flex">
// //                   <button
// //                     onClick={() => setSelectedMode('solo')}
// //                     className={`px-8 py-4 rounded-xl font-bold transition-all duration-500 flex items-center space-x-2 ${
// //                       selectedMode === 'solo' ? 'text-white transform scale-105' : 'text-gray-400 hover:text-white'
// //                     }`}
// //                   >
// //                     <Users className="w-5 h-5" />
// //                     <span>SOLO QUEUE</span>
// //                   </button>
// //                   <button
// //                     onClick={() => setSelectedMode('team')}
// //                     className={`px-8 py-4 rounded-xl font-bold transition-all duration-500 flex items-center space-x-2 ${
// //                       selectedMode === 'team' ? 'text-white transform scale-105' : 'text-gray-400 hover:text-white'
// //                     }`}
// //                   >
// //                     <Users className="w-5 h-5" />
// //                     <span>TEAM PLAY</span>
// //                   </button>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Enhanced Main Game Card */}
// //           <div className="flex-1 px-8 pb-8 flex items-center justify-center">
// //             <div className="w-full max-w-6xl">
// //               <div className="relative bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/30 backdrop-blur-xl">

// //                 {/* 21:9 Aspect Ratio Container */}
// //                 <div className="aspect-[21/9] relative">

// //                   {/* Dynamic Background */}
// //                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10">
// //                     <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.1"%3E%3Cpath d="M0 0h80v80H0z"/%3E%3Cpath d="M20 0v80M40 0v80M60 0v80M0 20h80M0 40h80M0 60h80"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

// //                     {/* Animated Elements */}
// //                     <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/5 rounded-full blur-xl animate-pulse"></div>
// //                     <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
// //                   </div>

// //                   {/* Main Content */}
// //                   <div className="absolute inset-0 flex items-center justify-center p-12">
// //                     <div className="text-center max-w-2xl">

// //                       {/* User Avatar & Info */}
// //                       <div className="mb-8">
// //                         <div className="relative inline-block mb-6">
// //                           <div className="w-32 h-32 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
// //                             <Shield className="w-16 h-16 text-white" />
// //                           </div>
// //                           <div className="absolute -top-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900 flex items-center justify-center">
// //                             <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
// //                           </div>
// //                         </div>

// //                         <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
// //                           {userStats.username}
// //                         </h1>

// //                         <div className="flex items-center justify-center space-x-6 mb-6">
// //                           <div className="bg-yellow-500/20 px-6 py-3 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
// //                             <div className="flex items-center space-x-2">
// //                               <span className="text-2xl">{userStats.rankIcon}</span>
// //                               <span className="text-yellow-400 font-bold text-xl">{userStats.rank}</span>
// //                             </div>
// //                           </div>
// //                           <div className="text-gray-300 text-2xl">•</div>
// //                           <div className="text-gray-300 text-xl font-semibold">{userStats.rr} RR</div>
// //                         </div>
// //                       </div>

// //                       {/* Game Mode Info */}
// //                       <div className="mb-8">
// //                         <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm border border-gray-700/30 mb-4">
// //                           <p className="text-lg text-gray-300">
// //                             Mode: <span className="text-white font-semibold">{selectedMode.toUpperCase()}</span>
// //                           </p>
// //                           <p className="text-sm text-gray-400 mt-1">{getGameModeDescription()}</p>
// //                         </div>
// //                       </div>

// //                       {/* Start Game Button */}
// //                       <button className="group relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-red-400 hover:to-orange-400 px-16 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border border-red-400/30">
// //                         <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors duration-300"></div>
// //                         <span className="relative flex items-center space-x-3">
// //                           <Gamepad2 className="w-8 h-8" />
// //                           <span>START GAME</span>
// //                         </span>
// //                       </button>

// //                       <p className="text-sm text-gray-400 mt-4">
// //                         Estimated queue time: <span className="text-white font-semibold">2-4 minutes</span>
// //                       </p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Right Panel - Enhanced Social System */}
// //         <div className="w-96 bg-black/30 backdrop-blur-xl border-l border-gray-700/30 flex flex-col">

// //           {/* Social Header */}
// //           <div className="p-4 border-b border-gray-700/30">
// //             <div className="flex items-center justify-between mb-4">
// //               <h3 className="text-xl font-bold flex items-center">
// //                 <Users className="w-6 h-6 mr-2 text-blue-400" />
// //                 Social Hub
// //               </h3>
// //               <div className="flex items-center space-x-2">
// //                 <button
// //                   onClick={() => setNotifications(!notifications)}
// //                   className={`p-2 rounded-lg transition-colors ${notifications ? 'text-green-400 bg-green-400/10' : 'text-gray-400 hover:text-white'}`}
// //                 >
// //                   {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
// //                 </button>
// //                 <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/30">
// //                   <UserPlus className="w-5 h-5" />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Friends Counter */}
// //             <div className="flex items-center justify-between text-sm mb-4">
// //               <span className="text-gray-400">
// //                 Friends ({onlineFriends.length + awayFriends.length} online, {offlineFriends.length} offline)
// //               </span>
// //               <span className="text-green-400 font-semibold">{friends.length} total</span>
// //             </div>

// //             {/* Search Bar */}
// //             <div className="relative">
// //               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
// //               <input
// //                 type="text"
// //                 placeholder="Search friends..."
// //                 value={searchFriends}
// //                 onChange={(e) => setSearchFriends(e.target.value)}
// //                 className="w-full bg-gray-800/40 rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-700/30 focus:border-blue-500/50 focus:outline-none backdrop-blur-sm"
// //               />
// //             </div>
// //           </div>

// //           {/* Friends List */}
// //           <div className="flex-1 overflow-y-auto">

// //             {/* Online Friends */}
// //             {onlineFriends.length > 0 && (
// //               <div className="p-4">
// //                 <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
// //                   <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
// //                   ONLINE ({onlineFriends.length})
// //                 </h4>
// //                 <div className="space-y-2">
// //                   {onlineFriends.map((friend) => (
// //                     <div
// //                       key={friend.id}
// //                       className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/40 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700/30"
// //                     >
// //                       <div className="relative">
// //                         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center font-bold shadow-lg">
// //                           {friend.avatar}
// //                         </div>
// //                         <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(friend.status)}`}>
// //                           {friend.status === 'online' && <div className="w-2 h-2 bg-white rounded-full animate-pulse mx-auto mt-0.5"></div>}
// //                         </div>
// //                       </div>
// //                       <div className="flex-1 min-w-0">
// //                         <div className="flex items-center space-x-2">
// //                           <p className="font-semibold truncate text-white">{friend.name}</p>
// //                           {friend.isMuted && <VolumeX className="w-3 h-3 text-gray-500" />}
// //                         </div>
// //                         <div className="flex items-center space-x-1 text-xs">
// //                           <span className="text-gray-400">{friend.rankIcon}</span>
// //                           <span className="text-gray-400">{friend.rank}</span>
// //                         </div>
// //                         <p className="text-xs text-gray-500 truncate">{friend.game}</p>
// //                         {friend.note && <p className="text-xs text-blue-400 truncate italic">"{friend.note}"</p>}
// //                       </div>
// //                       <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                         <button
// //                           onClick={() => setSelectedFriend(friend)}
// //                           className="text-gray-400 hover:text-blue-400 p-1"
// //                         >
// //                           <MessageCircle className="w-4 h-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => setShowFriendOptions(showFriendOptions === friend.id ? null : friend.id)}
// //                           className="text-gray-400 hover:text-white p-1"
// //                         >
// //                           <MoreVertical className="w-4 h-4" />
// //                         </button>
// //                       </div>

// //                       {/* Friend Options Menu */}
// //                       {showFriendOptions === friend.id && (
// //                         <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50 min-w-48">
// //                           <button
// //                             onClick={() => toggleFriendMute(friend.id)}
// //                             className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
// //                           >
// //                             {friend.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
// //                             <span>{friend.isMuted ? 'Unmute' : 'Mute'}</span>
// //                           </button>
// //                           <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2">
// //                             <Edit3 className="w-4 h-4" />
// //                             <span>Edit Note</span>
// //                           </button>
// //                           <button
// //                             onClick={() => removeFriend(friend.id)}
// //                             className="w-full text-left px-3 py-2 rounded hover:bg-red-900 text-red-400 flex items-center space-x-2"
// //                           >
// //                             <UserX className="w-4 h-4" />
// //                             <span>Remove Friend</span>
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Away Friends */}
// //             {awayFriends.length > 0 && (
// //               <div className="p-4">
// //                 <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center">
// //                   <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
// //                   AWAY ({awayFriends.length})
// //                 </h4>
// //                 <div className="space-y-2">
// //                   {awayFriends.map((friend) => (
// //                     <div
// //                       key={friend.id}
// //                       className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/40 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700/30"
// //                     >
// //                       <div className="relative">
// //                         <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center font-bold shadow-lg opacity-75">
// //                           {friend.avatar}
// //                         </div>
// //                         <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(friend.status)}`}></div>
// //                       </div>
// //                       <div className="flex-1 min-w-0">
// //                         <div className="flex items-center space-x-2">
// //                           <p className="font-semibold truncate text-gray-300">{friend.name}</p>
// //                           {friend.isMuted && <VolumeX className="w-3 h-3 text-gray-500" />}
// //                         </div>
// //                         <div className="flex items-center space-x-1 text-xs">
// //                           <span className="text-gray-400">{friend.rankIcon}</span>
// //                           <span className="text-gray-400">{friend.rank}</span>
// //                         </div>
// //                         <p className="text-xs text-gray-500 truncate">{friend.game}</p>
// //                         {friend.note && <p className="text-xs text-blue-400 truncate italic">"{friend.note}"</p>}
// //                       </div>
// //                       <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                         <button
// //                           onClick={() => setSelectedFriend(friend)}
// //                           className="text-gray-400 hover:text-blue-400 p-1"
// //                         >
// //                           <MessageCircle className="w-4 h-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => setShowFriendOptions(showFriendOptions === friend.id ? null : friend.id)}
// //                           className="text-gray-400 hover:text-white p-1"
// //                         >
// //                           <MoreVertical className="w-4 h-4" />
// //                         </button>
// //                       </div>

// //                       {/* Friend Options Menu */}
// //                       {showFriendOptions === friend.id && (
// //                         <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50 min-w-48">
// //                           <button
// //                             onClick={() => toggleFriendMute(friend.id)}
// //                             className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
// //                           >
// //                             {friend.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
// //                             <span>{friend.isMuted ? 'Unmute' : 'Mute'}</span>
// //                           </button>
// //                           <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2">
// //                             <Edit3 className="w-4 h-4" />
// //                             <span>Edit Note</span>
// //                           </button>
// //                           <button
// //                             onClick={() => removeFriend(friend.id)}
// //                             className="w-full text-left px-3 py-2 rounded hover:bg-red-900 text-red-400 flex items-center space-x-2"
// //                           >
// //                             <UserX className="w-4 h-4" />
// //                             <span>Remove Friend</span>
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Offline Friends */}
// //             {offlineFriends.length > 0 && (
// //               <div className="p-4">
// //                 <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
// //                   <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
// //                   OFFLINE ({offlineFriends.length})
// //                 </h4>
// //                 <div className="space-y-2">
// //                   {offlineFriends.map((friend) => (
// //                     <div
// //                       key={friend.id}
// //                       className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/40 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700/30 opacity-60"
// //                     >
// //                       <div className="relative">
// //                         <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl flex items-center justify-center font-bold shadow-lg">
// //                           {friend.avatar}
// //                         </div>
// //                         <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(friend.status)}`}></div>
// //                       </div>
// //                       <div className="flex-1 min-w-0">
// //                         <div className="flex items-center space-x-2">
// //                           <p className="font-semibold truncate text-gray-400">{friend.name}</p>
// //                           {friend.isMuted && <VolumeX className="w-3 h-3 text-gray-500" />}
// //                         </div>
// //                         <div className="flex items-center space-x-1 text-xs">
// //                           <span className="text-gray-500">{friend.rankIcon}</span>
// //                           <span className="text-gray-500">{friend.rank}</span>
// //                         </div>
// //                         <p className="text-xs text-gray-600 truncate">{friend.game}</p>
// //                         {friend.note && <p className="text-xs text-blue-500 truncate italic">"{friend.note}"</p>}
// //                       </div>
// //                       <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
// //                         <button
// //                           onClick={() => setSelectedFriend(friend)}
// //                           className="text-gray-500 hover:text-blue-400 p-1"
// //                         >
// //                           <MessageCircle className="w-4 h-4" />
// //                         </button>
// //                         <button
// //                           onClick={() => setShowFriendOptions(showFriendOptions === friend.id ? null : friend.id)}
// //                           className="text-gray-500 hover:text-white p-1"
// //                         >
// //                           <MoreVertical className="w-4 h-4" />
// //                         </button>
// //                       </div>

// //                       {/* Friend Options Menu */}
// //                       {showFriendOptions === friend.id && (
// //                         <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50 min-w-48">
// //                           <button
// //                             onClick={() => toggleFriendMute(friend.id)}
// //                             className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
// //                           >
// //                             {friend.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
// //                             <span>{friend.isMuted ? 'Unmute' : 'Mute'}</span>
// //                           </button>
// //                           <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2">
// //                             <Edit3 className="w-4 h-4" />
// //                             <span>Edit Note</span>
// //                           </button>
// //                           <button
// //                             onClick={() => removeFriend(friend.id)}
// //                             className="w-full text-left px-3 py-2 rounded hover:bg-red-900 text-red-400 flex items-center space-x-2"
// //                           >
// //                             <UserX className="w-4 h-4" />
// //                             <span>Remove Friend</span>
// //                           </button>
// //                         </div>
// //                       )}
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}
// //           </div>

// //           {/* Enhanced Chat Section */}
// //           <div className="border-t border-gray-700/30 bg-black/20 backdrop-blur-sm">
// //             <div className="p-4">
// //               {selectedFriend ? (
// //                 <div className="mb-3">
// //                   <p className="text-sm text-gray-400">Chatting with</p>
// //                   <p className="font-semibold text-white">{selectedFriend.name}</p>
// //                 </div>
// //               ) : (
// //                 <div className="mb-3">
// //                   <p className="text-sm text-gray-400">Global Chat</p>
// //                 </div>
// //               )}

// //               {/* Chat Messages */}
// //               <div className="bg-gray-800/30 rounded-lg p-3 mb-3 max-h-40 overflow-y-auto space-y-3 border border-gray-700/30">
// //                 {chatMessages.map((msg) => (
// //                   <div key={msg.id} className={`${msg.isOwn ? 'text-right' : 'text-left'}`}>
// //                     <div className={`inline-block max-w-xs rounded-lg px-3 py-2 ${
// //                       msg.isOwn
// //                         ? 'bg-blue-600 text-white'
// //                         : 'bg-gray-700 text-gray-200'
// //                     }`}>
// //                       {!msg.isOwn && (
// //                         <div className="text-xs text-gray-400 mb-1">{msg.user}</div>
// //                       )}
// //                       <p className="text-sm">{msg.message}</p>
// //                       <div className="text-xs opacity-70 mt-1">{msg.time}</div>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Chat Input */}
// //               <div className="flex space-x-2">
// //                 <input
// //                   type="text"
// //                   value={newMessage}
// //                   onChange={(e) => setNewMessage(e.target.value)}
// //                   onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
// //                   placeholder={selectedFriend ? `Message ${selectedFriend.name}...` : "Type a message..."}
// //                   className="flex-1 bg-gray-800/40 rounded-lg px-3 py-2 text-sm border border-gray-700/30 focus:border-blue-500/50 focus:outline-none backdrop-blur-sm"
// //                 />
// //                 <button
// //                   onClick={sendMessage}
// //                   className="bg-blue-600 hover:bg-blue-500 rounded-lg px-3 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
// //                   disabled={!newMessage.trim()}
// //                 >
// //                   <Send className="w-4 h-4" />
// //                 </button>
// //               </div>

// //               {selectedFriend && (
// //                 <button
// //                   onClick={() => setSelectedFriend(null)}
// //                   className="text-xs text-gray-400 hover:text-white mt-2 transition-colors"
// //                 >
// //                   ← Back to global chat
// //                 </button>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Toast Notifications */}
// //       {notifications && (
// //         <div className="fixed top-4 right-4 space-y-2 z-50">
// //           {/* Example notification - you can add state management for real notifications */}
// //           <div className="bg-green-600/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg border border-green-500/30 animate-slide-in-right">
// //             <p className="text-sm font-semibold">Phoenix_Fire is now online</p>
// //           </div>
// //         </div>
// //       )}

// //       {/* Custom CSS for animations */}
// //       <style jsx>{`
// //         @keyframes slide-in-right {
// //           from {
// //             transform: translateX(100%);
// //             opacity: 0;
// //           }
// //           to {
// //             transform: translateX(0);
// //             opacity: 1;
// //           }
// //         }
// //         .animate-slide-in-right {
// //           animation: slide-in-right 0.3s ease-out;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default ValorantInterface;


// import React, { useState, useEffect } from 'react';
// import { Users, MessageCircle, Settings, Shield, Award, Trophy, LogOut, Home, ShoppingBag, Globe, Volume2, VolumeX, UserPlus, UserX, Edit3, Bell, BellOff, Search, MoreVertical, Send, Gamepad2, Zap, Target, User, X, Plus } from 'lucide-react';

// const ValorantInterface = () => {
//   const [selectedMode, setSelectedMode] = useState('solo');
//   const [chatMessages, setChatMessages] = useState([
//     { id: 1, user: 'Phoenix', message: 'Ready for ranked?', time: '10:32', isOwn: false },
//     { id: 2, user: 'Sage', message: 'Let\'s queue up!', time: '10:35', isOwn: false },
//     { id: 3, user: 'You', message: 'Give me 2 mins', time: '10:36', isOwn: true }
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [selectedFriend, setSelectedFriend] = useState(null);
//   const [searchFriends, setSearchFriends] = useState('');
//   const [showFriendOptions, setShowFriendOptions] = useState(null);
//   const [notifications, setNotifications] = useState(true);
//   const [currentTime, setCurrentTime] = useState(new Date());

//   const [friends, setFriends] = useState([
//     { id: 1, name: 'Phoenix_Fire', status: 'online', rank: 'Diamond 2', rankIcon: '💎', game: 'In Competitive Match', avatar: 'PF', note: 'Good entry fragger', isMuted: false },
//     { id: 2, name: 'SageHealer99', status: 'online', rank: 'Immortal 1', rankIcon: '⚡', game: 'In Lobby', avatar: 'SH', note: 'Best support player', isMuted: false },
//     { id: 3, name: 'JettDash', status: 'online', rank: 'Radiant', rankIcon: '🔥', game: 'Available', avatar: 'JD', note: 'Insane aim', isMuted: false },
//     { id: 4, name: 'SovaRecon', status: 'away', rank: 'Ascendant 3', rankIcon: '🎯', game: 'Away - 15 min', avatar: 'SR', note: 'Intel king', isMuted: false },
//     { id: 5, name: 'ReynaFrag', status: 'offline', rank: 'Diamond 1', rankIcon: '💎', game: 'Last seen 2h ago', avatar: 'RF', note: 'Solo queue master', isMuted: false },
//     { id: 6, name: 'CypherTrap', status: 'offline', rank: 'Immortal 2', rankIcon: '⚡', game: 'Last seen 1d ago', avatar: 'CT', note: 'Sentinel main', isMuted: true }
//   ]);

//   const [userStats, setUser Stats] = useState({
//     username: 'VALORANT_LEGEND',
//     level: 187,
//     currentXP: 12450,
//     maxXP: 15000,
//     rank: 'IMMORTAL 2',
//     rankIcon: '⚡',
//     rr: 87,
//     winRate: 73,
//     kd: 1.24,
//     matches: 342,
//     headshotPercent: 23,
//     peakRank: 'Radiant',
//     currentSeason: 'Episode 8 Act 2',
//     recentMatches: [
//       { result: 'win', map: 'Bind', score: '13-7', kda: '18/12/4' },
//       { result: 'loss', map: 'Haven', score: '11-13', kda: '15/14/6' },
//       { result: 'win', map: 'Split', score: '13-9', kda: '22/10/3' }
//     ]
//   });

//   const navItems = [
//     { icon: Home, label: 'HOME', active: true },
//     { icon: Globe, label: 'LEADERBOARD', active: false },
//     { icon: ShoppingBag, label: 'SHOP', active: false },
//     { icon: Users, label: 'CONTACTS', active: false },
//     { icon: Trophy, label: 'CAREER', active: false },
//     { icon: Settings, label: 'SETTINGS', active: false }
//   ];

//   // Update time every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => clearInterval(timer);
//   }, []);

//   const sendMessage = () => {
//     if (newMessage.trim()) {
//       const newMsg = {
//         id: chatMessages.length + 1,
//         user: 'You',
//         message: newMessage,
//         time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
//         isOwn: true
//       };
//       setChatMessages([...chatMessages, newMsg]);
//       setNewMessage('');
//     }
//   };

//   const toggleFriendMute = (friendId) => {
//     setFriends(friends.map(friend =>
//       friend.id === friendId
//         ? { ...friend, isMuted: !friend.isMuted }
//         : friend
//     ));
//   };

//   const removeFriend = (friendId) => {
//     setFriends(friends.filter(friend => friend.id !== friendId));
//     setShowFriendOptions(null);
//   };

//   const addNote = (friendId, note) => {
//     setFriends(friends.map(friend =>
//       friend.id === friendId
//         ? { ...friend, note: note }
//         : friend
//     ));
//   };

//   const filteredFriends = friends.filter(friend =>
//     friend.name.toLowerCase().includes(searchFriends.toLowerCase())
//   );

//   const onlineFriends = filteredFriends.filter(f => f.status === 'online');
//   const awayFriends = filteredFriends.filter(f => f.status === 'away');
//   const offlineFriends = filteredFriends.filter(f => f.status === 'offline');

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'online': return 'bg-green-500';
//       case 'away': return 'bg-yellow-500';
//       case 'offline': return 'bg-gray-500';
//       default: return 'bg-gray-500';
//     }
//   };

//   const getGameModeDescription = () => {
//     return selectedMode === 'solo'
//       ? 'Queue up for solo competitive matches'
//       : 'Create or join a team for group play';
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden relative">

//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-bounce"></div>

//         {/* Grid Pattern
//         <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.03"%3E%3Cpath d="M0 0h100v100H0z"/%3E%3Cpath d="M25 0v100M50 0v100M75 0v100M0 25h100M0 50h100M0 75h100"/%3E%3C/g%3E%3C/svg%3E')]"></div> */}
//       </div>

//       {/* Main Container */}
//       <div className="relative z-10 flex h-screen">

//         {/* Left Panel - User Stats & Info */}
//         <div className="w-96 bg-black/30 backdrop-blur-xl border-r border-gray-700/30 flex flex-col">

//           {/* User Profile Section */}
//           <div className="p-6 border-b border-gray-700/30">
//             <div className="flex items-center space-x-4 mb-6">
//               <div className="relative">
//                 <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
//                   <Shield className="w-10 h-10 text-white" />
//                 </div>
//                 <div className="absolute -top-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center">
//                   <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-2xl font-bold text-white">{userStats.username}</h2>
//                 <p className="text-gray-400">Level {userStats.level}</p>
//                 <p className="text-sm text-gray-500">{userStats.currentSeason}</p>
//               </div>
//             </div>

//             {/* XP Progress */}
//             <div className="mb-6">
//               <div className="flex justify-between text-sm mb-2">
//                 <span className="text-gray-300">XP Progress</span>
//                 <span className="text-gray-400">{userStats.currentXP.toLocaleString()} / {userStats.maxXP.toLocaleString()}</span>
//               </div>
//               <div className="w-full bg-gray-800/50 rounded-full h-3 shadow-inner">
//                 <div
//                   className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg"
//                   style={{ width: `${(userStats.currentXP / userStats.maxXP) * 100}%` }}
//                 >
//                   <div className="h-full bg-white/20 rounded-full animate-pulse"></div>
//                 </div>
//               </div>
//             </div>

//             {/* Current Rank */}
//             <div className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl p-4 backdrop-blur-sm border border-gray-600/30">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   <div className="text-3xl">{userStats.rankIcon}</div>
//                   <div>
//                     <p className="font-bold text-yellow-400 text-lg">{userStats.rank}</p>
//                     <p className="text-sm text-gray-400">{userStats.rr} RR</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs text-gray-500">Peak Rank</p>
//                   <p className="text-sm font-semibold text-red-400">{userStats.peakRank}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Detailed Stats */}
//           <div className="flex-1 p-6 overflow-y-auto">
//             <h3 className="text-lg font-bold mb-4 flex items-center text-yellow-400">
//               <Trophy className="w-5 h-5 mr-2" />
//               Career Statistics
//             </h3>

//             {/* Main Stats Grid */}
//             <div className="grid grid-cols-2 gap-3 mb-6">
//               <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 rounded-lg p-4 text-center border border-green-700/30">
//                 <Award className="w-6 h-6 text-green-400 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-green-400">{userStats.winRate}%</p>
//                 <p className="text-xs text-gray-400">Win Rate</p>
//               </div>
//               <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-lg p-4 text-center border border-blue-700/30">
//                 <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-blue-400">{userStats.kd}</p>
//                 <p className="text-xs text-gray-400">K/D Ratio</p>
//               </div>
//               <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-lg p-4 text-center border border-purple-700/30">
//                 <Gamepad2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-purple-400">{userStats.matches}</p>
//                 <p className="text-xs text-gray-400">Matches</p>
//               </div>
//               <div className="bg-gradient-to-br from-red-900/30 to-red-800/30 rounded-lg p-4 text-center border border-red-700/30">
//                 <Zap className="w-6 h-6 text-red-400 mx-auto mb-2" />
//                 <p className="text-2xl font-bold text-red-400">{userStats.headshotPercent}%</p>
//                 <p className="text-xs text-gray-400">Headshot %</p>
//               </div>
//             </div>

//             {/* Recent Matches */}
//             <div className="mb-6">
//               <h4 className="text-md font-semibold mb-3 text-gray-300">Recent Matches</h4>
//               <div className="space-y-2">
//                 {userStats.recentMatches.map((match, index) => (
//                   <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/30">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-3">
//                         <div className={`w-3 h-3 rounded-full ${match.result === 'win' ? 'bg-green-500' : 'bg-red-500'}`}></div>
//                         <div>
//                           <p className="text-sm font-semibold">{match.map}</p>
//                           <p className="text-xs text-gray-400">{match.kda}</p>
//                         </div>
//                       </div>
//                       <div className="text-right">
//                         <p className={`text-sm font-bold ${match.result === 'win' ? 'text-green-400' : 'text-red-400'}`}>
//                           {match.score}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Center Panel - Main Content */}
//         <div className="flex-1 flex flex-col">

//           {/* Enhanced Navigation Bar */}
//           <nav className="bg-black/20 backdrop-blur-xl border-b border-gray-700/30 px-8 py-4 shadow-lg">
//             <div className="flex items-center justify-between">
//               <div className="flex space-x-6">
//                 {navItems.map((item, index) => (
//                   <button
//                     key={index}
//                     className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${item.active
//                       ? 'text-red-400 bg-red-400/10 border border-red-400/30 shadow-lg'
//                       : 'text-gray-400 hover:text-white hover:bg-gray-800/30'
//                       }`}
//                   >
//                     <item.icon className="w-5 h-5" />
//                     <span className="font-semibold text-sm">{item.label}</span>
//                   </button>
//                 ))}
//               </div>

//               <div className="flex items-center space-x-4">
//                 <div className="text-right">
//                   <p className="text-xs text-gray-400">Current Time</p>
//                   <p className="text-sm font-semibold">{currentTime.toLocaleTimeString()}</p>
//                 </div>
//                 <button className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-400/10">
//                   <LogOut className="w-5 h-5" />
//                   <span className="font-semibold">LOGOUT</span>
//                 </button>
//               </div>
//             </div>
//           </nav>

//           {/* Match Mode Toggle Section */}
//           <div className="px-8 py-8">
//             <div className="text-center mb-6">
//               <h2 className="text-2xl font-bold mb-2">Select Game Mode</h2>
//               <p className="text-gray-400">{getGameModeDescription()}</p>
//             </div>

//             <div className="flex justify-center">
//               <div className="relative bg-gray-800/40 rounded-2xl p-2 backdrop-blur-sm border border-gray-700/30 shadow-2xl">
//                 <div
//                   className={`absolute top-2 bottom-2 w-32 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl transition-all duration-500 ease-out shadow-lg ${selectedMode === 'team' ? 'translate-x-32' : 'translate-x-0'
//                     }`}
//                 >
//                   <div className="h-full bg-white/10 rounded-xl"></div>
//                 </div>
//                 <div className="relative flex">
//                   <button
//                     onClick={() => setSelectedMode('solo')}
//                     className={`px-8 py-4 rounded-xl font-bold transition-all duration-500 flex items-center space-x-2 ${selectedMode === 'solo' ? 'text-white transform scale-105' : 'text-gray-400 hover:text-white'
//                       }`}
//                   >
//                     <Users className="w-5 h-5" />
//                     <span>SO LO QUEUE</span>
//                   </button>
//                   <button
//                     onClick={() => setSelectedMode('team')}
//                     className={`px-8 py-4 rounded-xl font-bold transition-all duration-500 flex items-center space-x-2 ${selectedMode === 'team' ? 'text-white transform scale-105' : 'text-gray-400 hover:text-white'
//                       }`}
//                   >
//                     <Users className="w-5 h-5" />
//                     <span>TEAM PLAY</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Enhanced Main Game Card */}
//           <div className="flex-1 px-8 pb-8 flex items-center justify-center">
//             <div className="w-full max-w-6xl">
//               <div className="relative bg-gradient-to-br from-gray-900/80 to-slate-900/80 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/30 backdrop-blur-xl">

//                 {/* 21:9 Aspect Ratio Container */}
//                 <div className="aspect-[21/9] relative">

//                   {/* Dynamic Background */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-red-600/10">
//                     <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" stroke="%23ffffff" stroke-width="0.5" stroke-opacity="0.1"%3E%3Cpath d="M0 0h80v80H0z"/%3E%3Cpath d="M20 0v80M40 0v80M60 0v80M0 20h80M0 40h80M0 60h80"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
//                   {/* Animated Elements */}
//                   <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500/5 rounded-full blur-xl animate-pulse"></div>
//                   <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="absolute inset-0 flex items-center justify-center p-12">
//                   <div className="text-center max-w-2xl">

//                     {/* User Avatar & Info */}
//                     <div className="mb-8">
//                       <div className="relative inline-block mb-6">
//                         <div className="w-32 h-32 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
//                           <Shield className="w-16 h-16 text-white" />
//                         </div>
//                         <div className="absolute -top-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900 flex items-center justify-center">
//                           <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
//                         </div>
//                       </div>

//                       <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
//                         {userStats.username}
//                       </h1>

//                       <div className="flex items-center justify-center space-x-6 mb-6">
//                         <div className="bg-yellow-500/20 px-6 py-3 rounded-xl border border-yellow-500/30 backdrop-blur-sm">
//                           <div className="flex items-center space-x-2">
//                             <span className="text-2xl">{userStats.rankIcon}</span>
//                             <span className="text-yellow-400 font-bold text-xl">{userStats.rank}</span>
//                           </div>
//                         </div>
//                         <div className="text-gray-300 text-2xl">•</div>
//                         <div className="text-gray-300 text-xl font-semibold">{userStats.rr} RR</div>
//                       </div>
//                     </div>

//                     {/* Game Mode Info */}
//                     <div className="mb-8">
//                       <div className="bg-gray-800/30 rounded-xl p-4 backdrop-blur-sm border border-gray-700/30 mb-4">
//                         <p className="text-lg text-gray-300">
//                           Mode: <span className="text-white font-semibold">{selectedMode.toUpperCase()}</span>
//                         </p>
//                         <p className="text-sm text-gray-400 mt-1">{getGameModeDescription()}</p>
//                       </div>
//                     </div>

//                     {/* Start Game Button */}
//                     <button className="group relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 hover:from-red-500 hover:via-red-400 hover:to-orange-400 px-16 py-6 rounded-2xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl border border-red-400/30">
//                       <div className="absolute inset-0 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-colors duration-300"></div>
//                       <span className="relative flex items-center space-x-3">
//                         <Gamepad2 className="w-8 h-8" />
//                         <span>START GAME</span>
//                       </span>
//                     </button>

//                     <p className="text-sm text-gray-400 mt-4">
//                       Estimated queue time: <span className="text-white font-semibold">2-4 minutes</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Panel - Enhanced Social System */}
//       <div className="w-96 bg-black/30 backdrop-blur-xl border-l border-gray-700/30 flex flex-col">

//         {/* Social Header */}
//         <div className="p-4 border-b border-gray-700/30">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-bold flex items-center">
//               <Users className="w-6 h-6 mr-2 text-blue-400" />
//               Social Hub
//             </h3>
//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => setNotifications(!notifications)}
//                 className={`p-2 rounded-lg transition-colors ${notifications ? 'text-green-400 bg-green-400/10' : 'text-gray-400 hover:text-white'}`}
//               >
//                 {notifications ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
//               </button>
//               <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/30">
//                 <Plus className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Friends Counter */}
//           <div className="flex items-center justify-between text-sm mb-4">
//             <span className="text-gray-400">
//               Friends ({onlineFriends.length + awayFriends.length} online, {offlineFriends.length} offline)
//             </span>
//             <span className="text-green-400 font-semibold">{friends.length} total</span>
//           </div>

//           {/* Search Bar */}
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search friends..."
//               value={searchFriends}
//               onChange={(e) => setSearchFriends(e.target.value)}
//               className="w-full bg-gray-800/40 rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-700/30 focus:border-blue-500/50 focus:outline-none backdrop-blur-sm"
//             />
//           </div>
//         </div>

//         {/* Friends List */}
//         <div className="flex-1 overflow-y-auto">

//           {/* Online Friends */}
//           {onlineFriends.length > 0 && (
//             <div className="p-4">
//               <h4 className="text-sm font-semibold text-green-400 mb-3 flex items-center">
//                 <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
//                 ONLINE ({onlineFriends.length})
//               </h4>
//               <div className="space-y-2">
//                 {onlineFriends.map((friend) => (
//                   <div
//                     key={friend.id}
//                     className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/40 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700/30"
//                   >
//                     <div className="relative">
//                       <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center font-bold shadow-lg">
//                         {friend.avatar}
//                       </div>
//                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(friend.status)}`}>
//                         {friend.status === 'online' && <div className="w-2 h-2 bg-white rounded-full animate-pulse mx-auto mt-0.5"></div>}
//                       </div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center space-x-2">
//                         <p className="font-semibold truncate text-white">{friend.name}</p>
//                         {friend.isMuted && <VolumeX className="w-3 h-3 text-gray-500" />}
//                       </div>
//                       <div className="flex items-center space-x-1 text-xs">
//                         <span className="text-gray-400">{friend.rankIcon}</span>
//                         <span className="text-gray-400">{friend.rank}</span>
//                       </div>
//                       <p className="text-xs text-gray-500 truncate">{friend.game}</p>
//                       {friend.note && <p className="text-xs text-blue-400 truncate italic">"{friend.note}"</p>}
//                     </div>
//                     <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setSelectedFriend(friend)}
//                         className="text-gray-400 hover:text-blue-400 p-1"
//                       >
//                         <MessageCircle className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setShowFriendOptions(showFriendOptions === friend.id ? null : friend.id)}
//                         className="text-gray-400 hover:text-white p-1"
//                       >
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>

//                     {/* Friend Options Menu */}
//                     {showFriendOptions === friend.id && (
//                       <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50 min-w-48">
//                         <button
//                           onClick={() => toggleFriendMute(friend.id)}
//                           className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
//                         >
//                           {friend.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
//                           <span>{friend.isMuted ? 'Unmute' : 'Mute'}</span>
//                         </button>
//                         <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2">
//                           <Edit3 className="w-4 h-4" />
//                           <span>Edit Note</span>
//                         </button>
//                         <button
//                           onClick={() => removeFriend(friend.id)}
//                           className="w-full text-left px-3 py-2 rounded hover:bg-red-900 text-red-400 flex items-center space-x-2"
//                         >
//                           <X className="w-4 h-4" />
//                           <span>Remove Friend</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Away Friends */}
//           {awayFriends.length > 0 && (
//             <div className="p-4">
//               <h4 className="text-sm font-semibold text-yellow-400 mb-3 flex items-center">
//                 <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
//                 AWAY ({awayFriends.length})
//               </h4>
//               <div className="space-y-2">
//                 {awayFriends.map((friend) => (
//                   <div
//                     key={friend.id}
//                     className="group relative flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800/40 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-700/30"
//                   >
//                     <div className="relative">
//                       <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center font-bold shadow-lg opacity-75">
//                         {friend.avatar}
//                       </div>
//                       <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getStatusColor(friend.status)}`}></div>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center space-x-2">
//                         <p className="font-semibold truncate text-gray-300">{friend.name}</p>
//                         {friend.isMuted && <VolumeX className="w-3 h-3 text-gray-500" />}
//                       </div>
//                       <div className="flex items-center space-x-1 text-xs">
//                         <span className="text-gray-400">{friend.rankIcon}</span>
//                         <span className="text-gray-400">{friend.rank}</span>
//                       </div>
//                       <p className="text-xs text-gray-500 truncate">{friend.game}</p>
//                       {friend.note && <p className="text-xs text-blue-400 truncate italic">"{friend.note}"</p>}
//                     </div>
//                     <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                       <button
//                         onClick={() => setSelectedFriend(friend)}
//                         className="text-gray-400 hover:text-blue-400 p-1"
//                       >
//                         <MessageCircle className="w-4 h-4" />
//                       </button>
//                       <button
//                         onClick={() => setShowFriendOptions(showFriendOptions === friend.id ? null : friend.id)}
//                         className="text-gray-400 hover:text-white p-1"
//                       >
//                         <MoreVertical className="w-4 h-4" />
//                       </button>
//                     </div>

//                     {/* Friend Options Menu */}
//                     {showFriendOptions === friend.id && (
//                       <div className="absolute right-0 top-full mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-2 z-50 min-w-48">
//                         <button
//                           onClick={() => toggleFriendMute(friend.id)}
//                           className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2"
//                         >
//                           {friend.isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
//                           <span>{friend.isMuted ? 'Unmute' : 'Mute'}</span>
//                         </button>
//                         <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 flex items-center space-x-2">
//                           <Edit3 className="w-4 h-4" />
//                           <span>Edit Note</span>
//                         </button>
//                         <button
//                           onClick={() => removeFriend(friend.id)}
//                           className="w-full text-left px-3 py-2 rounded hover:bg-red-900 text-red-400 flex items-center space-x-2"
//                         >
//                           <User X className="w-4 h-4" />
//                           <span>Remove Friend</span>
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }