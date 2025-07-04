// src/pages/VerifyOTPPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { verifyOTPThunk, resendOTPThunk } from '../../redux/thunk';
import { clearError } from '../../redux/slice';
import {
    Mail,
    Phone,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw,
    ArrowLeft,
    Swords
} from 'lucide-react';
import { getTempToken } from '@/utils/tokenUtils';

interface LocationState {
    email?: string;
    phoneNumber?: string;
    username?: string;
}

const VerifyOTPPage: React.FC = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [activeMethod, setActiveMethod] = useState<'email' | 'phone'>('email');
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const location = useLocation();

    const { loading, error } = useSelector((state: RootState) => state.auth);

    // Get data from navigation state
    const locationState = location.state as LocationState;
    const userEmail = locationState?.email || '';
    const userPhone = locationState?.phoneNumber || '';
    const username = locationState?.username || '';
    
    const tempToken = getTempToken()

    useEffect(() => {
        if (!userEmail && !userPhone) {
            navigate('/signup', { replace: true });
            return;
        }

        if (!tempToken) {
            console.error('No temp token available');
            navigate('/signup', {
                replace: true,
                state: { error: 'Session expired. Please sign up again.' }
            });
            return;
        }
    }, [userEmail, userPhone, navigate]);

    // Timer for resend functionality
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    // Clear error when user starts typing
    useEffect(() => {
        if (otp.some(digit => digit !== '')) {
            setErrorMessage('');
            if (error) {
                dispatch(clearError());
            }
        }
    }, [otp, error, dispatch]);

    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) return; // Only allow single digit

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Handle backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle enter key
        if (e.key === 'Enter') {
            handleSubmit(e as any);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);

        const newOtp = [...otp];
        for (let i = 0; i < digits.length; i++) {
            newOtp[i] = digits[i];
        }
        setOtp(newOtp);

        // Focus the next empty input or the last input
        const nextEmptyIndex = newOtp.findIndex(digit => !digit);
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else {
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setErrorMessage('Please enter complete 6-digit OTP');
            return;
        }

        if (!tempToken) {
            setErrorMessage('Session expired. Please try again.');
            return;
        }

        try {
            setErrorMessage('');
            dispatch(clearError());

            const result = await dispatch(verifyOTPThunk({
                otp: otpString,
                tempToken: tempToken,
                method: activeMethod
            })).unwrap();

            if (result.success) {
                setIsVerified(true);

                // Navigate to success page after a short delay
                setTimeout(() => {
                    navigate('/signup-success', {
                        state: {
                            username,
                            email: userEmail,
                            message: 'Account verified successfully!',
                            isSignupComplete: true
                        },
                        replace: true
                    });
                }, 1500);
            }

        } catch (error) {
            console.error('OTP verification failed:', error);

            // Clear OTP inputs on error
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

            // Error will be handled by Redux state
        }
    };

    const handleResend = async () => {
        if (!canResend || loading || !tempToken) return;

        try {
            setErrorMessage('');
            dispatch(clearError());

            await dispatch(resendOTPThunk({
                method: activeMethod,
                tempToken: tempToken
            })).unwrap();

            // Reset timer
            setTimeLeft(60);
            setCanResend(false);

            // Clear OTP inputs
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();

        } catch (error) {
            console.error('Resend OTP failed:', error);
            // Error will be handled by Redux state
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const maskEmail = (email: string) => {
        if (!email) return '';
        const [name, domain] = email.split('@');
        if (!name || !domain) return email;
        const maskedName = name.charAt(0) + '*'.repeat(Math.max(0, name.length - 2)) + name.charAt(name.length - 1);
        return `${maskedName}@${domain}`;
    };

    const maskPhone = (phone: string) => {
        if (!phone) return '';
        return phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
    };

    const otpComplete = otp.join('').length === 6;

    // Use local error state or Redux error
    const displayError = errorMessage || error;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md mx-auto">
                {/* Form Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <div className="relative p-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full">
                            <Swords className="w-6 h-6 md:w-8 md:h-8 text-white" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-purple-300 rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent mb-2">
                        Verify Your Identity
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mb-4">
                        Enter the 6-digit code we sent to secure your account
                    </p>
                </div>

                {/* Method Selection */}
                <div className="flex gap-2 mb-6 p-1 bg-gray-900/50 rounded-lg border border-purple-800/30">
                    <button
                        type="button"
                        onClick={() => setActiveMethod('email')}
                        disabled={loading || isVerified}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300
                            ${activeMethod === 'email'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-200'
                            }
                            ${(loading || isVerified) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <Mail className="w-4 h-4" />
                        Email
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveMethod('phone')}
                        disabled={loading || isVerified}
                        className={`
                            flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all duration-300
                            ${activeMethod === 'phone'
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-gray-200'
                            }
                            ${(loading || isVerified) ? 'opacity-50 cursor-not-allowed' : ''}
                        `}
                    >
                        <Phone className="w-4 h-4" />
                        SMS
                    </button>
                </div>

                {/* Contact Info Display */}
                <div className="mb-6 p-3 bg-purple-900/20 border border-purple-800/30 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                        {activeMethod === 'email' ? (
                            <>
                                <Mail className="w-4 h-4 text-purple-400" />
                                <span>Code sent to: {maskEmail(userEmail)}</span>
                            </>
                        ) : (
                            <>
                                <Phone className="w-4 h-4 text-purple-400" />
                                <span>Code sent to: {maskPhone(userPhone)}</span>
                            </>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input Fields */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300 text-center">
                            Enter Verification Code
                        </label>
                        <div className="flex gap-2 justify-center">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => { inputRefs.current[index] = el }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className={`
                                        w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-bold
                                        bg-gray-900 border rounded-lg text-white
                                        focus:outline-none focus:ring-2 transition-all duration-300
                                        ${displayError
                                            ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                                            : isVerified
                                                ? 'border-green-500 focus:border-green-400 focus:ring-green-400/20'
                                                : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                                        }
                                        ${(loading || isVerified) ? 'opacity-50' : ''}
                                    `}
                                    disabled={loading || isVerified}
                                />
                            ))}
                        </div>

                        {displayError && (
                            <div className="flex items-center justify-center gap-2 text-red-400 text-sm mt-2">
                                <AlertCircle className="w-4 h-4" />
                                {displayError}
                            </div>
                        )}

                        {isVerified && (
                            <div className="flex items-center justify-center gap-2 text-green-400 text-sm mt-2">
                                <CheckCircle className="w-4 h-4" />
                                Verification successful! Redirecting...
                            </div>
                        )}
                    </div>

                    {/* Resend Section */}
                    {!isVerified && (
                        <div className="text-center">
                            <div className="text-gray-400 text-sm mb-2">
                                Didn't receive the code?
                            </div>
                            {canResend ? (
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={loading}
                                    className={`
                                        inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium
                                        transition-colors duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}
                                    `}
                                >
                                    {loading ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <RefreshCw className="w-4 h-4" />
                                            Resend Code
                                        </>
                                    )}
                                </button>
                            ) : (
                                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                                    <Clock className="w-4 h-4" />
                                    Resend available in {formatTime(timeLeft)}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading || !otpComplete || isVerified}
                        className={`
                            group w-full py-2.5 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 
                            flex items-center justify-center gap-2
                            ${loading || !otpComplete
                                ? 'bg-gray-700 cursor-not-allowed opacity-50'
                                : isVerified
                                    ? 'bg-green-600 cursor-default'
                                    : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30'
                            }
                        `}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                                <span>Verifying...</span>
                            </>
                        ) : isVerified ? (
                            <>
                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                                <span>Verified Successfully!</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                                <span>Verify & Continue</span>
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    {/* Back to Sign Up */}
                    {!isVerified && (
                        <div className="text-center pt-3 md:pt-4 border-t border-purple-900/50">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-300 text-sm transition-colors duration-300 hover:underline"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign Up
                            </Link>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VerifyOTPPage;