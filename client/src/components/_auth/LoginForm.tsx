// src/components/auth/LoginForm.tsx
const githubClient = import.meta.env.VITE_GITHUB_CLIENT_ID;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
// const googleClientId = "451229912614-d72se1q4om0evfru0h2tb95p2qa7388u.apps.googleusercontent.com";
const googleRedirectUri = `${window.location.origin}/auth/google/callback`;


import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { loginThunk, githubAuthThunk, googleAuthThunk } from '../../redux/thunk'; // Updated import names
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sword,
  Shield,
  ChevronRight,
  AlertCircle,
  Github
} from 'lucide-react';

// Zod schema for login form validation
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters long')
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [oauthLoading, setOauthLoading] = useState<'github' | 'google' | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Get loading state and error from Redux store
  const { loading: isLoading, error: authError } = useSelector((state: RootState) => state.auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear general error when user starts typing
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = (): boolean => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      console.log('Form data being sent:', formData);

      const result = await dispatch(loginThunk({
        email: formData.email,
        password: formData.password
      })).unwrap();

      console.log('Login successful:', result);

      if (result.isAdmin) {
        navigate('/admin/dashboard', {
          replace: true
        });
      } else {
        navigate('/home', {
          replace: true
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: typeof error === 'string' ? error : 'Login failed. Please try again.' });
    }
  };

  // Updated GitHub login handler
  const handleGithubLogin = async () => {
    try {
      setOauthLoading('github');
      setErrors({});

      if (!githubClient) {
        throw new Error("GitHub Client ID is missing in .env");
      }

      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClient}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/github/callback')}&scope=user:email`;

      window.location.href = githubAuthUrl;
    } catch (error) {
      console.error('GitHub login error:', error);
      setErrors({
        general: typeof error === 'string' ? error : 'GitHub login failed. Please try again.',
      });
      setOauthLoading(null);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      googleRedirectUri
    )}&response_type=code&scope=openid%20email%20profile&access_type=offline`;

    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;

    const popup = window.open(
      googleAuthUrl,
      'GoogleLoginPopup',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for message from popup
    window.addEventListener('message', (event) => {
      if (
        event.origin !== window.location.origin ||
        !event.data?.type ||
        event.data.type !== 'google-auth-success'
      ) {
        return;
      }

      const code = event.data.code;
      if (code) {
        // Dispatch login from parent
        dispatch(googleAuthThunk({ credential: code }))
          .unwrap()
          .then((result) => {
            if (result.isAdmin) {
              navigate('/admin/dashboard', { replace: true });
            } else {
              setTimeout(() => {
                navigate('/signup-success', {
                  state: {
                    username : result.user.name,
                    email: result.user.email,
                    message: 'Account verified successfully!',
                    isSignupComplete: true
                  },
                  replace: true
                });
              }, 1500);
            }
          })
          .catch((err) => console.error('Login error:', err));
      }
    });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Use either local error or Redux auth error
  const displayError = errors.general || authError;
  const isAnyLoading = isLoading || oauthLoading !== null;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Form Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-3">
          <div className="relative p-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full">
            <Sword className="w-6 h-6 md:w-8 md:h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-purple-300 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent mb-2">
          Enter the Arena
        </h2>
        <p className="text-gray-400 text-sm md:text-base">Sign in to start your coding battles</p>
      </div>

      {/* OAuth Login Buttons */}
      <div className="space-y-3 mb-6">
        {/* GitHub Login Button */}
        {/* <button
          type="button"
          onClick={handleGithubLogin}
          disabled={isAnyLoading}
          className={`
            group w-full py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-300 
            flex items-center justify-center gap-3 border
            ${isAnyLoading
              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50'
              : 'bg-gray-900 border-gray-700 hover:bg-gray-800 hover:border-gray-600 hover:scale-[1.02]'
            }
          `}
        >
          {oauthLoading === 'github' ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-300">Connecting to GitHub...</span>
            </>
          ) : (
            <>
              <Github className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-white transition-colors" />
              <span className="text-gray-300 group-hover:text-white transition-colors">Continue with GitHub</span>
            </>
          )}
        </button> */}

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isAnyLoading}
          className={`
            group w-full py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base transition-all duration-300 
            flex items-center justify-center gap-3 border
            ${isAnyLoading
              ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50'
              : 'bg-white border-gray-300 hover:bg-gray-50 hover:scale-[1.02]'
            }
          `}
        >
          {oauthLoading === 'google' ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Connecting to Google...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Continue with Google</span>
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-purple-900/50"></div>
        <div className="px-4 text-gray-400 text-sm">or</div>
        <div className="flex-1 border-t border-purple-900/50"></div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        {/* General Error */}
        {displayError && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <AlertCircle className="w-4 h-4" />
            {displayError}
          </div>
        )}

        {/* Email Field */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isAnyLoading}
              className={`
                w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                ${errors.email
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                }
              `}
              placeholder="Enter your email"
            />
          </div>
          {errors.email && (
            <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              {errors.email}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              disabled={isAnyLoading}
              className={`
                w-full pl-9 md:pl-10 pr-12 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                ${errors.password
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                }
              `}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={isAnyLoading}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
            </button>
          </div>
          {errors.password && (
            <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-xs md:text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isAnyLoading}
          className={`
            group w-full py-2.5 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 
            flex items-center justify-center gap-2
            ${isAnyLoading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Entering Arena...</span>
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
              <span>Enter Battle</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Sign Up Link */}
        <div className="text-center pt-3 md:pt-4 border-t border-purple-900/50">
          <p className="text-gray-400 text-sm md:text-base">
            New to the arena?{' '}
            <Link
              to="/signup"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 hover:underline"
            >
              Join the Battle →
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;