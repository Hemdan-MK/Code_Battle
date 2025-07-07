import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import RotateDeviceMessage from '@/components/common/RotateDeviceMessage';
import FriendsList from '@/components/home/FriendsList';
import GameModeSelection from '@/components/home/GameModeSelection';
import ProfileOverview from '@/components/home/ProfileOverview';


const HomePage = () => {
  const { shouldShowRotateMessage } = useDeviceOrientation();

  if (shouldShowRotateMessage) {
    return <RotateDeviceMessage />;
  }

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-cyan-900/10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex relative z-10">
        {/* Left Side - Profile Overview */}
        <div className="w-80 flex-shrink-0">
          <ProfileOverview />
        </div>

        {/* Center - Game Mode Selection */}
        <div className="flex-1 flex items-center justify-center p-8">
          <GameModeSelection />
        </div>

        {/* Right Side - Friends List */}
        <div className="w-80 flex-shrink-0 relative ">
          <FriendsList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;