// src/pages/ForgotPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import ForgotPasswordForm from '../../components/_auth/ForgotPasswordForm';
import {
  Code,
  Target,
  Trophy,
  Users,
  Sword,
  Zap,
  UserPlus,
  AlertCircle,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showNoUserModal, setShowNoUserModal] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleRegisterRedirect = () => {
    setShowNoUserModal(false);
    navigate('/signup');
  };

  const handleCloseModal = () => {
    setShowNoUserModal(false);
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-purple-900 to-black"></div>

        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-10 opacity-20">
            {[...Array(80)].map((_, i) => (
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

      {/* Main Content */}
      <div className="relative z-10 h-full flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-6 xl:p-12">
          <div className={`
            text-center transform transition-all duration-1000 delay-300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-4 xl:p-6 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full">
                  <Sword className="w-12 h-12 xl:w-16 xl:h-16 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 xl:-top-2 xl:-right-2 w-4 h-4 xl:w-6 xl:h-6 bg-purple-300 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Brand Title */}
            <h1 className="text-4xl xl:text-6xl font-black mb-4 xl:mb-6 bg-gradient-to-r from-purple-400 via-purple-300 to-white bg-clip-text text-transparent">
              CODE<span className="text-purple-500">BATTLE</span>
            </h1>
            <p className="text-lg xl:text-2xl text-gray-300 font-light mb-6 xl:mb-8">
              Where Code Meets Combat
            </p>

            {/* Features List */}
            <div className="space-y-3 xl:space-y-4 max-w-md mx-auto">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                  <Zap className="w-4 h-4 xl:w-5 xl:h-5 text-purple-400" />
                </div>
                <span className="text-sm xl:text-base">Real-time competitive coding</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                  <Trophy className="w-4 h-4 xl:w-5 xl:h-5 text-purple-400" />
                </div>
                <span className="text-sm xl:text-base">Weekly tournaments & rewards</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="p-2 bg-purple-900/50 rounded-lg">
                  <Users className="w-4 h-4 xl:w-5 xl:h-5 text-purple-400" />
                </div>
                <span className="text-sm xl:text-base">Global leaderboards</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6 lg:p-8">
          <div className={`
            w-full max-w-md transform transition-all duration-1000 delay-500
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            {/* Glass Morphism Container */}
            <div className="backdrop-blur-xl bg-black/40 border border-purple-800/50 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-500/10">
              <ForgotPasswordForm setShowNoUserModal={setShowNoUserModal} email={email} setEmail={setEmail}/>
            </div>

            {/* Mobile Branding */}
            <div className="lg:hidden text-center mt-4 md:mt-6">
              <div className="flex justify-center items-center gap-2 mb-2">
                <Sword className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                  CODE<span className="text-purple-500">BATTLE</span>
                </span>
              </div>
              <p className="text-gray-400 text-xs md:text-sm">Secure password recovery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-16 md:h-32 bg-gradient-to-t from-purple-900/20 to-transparent pointer-events-none"></div>


      {showNoUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-purple-800/50 rounded-xl p-6 max-w-md w-full mx-4 animate-in fade-in duration-300 slide-in-from-bottom-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Account Not Found</h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="mb-6">
              <p className="text-gray-300 mb-2">
                We couldn't find this account associated with <span className="text-purple-400 font-medium">{email}</span>
              </p>
              <p className="text-gray-400 text-sm">
                Would you like to create a new account with this email address?
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRegisterRedirect}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Register New Account
              </button>
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;