import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import {
    Zap,
    Trophy,
    Users,
    Mic,
    ShoppingCart,
    Code,
    Star,
    ChevronRight,
    Sword,
    Target,
    ChevronsDown
} from 'lucide-react';



const landingPage = () => {
    // const [email, setEmail] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    // const [token, setToken] = useState(null)


    const toHome = () => {
        navigate('/home');
    };

    useEffect(() => {
        // checkAuth();
        setIsVisible(true);

    }, []);

    // const checkAuth = ()=>{
    //     try {
    //         const token   = localStorage.getItem('jwt_token');

    //         if(token){
    //             const payload = JSON.parse(atob(token.split(" ")[1]));
    //             const isExpired = payload.exp * 1000 < Date.now();

    //             if(!isExpired){
                    
    //             }
    //         }
    //     } catch (error) {
            
    //     }
    // }


    const scrollToFeatures = () => {
        const section = document.getElementById('features');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const features = [
        {
            icon: <Sword className="w-8 h-8" />,
            title: "1v1 Code Duels",
            description: "Face off in intense coding battles with real-time syntax highlighting and execution"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Team Battles",
            description: "Form squads for 3v3 and 5v5 collaborative coding challenges"
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Survival Tournaments",
            description: "Compete in weekly tournaments with massive XP rewards and exclusive prizes"
        },
        {
            icon: <Mic className="w-8 h-8" />,
            title: "Voice & Text Chat",
            description: "Coordinate with teammates using integrated communication tools"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "XP & Rewards",
            description: "Level up your profile and earn coins for every victory and achievement"
        },
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            title: "Black Market",
            description: "Purchase exclusive themes, effects, and power-ups to dominate battles"
        }
    ];

    const leaderboard = [
        { rank: 1, name: "CodeNinja", xp: 15420, badge: "🏆" },
        { rank: 2, name: "ByteMaster", xp: 14850, badge: "🥈" },
        { rank: 3, name: "AlgoWizard", xp: 13990, badge: "🥉" },
        { rank: 4, name: "DevStorm", xp: 12750, badge: "⚡" },
        { rank: 5, name: "CodePhoenix", xp: 11200, badge: "🔥" }
    ];

    const testimonials = [
        {
            name: "Alex Chen",
            role: "Senior Developer",
            quote: "CodeBattle transformed how I practice algorithms. The competitive element keeps me sharp!",
            avatar: "AC"
        },
        {
            name: "Sarah Kim",
            role: "Full Stack Engineer",
            quote: "Best way to improve coding skills while having fun. The team battles are incredibly addictive!",
            avatar: "SK"
        },
        {
            name: "Mike Rodriguez",
            role: "Tech Lead",
            quote: "Our entire team uses CodeBattle for skill development. It's like esports for programmers!",
            avatar: "MR"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-purple-900 to-black">
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

                <div className={`relative z-10 text-center px-4 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="mb-8">
                        <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-purple-400 via-purple-300 to-white bg-clip-text text-transparent animate-pulse">
                            CODE<span className="text-purple-500">BATTLE</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 font-light tracking-wide">
                            Where Code Meets Combat
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <button
                            onClick={toHome}
                            className="group px-8 py-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded-lg font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 border border-purple-500"
                        >
                            <span className="flex items-center gap-2">
                                <Sword className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                Join Battle
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        <button onClick={scrollToFeatures} className="group px-8 py-4 bg-gray-900 border border-purple-800 rounded-lg font-bold text-lg transition-all duration-300 hover:bg-gray-800 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-400/30">
                            <span className="flex items-center gap-2">
                                <ChevronsDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                LEARN MORE
                            </span>
                        </button>
                    </div>
                </div>

                {/* Floating Code Elements */}
                <div className="absolute top-20 left-10 opacity-30">
                    <div className="animate-bounce">
                        <Code className="w-12 h-12 text-purple-400" />
                    </div>
                </div>
                <div className="absolute bottom-20 right-10 opacity-30">
                    <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                        <Target className="w-10 h-10 text-purple-300" />
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id='features' className="py-20 bg-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                        Battle Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 bg-gray-900 rounded-xl border border-purple-900 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2"
                            >
                                <div className="text-purple-400 mb-4 group-hover:text-purple-300 transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-200 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Gameplay Preview */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                        Gameplay Preview
                    </h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Code Editor Mockup */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-purple-900 hover:border-purple-500 transition-all duration-300">
                            <h3 className="text-xl font-bold mb-4 text-purple-400">Real-time Code Editor</h3>
                            <div className="bg-black rounded-lg p-4 font-mono text-sm">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="ml-2 text-gray-400">battle.js</span>
                                </div>
                                <div className="space-y-1 font-mono text-sm">
                                    <div className="text-purple-400">
                                        function <span className="text-yellow-400">fibonacci</span>(<span className="text-blue-400">n</span>):
                                    </div>
                                    <div className="text-gray-300 ml-4">if (<span className="text-blue-400">n</span> &lt;= 1) &#123;</div>
                                    <div className="text-gray-300 ml-8">return <span className="text-blue-400">n</span>;</div>
                                    <div className="text-gray-300 ml-4">&#125; else &#123;</div>
                                    <div className="text-gray-300 ml-8">
                                        return <span className="text-yellow-400">fibonacci</span>(n - 1) + <span className="text-yellow-400">fibonacci</span>(n - 2);
                                    </div>
                                    <div className="text-gray-300 ml-4">&#125;</div>
                                    <div className="text-green-400 animate-pulse mt-2">▶ Running tests... 3/3 passed</div>
                                </div>

                            </div>
                        </div>

                        {/* Matchmaking Interface */}
                        <div className="bg-gray-900 rounded-xl p-6 border border-purple-900 hover:border-purple-500 transition-all duration-300">
                            <h3 className="text-xl font-bold mb-4 text-purple-400">Matchmaking</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                    <span className="text-white font-semibold">1v1 Quick Match</span>
                                    <div className="animate-spin w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"></div>
                                </div>
                                <div className="p-3 bg-purple-950/80 rounded-lg border border-purple-600">
                                    <div className="text-purple-300 text-sm mb-2">Opponent Found!</div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center font-bold">
                                            JX
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold">JavaXpert</div>
                                            <div className="text-gray-400 text-sm">Rank: Gold III</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leaderboard Teaser */}
            <section className="py-20 bg-gray-900">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                        Global Leaderboard
                    </h2>

                    <div className="max-w-2xl mx-auto bg-black rounded-xl border border-purple-900 overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-700 to-purple-600 p-4">
                            <h3 className="text-xl font-bold text-center">Top Coders This Season</h3>
                        </div>
                        <div className="p-6">
                            {leaderboard.map((player, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between py-3 border-b border-purple-900 last:border-b-0 hover:bg-gray-800 transition-colors rounded"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-center font-bold text-sm">
                                            #{player.rank}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">{player.name}</div>
                                            <div className="text-gray-400 text-sm">{player.xp.toLocaleString()} XP</div>
                                        </div>
                                    </div>
                                    <div className="text-2xl">{player.badge}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                        What Developers Say
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-gray-900 rounded-xl p-6 border border-purple-900 hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full flex items-center justify-center font-bold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.name}</div>
                                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                                <div className="flex text-purple-400 mt-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-current" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default landingPage;