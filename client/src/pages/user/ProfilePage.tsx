import React, { useState } from 'react';
import useDeviceOrientation from '@/hooks/useDeviceOrientation';
import RotateDeviceMessage from '@/components/common/RotateDeviceMessage';
import Sidebar from '@/components/user/profile/Sidebar';
import SecuritySection from '@/components/user/profile/SecuritySection';
import RewardsSection from '@/components/user/profile/RewardsSection';
import MatchHistorySection from '@/components/user/profile/MatchHistorySection';


const ProfilePage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<'security' | 'rewards' | 'history' | 'payment'>('security');

    const { shouldShowRotateMessage } = useDeviceOrientation();

    return (
        <div className="min-h-screen relative">

            {shouldShowRotateMessage && <RotateDeviceMessage />}

            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-900 to-black"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-cyan-900/10"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
            </div>

            {/* Layout */}
            <div className="relative z-10 flex h-screen">
                {/* Sidebar */}
                <div className="w-80bg-gradient-to-b from-purple-900/40 to-black/60 backdrop-blur-xl border-r border-purple-700/50 flex-shrink-0">
                    <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} />
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-auto">
                    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
                        {activeSection === 'security' && <SecuritySection />}
                        {activeSection === 'rewards' && <RewardsSection />}
                        {activeSection === 'history' && <MatchHistorySection />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;