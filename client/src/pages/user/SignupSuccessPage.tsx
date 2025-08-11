// src/pages/SignUpSuccessPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckCircle,
  Trophy,
  Sword,
  Crown,
  Users,
  Target,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
  Gift
} from 'lucide-react';

const SignUpSuccessPage: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user data from previous page - corrected to match the state structure
  const { username, message } = location.state || {};
  const displayUsername = username || 'Warrior';

  useEffect(() => {
    // Trigger animations
    setIsVisible(true);
    setTimeout(() => setShowConfetti(true), 500);

    // Auto redirect countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/home');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleGetStarted = () => {
    navigate('/home');
  };

  return (
    <div className="h-screen bg-black text-white overflow-hidden relative">
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

        {/* Success Celebration Particles */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute animate-bounce"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${10 + Math.random() * 80}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              >
                <Star className="w-2 h-2 md:w-3 md:h-3 text-yellow-400 opacity-70" />
              </div>
            ))}
          </div>
        )}

        {/* Floating Achievement Icons */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="animate-bounce">
            <Trophy className="w-12 h-12 md:w-20 md:h-20 text-yellow-400" />
          </div>
        </div>
        <div className="absolute top-32 right-16 opacity-15">
          <div className="animate-bounce" style={{ animationDelay: '0.5s' }}>
            <Crown className="w-8 h-8 md:w-16 md:h-16 text-purple-300" />
          </div>
        </div>
        <div className="absolute bottom-32 left-16 opacity-15">
          <div className="animate-bounce" style={{ animationDelay: '1s' }}>
            <Shield className="w-10 h-10 md:w-18 md:h-18 text-purple-500" />
          </div>
        </div>
        <div className="absolute bottom-20 right-12 opacity-20">
          <div className="animate-bounce" style={{ animationDelay: '1.5s' }}>
            <Gift className="w-8 h-8 md:w-12 md:h-12 text-purple-300" />
          </div>
        </div>

        {/* Large Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-40 h-40 md:w-80 md:h-80 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 md:w-120 md:h-120 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-4 md:p-6">
        <div className={`
          text-center transform transition-all duration-1000 delay-300 max-w-4xl mx-auto
          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
        `}>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className={`
                p-6 md:p-8 bg-gradient-to-r from-green-700 to-green-400 rounded-full
                transform transition-all duration-1000 delay-500
                ${isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
              `}>
                <CheckCircle className="w-16 h-16 md:w-24 md:h-24 text-white" />
              </div>
              
              {/* Animated Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping"></div>
              <div className="absolute -top-2 -right-2 md:-top-3 md:-right-3">
                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Success Message */}
          <div className={`
            transform transition-all duration-1000 delay-700
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6">
              <span className="bg-gradient-to-r from-green-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent">
                WELCOME TO THE
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-purple-300 to-white bg-clip-text text-transparent">
                BATTLE<span className="text-purple-500">FIELD</span>!
              </span>
            </h1>
            
            <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
              <Sword className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
              <p className="text-xl md:text-3xl text-gray-300 font-light">
                Warrior <span className="text-purple-400 font-bold">{displayUsername}</span> has joined the arena!
              </p>
              <Sword className="w-6 h-6 md:w-8 md:h-8 text-purple-400 transform scale-x-[-1]" />
            </div>

            <p className="text-gray-400 text-base md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
              {message || 'Your account has been successfully created and verified.'} 
              Get ready to compete with the world's best coders and claim your victory!
            </p>
          </div>

          {/* Achievement Cards */}
          <div className={`
            grid md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12 max-w-4xl mx-auto
            transform transition-all duration-1000 delay-900
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <div className="backdrop-blur-xl bg-purple-900/20 border border-purple-800/50 rounded-xl p-4 md:p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Welcome Bonus</h3>
              <p className="text-gray-400 text-sm md:text-base">100 XP + Starter Badge</p>
            </div>

            <div className="backdrop-blur-xl bg-purple-900/20 border border-purple-800/50 rounded-xl p-4 md:p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Target className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">First Challenge</h3>
              <p className="text-gray-400 text-sm md:text-base">Ready & Waiting</p>
            </div>

            <div className="backdrop-blur-xl bg-purple-900/20 border border-purple-800/50 rounded-xl p-4 md:p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-center mb-3">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">Community</h3>
              <p className="text-gray-400 text-sm md:text-base">10,000+ Warriors</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`
            flex flex-col sm:flex-row gap-4 justify-center items-center mb-8
            transform transition-all duration-1000 delay-1100
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <button
              onClick={handleGetStarted}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 hover:shadow-lg hover:shadow-purple-500/30"
            >
              <Sword className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Enter the Arena
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Auto Redirect Info */}
          <div className={`
            text-center transform transition-all duration-1000 delay-1300
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
          `}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-purple-800/30 rounded-full text-sm text-gray-400">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              Redirecting to dashboard in {countdown}s
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Celebration Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-32 md:h-48 bg-gradient-to-t from-purple-900/30 via-green-900/10 to-transparent pointer-events-none"></div>

      {/* Floating Success Indicators */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
        <div className="animate-bounce" style={{ animationDelay: '2s' }}>
          <div className="flex flex-col items-center gap-2 opacity-30">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <div className="text-xs text-gray-500">Verified</div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
        <div className="animate-bounce" style={{ animationDelay: '2.5s' }}>
          <div className="flex flex-col items-center gap-2 opacity-30">
            <Shield className="w-6 h-6 text-purple-400" />
            <div className="text-xs text-gray-500">Secured</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpSuccessPage;