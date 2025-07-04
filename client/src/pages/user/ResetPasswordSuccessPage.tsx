// src/pages/ResetPasswordSuccessPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Shield, 
  ChevronRight,
  LogIn,
  Code,
  Target,
  Trophy,
  Users,
  Sparkles,
  Lock
} from 'lucide-react';

const ResetPasswordSuccessPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(100);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from previous page state
  const email = location.state?.email || '';

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      navigate('/login');
    }
  }, [countdown, navigate]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  const maskEmail = (email: string) => {
    if (!email) return 'your account';
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 ">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-950 via-purple-950 to-black"></div>
        
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
                <div className={`w-1 h-1 rounded-full ${
                  Math.random() > 0.5 ? 'bg-green-400' : 'bg-purple-400'
                }`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Confetti Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-green-400" />
            </div>
          ))}
        </div>

        {/* Floating Elements */}
        <div className="absolute top-16 left-4 md:top-20 md:left-10 opacity-20">
          <div className="animate-bounce">
            <Code className="w-8 h-8 md:w-16 md:h-16 text-green-400" />
          </div>
        </div>
        <div className="absolute top-32 right-4 md:top-40 md:right-20 opacity-15">
          <div className="animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Target className="w-6 h-6 md:w-12 md:h-12 text-purple-300" />
          </div>
        </div>
        <div className="absolute bottom-32 left-4 md:bottom-40 md:left-20 opacity-15">
          <div className="animate-bounce" style={{ animationDelay: '1s' }}>
            <Trophy className="w-8 h-8 md:w-14 md:h-14 text-green-500" />
          </div>
        </div>
        <div className="absolute bottom-16 right-4 md:bottom-20 md:right-10 opacity-20">
          <div className="animate-bounce" style={{ animationDelay: '1.5s' }}>
            <Users className="w-6 h-6 md:w-10 md:h-10 text-purple-300" />
          </div>
        </div>

        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 md:w-64 md:h-64 bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4 md:p-6 lg:p-8 scale-75">
        <div className={`
          w-full max-w-2xl text-center transform transition-all duration-1000 delay-300
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          {/* Glass Morphism Container */}
          <div className="backdrop-blur-xl bg-black/40 border border-green-800/50 rounded-3xl p-8 md:p-12 shadow-2xl shadow-green-500/10">
            
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="p-6 md:p-8 bg-gradient-to-r from-green-600 to-green-500 rounded-full animate-pulse">
                  <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 bg-green-300 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 md:w-6 md:h-6 bg-green-400 rounded-full animate-bounce"></div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 bg-gradient-to-r from-green-400 via-green-300 to-white bg-clip-text text-transparent">
              PASSWORD RESET
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-6 md:mb-8">
              Successfully Updated!
            </h2>

            <p className="text-lg md:text-xl text-gray-300 mb-2">
              Your password has been securely updated for
            </p>
            <p className="text-green-300 font-semibold text-lg md:text-xl mb-8 md:mb-10">
              {maskEmail(email)}
            </p>

            {/* Security Features */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
              <div className="p-4 bg-green-900/20 rounded-xl border border-green-800/30">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Encrypted</h3>
                <p className="text-xs md:text-sm text-gray-400">Password safely encrypted</p>
              </div>
              <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-800/30">
                <Lock className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Secured</h3>
                <p className="text-xs md:text-sm text-gray-400">Account fully protected</p>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-800/30">
                <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold text-white mb-1">Ready</h3>
                <p className="text-xs md:text-sm text-gray-400">Ready to code & battle</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 md:space-y-0 md:flex md:gap-4 md:justify-center">
              <button
                onClick={handleLoginRedirect}
                className="group w-full md:w-auto py-3 md:py-4 px-6 md:px-8 rounded-xl font-bold text-lg bg-gradient-to-r from-green-600 to-green-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
                <span>Login Now</span>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              
              
            </div>

            {/* Auto Redirect Notice */}
            <div className="mt-8 md:mt-10 p-4 bg-gray-900/30 rounded-lg border border-gray-700/50">
              <p className="text-gray-400 text-sm md:text-base">
                Automatically redirecting to login in{' '}
                <span className="font-bold text-green-400 text-lg">{countdown}</span> seconds
              </p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - countdown) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 md:mt-8 text-center">
              <p className="text-gray-500 text-xs md:text-sm">
                Keep your login credentials safe. Need help?{' '}
                <Link
                  to="/contact-support"
                  className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </div>

          {/* Brand Footer */}
          <div className="mt-6 md:mt-8 flex justify-center items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg">
              <Code className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-bold text-xl md:text-2xl bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
              CODE<span className="text-green-400">BATTLE</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-16 md:h-32 bg-gradient-to-t from-green-900/20 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ResetPasswordSuccessPage;