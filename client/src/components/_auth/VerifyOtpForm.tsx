// src/components/_auth/VerifyOtpForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  KeyRound,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle
} from 'lucide-react';
import { resendResetCodeAPI, verifyResetCodeAPI } from '@/services/auth';

interface VerifyOtpFormProps {
  email: string;
}

const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({ email }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digit
    if (value.length > 1) return;

    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }

    // Clear resend success message when user starts typing
    if (resendSuccess) {
      setResendSuccess(false);
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          const newOtp = digits.split('');
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const result = await verifyResetCodeAPI({
        email,
        otp: otp.join("")
      });

      if (result.success && result.isCorrect) {
        setTimeout(() => {
          navigate('/reset-password', {
            state: {
              email
            },
            replace: true
          });
        }, 1500);
      } else if (result.success && !result.isCorrect) {
        setError(result.message);
        // Clear OTP inputs on incorrect code
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }

    } catch (error) {
      console.error('OTP verification failed:', error);
      setError('Verification failed. Please try again.');
      
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const result = await resendResetCodeAPI({ email });
      
      if (result.success) {
        // Clear current OTP
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        
        // Reset timer
        setTimeLeft(60);
        setCanResend(false);
        
        // Show success message
        setResendSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setResendSuccess(false);
        }, 3000);
      } else {
        setError(result.message || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.substring(0, 2) + '*'.repeat(username.length - 2);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Form Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="relative p-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full">
            <KeyRound className="w-6 h-6 md:w-8 md:h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-purple-300 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-2">
          We've sent a 6-digit code to
        </p>
        <p className="text-purple-300 font-medium text-sm md:text-base">
          {maskEmail(email)}
        </p>
      </div>

      {/* Verification Form */}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        {/* OTP Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300 text-center">
            Verification Code
          </label>
          <div className="flex gap-2 md:gap-3 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => { inputRefs.current[index] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleInputChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                className={`
                  w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-bold bg-gray-900 border rounded-lg text-white
                  focus:outline-none focus:ring-2 transition-all duration-300
                  ${error
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                  }
                  ${digit ? 'bg-purple-900/30 border-purple-600' : ''}
                `}
                disabled={isLoading}
              />
            ))}
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-2 text-red-400 text-xs md:text-sm">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              {error}
            </div>
          )}
          
          {/* Success Message */}
          {resendSuccess && (
            <div className="flex items-center justify-center gap-2 text-green-400 text-xs md:text-sm">
              <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
              New verification code sent successfully!
            </div>
          )}
        </div>

        {/* Timer and Resend */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>
          ) : (
            <div className="text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Verification code has expired
            </div>
          )}

          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend || isResending}
            className={`
              mt-2 text-sm font-medium transition-colors duration-300
              ${canResend && !isResending
                ? 'text-purple-400 hover:text-purple-300 hover:underline'
                : 'text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isResending ? (
              <span className="flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Sending new code...
              </span>
            ) : (
              'Resend verification code'
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || otp.join('').length !== 6}
          className={`
            group w-full py-2.5 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 
            flex items-center justify-center gap-2
            ${isLoading || otp.join('').length !== 6
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              <span>Verify & Continue</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Back Link */}
        <div className="text-center pt-3 md:pt-4 border-t border-purple-900/50">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm md:text-base transition-colors duration-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Email Entry
          </Link>
        </div>

        {/* Help Text */}
        <div className="text-center pt-2">
          <p className="text-gray-500 text-xs md:text-sm">
            Didn't receive the code? Check your spam folder or{' '}
            <Link
              to="/contact-support"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
            >
              contact support
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default VerifyOtpForm;