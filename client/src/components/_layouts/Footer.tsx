// src/components/_layouts/Footer.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Github,
    Twitter,
    Hash,
    Mail,
    Sword,
    Users,
    Trophy,
    Code,
    Target,
    ChevronRight,
    Heart,
    Zap
} from 'lucide-react';

const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const location = useLocation();

    // Only show footer on home route
    if (!(location.pathname === '/')) {
        return null;
    }

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setIsSubscribed(true);
            setTimeout(() => setIsSubscribed(false), 3000);
            setEmail('');
        }
    };

    return (
        <footer className="relative bg-gradient-to-r from-purple-950 via-purple-900 to-black text-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-10">
                    {[...Array(30)].map((_, i) => (
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

                {/* Floating Icons */}
                <div className="absolute top-20 left-10 opacity-20">
                    <div className="animate-bounce">
                        <Code className="w-8 h-8 text-purple-400" />
                    </div>
                </div>
                <div className="absolute bottom-40 right-20 opacity-20">
                    <div className="animate-bounce" style={{ animationDelay: '1s' }}>
                        <Target className="w-6 h-6 text-purple-300" />
                    </div>
                </div>
            </div>

            <div className="relative z-10">
                {/* Newsletter Section */}
                <div className="py-16 bg-gradient-to-b from-transparent to-black/20">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
                            Stay Updated on New Battles
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Get notified about tournaments, new features, and exclusive rewards. Join the community of elite coders.
                        </p>

                        <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
                            <div className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your battle email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-gray-900 border border-purple-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="group px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-bold hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/30"
                                >
                                    {isSubscribed ? (
                                        <span className="flex items-center gap-2">
                                            <Heart className="w-4 h-4 fill-current" />
                                            Joined!
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Join
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Social Links */}
                        <div className="flex justify-center gap-6">
                            <a
                                href="#"
                                className="group p-3 bg-gray-900/50 rounded-full border border-purple-800 hover:border-purple-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-400/30"
                                aria-label="GitHub"
                            >
                                <Github className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="group p-3 bg-gray-900/50 rounded-full border border-purple-800 hover:border-purple-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-400/30"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            </a>
                            <a
                                href="#"
                                className="group p-3 bg-gray-900/50 rounded-full border border-purple-800 hover:border-purple-400 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-purple-400/30"
                                aria-label="Discord"
                            >
                                <Hash className="w-6 h-6 text-gray-400 group-hover:text-purple-400 transition-colors" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="py-12 bg-black/40">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Brand Section */}
                            <div className="md:col-span-1">
                                <Link to="/" className="flex items-center gap-2 mb-4">
                                    <div className="relative">
                                        <Sword className="w-8 h-8 text-purple-400" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <span className="font-black text-2xl bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                                        CODE<span className="text-purple-500">BATTLE</span>
                                    </span>
                                </Link>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Where Code Meets Combat. The ultimate platform for competitive programming and skill development.
                                </p>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-purple-400" />
                                    Quick Battle
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link to="/battles" className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1">
                                            <Sword className="w-3 h-3" />
                                            1v1 Battles
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/tournaments" className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1">
                                            <Trophy className="w-3 h-3" />
                                            Tournaments
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/practice" className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1">
                                            <Target className="w-3 h-3" />
                                            Practice Mode
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/leaderboard" className="text-gray-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            Leaderboard
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Community */}
                            <div>
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-purple-400" />
                                    Community
                                </h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link to="/discord" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Discord Server
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/forums" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Forums
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/blog" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/help" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Help Center
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {/* Legal */}
                            <div>
                                <h3 className="text-white font-bold mb-4">Legal</h3>
                                <ul className="space-y-2">
                                    <li>
                                        <Link to="/privacy" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/terms" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Terms of Service
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/cookies" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Cookie Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/contact" className="text-gray-400 hover:text-purple-300 transition-colors text-sm">
                                            Contact Us
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 bg-black/60 border-t border-purple-900/50">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="text-gray-400 text-sm">
                                © {new Date().getFullYear()} CodeBattle. All rights reserved. Made with{' '}
                                <Heart className="w-3 h-3 inline-block mx-1 text-purple-400 fill-current" />{' '}
                                by Hemdan, for developers.
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                    All systems operational
                                </span>
                                <span>v1.0.0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;