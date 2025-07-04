import React , { useState, useEffect } from 'react';
import {
    Home,
    Code,
    Target,
    Zap,
    AlertTriangle,
    ArrowLeft,
    Sword,
    Bug
} from 'lucide-react';

const NotFoundPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [glitchText, setGlitchText] = useState('404');

    useEffect(() => {
        setIsVisible(true);

        // Glitch effect for 404 text
        const glitchInterval = setInterval(() => {
            const glitchChars = ['4', '0', '4', '@', '#', '$', '%', '&'];
            const glitched = Array.from('404').map(() =>
                Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : '404'[Math.floor(Math.random() * 3)]
            ).join('');
            setGlitchText(glitched);

            setTimeout(() => setGlitchText('404'), 100);
        }, 2000);

        return () => clearInterval(glitchInterval);
    }, []);

    const goBack = () => {
        window.history.back();
    };

    const goHome = () => {
        // Replace with your actual home route
        window.location.href = '/';
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-20">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        >
                            <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-black">
                <div className={`text-center px-4 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    {/* Cartoon Robot Character */}
                    <div className="mb-12 relative">
                        <div className="inline-block relative">
                            {/* Robot Body */}
                            <div className="relative mx-auto w-48 h-48">
                                {/* Head */}
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-20 bg-gradient-to-b from-gray-600 to-gray-700 rounded-t-xl border-2 border-purple-400">
                                    {/* Eyes */}
                                    <div className="flex justify-center items-center h-full gap-2">
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                    </div>
                                    {/* Antenna */}
                                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-purple-400 rounded-full">
                                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-300 rounded-full animate-bounce"></div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-32 h-24 bg-gradient-to-b from-gray-700 to-gray-800 rounded-lg border-2 border-purple-400">
                                    {/* Screen */}
                                    <div className="mt-3 mx-auto w-20 h-12 bg-black rounded border border-purple-300 flex items-center justify-center">
                                        <div className="text-red-400 text-xs font-mono animate-blink">ERROR</div>
                                    </div>
                                    {/* Buttons */}
                                    <div className="flex justify-center gap-2 mt-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                    </div>
                                </div>

                                {/* Arms */}
                                <div className="absolute top-20 -left-6 w-8 h-3 bg-gray-600 rounded-full border border-purple-400 transform rotate-12"></div>
                                <div className="absolute top-20 -right-6 w-8 h-3 bg-gray-600 rounded-full border border-purple-400 transform -rotate-12"></div>

                                {/* Legs */}
                                <div className="absolute bottom-8 left-8 w-4 h-16 bg-gray-600 rounded-full border border-purple-400"></div>
                                <div className="absolute bottom-8 right-8 w-4 h-16 bg-gray-600 rounded-full border border-purple-400"></div>

                                {/* Feet */}
                                <div className="absolute bottom-2 left-6 w-8 h-4 bg-gray-700 rounded-full border border-purple-300"></div>
                                <div className="absolute bottom-2 right-6 w-8 h-4 bg-gray-700 rounded-full border border-purple-300"></div>
                            </div>

                            {/* Floating Bug Icons */}
                            <Bug className="absolute -top-4 -left-4 w-6 h-6 text-red-400 animate-bounce" />
                            <Bug className="absolute top-8 -right-8 w-4 h-4 text-red-300 animate-bounce" style={{ animationDelay: '1s' }} />
                            <Bug className="absolute bottom-4 -left-6 w-5 h-5 text-red-500 animate-bounce" style={{ animationDelay: '0.5s' }} />
                        </div>
                    </div>

                    {/* 404 Title */}
                    <div className="mb-8">
                        <h1 className="text-8xl md:text-9xl font-black mb-4 bg-gradient-to-r from-red-500 via-purple-400 to-purple-300 bg-clip-text text-transparent font-mono">
                            {glitchText}
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-purple-400">
                            CODE NOT FOUND
                        </h2>
                        <p className="text-lg md:text-xl text-gray-300 font-light tracking-wide max-w-md mx-auto">
                            Looks like our battle bot couldn't locate the page you're looking for.
                            The code has vanished into the digital void!
                        </p>
                    </div>

                    {/* Error Messages */}
                    <div className="mb-8 bg-gray-900 rounded-lg p-4 border border-red-500/50 max-w-md mx-auto">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                            <span className="text-red-400 font-semibold">System Alert</span>
                        </div>
                        <div className="font-mono text-sm text-left space-y-1">
                            <div className="text-gray-400">
                                <span className="text-red-400">×</span> Page.exe has stopped working
                            </div>
                            <div className="text-gray-400">
                                <span className="text-red-400">×</span> Route not found in battle arena
                            </div>
                            <div className="text-gray-400">
                                <span className="text-red-400">×</span> Connection to reality lost
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={goHome}
                            className="group px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 border border-purple-500"
                        >
                            <span className="flex items-center gap-2">
                                <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                Return to Base
                            </span>
                        </button>
                        <button
                            onClick={goBack}
                            className="group px-8 py-4 bg-gray-900 border border-purple-800 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-gray-800 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/30"
                        >
                            <span className="flex items-center gap-2">
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                Go Back
                            </span>
                        </button>
                    </div>
                </div>

                {/* Floating Code Elements */}
                <div className="absolute top-20 left-10 opacity-30">
                    <div className="animate-bounce">
                        <Code className="w-12 h-12 text-red-400" />
                    </div>
                </div>
                <div className="absolute bottom-20 right-10 opacity-30">
                    <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                        <Target className="w-10 h-10 text-purple-300" />
                    </div>
                </div>
                <div className="absolute top-1/2 left-5 opacity-20">
                    <div className="animate-spin" style={{ animationDuration: '8s' }}>
                        <Zap className="w-8 h-8 text-yellow-400" />
                    </div>
                </div>
                <div className="absolute top-32 right-20 opacity-25">
                    <div className="animate-pulse">
                        <Sword className="w-14 h-14 text-purple-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;

// blink style is on css