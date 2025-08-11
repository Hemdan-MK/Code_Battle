// src/components/_layouts/Header.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sword, Users, Menu, X, Zap, User, LogOut } from "lucide-react";
import { getToken } from "@/utils/tokenUtils";

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Check if current route is home
    const isLandingPage = location.pathname === "/";
    const isProfilePage = location.pathname === '/profile'
    console.log("isLandingPage ", isLandingPage);
    console.log("isProfilePage ", isProfilePage);


    useEffect(() => {
        setIsVisible(true);

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        // Check for user token in localStorage
        const checkAuth = async () => {
            const token = await getToken()
            setIsAuthenticated(!!token);
        };

        // Check auth on component mount
        checkAuth();

        // Listen for storage changes (in case user logs in/out in another tab)
        window.addEventListener('storage', checkAuth);
        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('userToken');
        localStorage.removeItem('authToken');

        // Update auth state
        setIsAuthenticated(false);

        // Close mobile menu if open
        setIsMobileMenuOpen(false);

        // Navigate to home page
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
            {/* Dynamic Island Container */}
            <div
                className={`
        mx-auto max-w-6xl transition-all duration-500 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
      `}
            >
                {/* Dynamic Island Navbar */}
                <nav
                    className={`
          relative backdrop-blur-xl border transition-all duration-500 ease-out
          ${isScrolled
                            ? "bg-black/80 border-purple-500/30 shadow-2xl shadow-purple-500/20"
                            : "bg-black/60 border-purple-800/50"
                        }
          rounded-full px-6 py-3
        `}
                >
                    {/* Main Navigation Content */}
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors duration-300"
                        >
                            <div className="relative">
                                <Sword className="w-7 h-7 text-purple-400" />
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                            </div>
                            <span className="font-black text-xl bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                                CODE<span className="text-purple-500">BATTLE</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            <Link
                                to="/battles"
                                className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-purple-900/50 transition-all duration-300"
                            >
                                <Sword className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span className="font-medium">Battles</span>
                            </Link>

                            <Link
                                to="/leaderboard"
                                className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-purple-900/50 transition-all duration-300"
                            >
                                <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <span className="font-medium">Leaderboard</span>
                            </Link>
                        </div>

                        {/* Action Buttons */}
                        <div className="hidden md:flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    {isProfilePage ? (
                                        <Link
                                            to="/home"
                                            className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                        >
                                            <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Home</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            to="/profile"
                                            className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                        >
                                            <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            <span className="font-medium">Profile</span>
                                        </Link>
                                    )}
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="group flex items-center gap-2 px-4 py-2 rounded-full text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                >
                                    <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="font-medium">Login</span>
                                </Link>
                            )}

                            {isLandingPage && (
                                <Link
                                    to="/play"
                                    className="group flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full text-white font-bold hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300"
                                >
                                    <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                    <span>Play Now</span>
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-full text-gray-300 hover:text-white hover:bg-purple-900/50 transition-all duration-300"
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    <div
                        className={`
            md:hidden absolute top-full left-0 right-0 mt-2 
            bg-black/95 backdrop-blur-xl border border-purple-800/50 rounded-2xl
            transition-all duration-300 ease-out origin-top
            ${isMobileMenuOpen
                                ? "opacity-100 scale-100 translate-y-0"
                                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                            }
          `}
                    >
                        <div className="p-4 space-y-2">
                            <Link
                                to="/battles"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-purple-900/50 transition-all duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Sword className="w-5 h-5" />
                                <span className="font-medium">Battles</span>
                            </Link>

                            <Link
                                to="/leaderboard"
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-purple-900/50 transition-all duration-300"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Leaderboard</span>
                            </Link>

                            <hr className="border-purple-800 my-3" />

                            {isAuthenticated ? (
                                <>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">Profile</span>
                                    </Link>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-red-900/50 transition-all duration-300"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">Login</span>
                                    </Link>

                                    {/* Show Play Now button only on home page */}
                                    {isLandingPage && (
                                        <Link
                                            to="/play"
                                            className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl text-white font-bold hover:scale-[1.02] transition-all duration-300"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <Zap className="w-5 h-5" />
                                            <span>Play Now</span>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </nav >
            </div >

            {/* Background Glow Effect */}
            < div
                className={`
                    pointer-events-none 
                    absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 
                    bg-gradient-to-r from-purple-600/20 via-purple-400/10 to-purple-600/20 
                    blur-3xl transition-opacity duration-500
                    ${isScrolled ? "opacity-100" : "opacity-0"}
                `}
            />
        </header >
    );
};

export default Header;