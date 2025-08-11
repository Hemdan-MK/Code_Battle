// src/components/auth/SignUpForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { signupThunk } from '../../redux/thunk';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store'; // Adjust import path as needed
import {
    User,
    Mail,
    Phone,
    Lock,
    Eye,
    EyeOff,
    Sword,
    Shield,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    UserPlus
} from 'lucide-react';

// Zod schema for signup form validation
const signUpSchema = z.object({
    username: z
        .string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters long')
        .max(20, 'Username must not exceed 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address'),
    phoneNumber: z
        .string()
        .min(1, 'Phone number is required')
        .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'),
    password: z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});

type SignUpFormData = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
    onSubmit?: (formData: SignUpFormData) => void;
}

const SignUpForm: React.FC<SignUpFormProps> = () => {
    const [formData, setFormData] = useState<SignUpFormData>({
        username: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSuccess, setIsSuccess] = useState(false);

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const isLoading = useSelector((state: RootState) => state.auth.loading);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = (): boolean => {
        try {
            signUpSchema.parse(formData);
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

        setIsSuccess(false);

        try {

            const result = await dispatch(
                signupThunk({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phoneNumber: formData.phoneNumber
                })
            ).unwrap();

            if (result.requiresOTP) {

                setIsSuccess(true);
                
                setTimeout(() => {
                    navigate("/otp-sign", {
                        state: {
                            email: formData.email,
                            phoneNumber: formData.phoneNumber,
                            username: formData.username,
                        }
                    });
                }, 1500);
            }
        } catch (error: any) {
            console.error('SignUp error:', error);
                     
            // Clear any general errors from form
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="w-full max-w-md mx-auto">

            {/* Form Header */}
            <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                    <div className="relative p-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-full">
                        <UserPlus className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-purple-300 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent mb-2">
                    Join the Battle
                </h2>
                <p className="text-gray-400 text-sm md:text-base">Create your warrior account</p>
            </div>

            {/* SignUp Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                {/* Username Field */}
                <div className="space-y-1">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                        Battle Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className={`
                w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300
                ${errors.username
                                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                                    : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                                }
              `}
                            placeholder="Choose your battle name"
                        />
                    </div>
                    {errors.username && (
                        <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
                            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                            {errors.username}
                        </div>
                    )}
                </div>

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
                            className={`
                w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300
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

                {/* Phone Field */}
                <div className="space-y-1">
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
                        Phone Number
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            className={`
                w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300
                ${errors.phoneNumber
                                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                                    : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                                }
              `}
                            placeholder="Enter your phone number"
                        />
                    </div>
                    {errors.phoneNumber && (
                        <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
                            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                            {errors.phoneNumber}
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
                            className={`
                w-full pl-9 md:pl-10 pr-12 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300
                ${errors.password
                                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                                    : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                                }
              `}
                            placeholder="Create a strong password"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
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

                {/* Confirm Password Field */}
                <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className={`
                w-full pl-9 md:pl-10 pr-12 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                focus:outline-none focus:ring-2 transition-all duration-300
                ${errors.confirmPassword
                                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                                    : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                                }
              `}
                            placeholder="Confirm your password"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4 md:w-5 md:h-5" /> : <Eye className="w-4 h-4 md:w-5 md:h-5" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
                            <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                            {errors.confirmPassword}
                        </div>
                    )}
                </div>

                {/* Terms and Privacy */}
                <div className="text-xs md:text-sm text-gray-400 leading-relaxed">
                    By signing up, you agree to our{' '}
                    <Link to="/terms" className="text-purple-400 hover:text-purple-300 underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-purple-400 hover:text-purple-300 underline">
                        Privacy Policy
                    </Link>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className={`
            group w-full py-2.5 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 
            flex items-center justify-center gap-2
            ${isLoading || isSuccess 
                            ? 'cursor-not-allowed' 
                            : 'hover:scale-[1.02] hover:shadow-lg'
                        }
            ${isSuccess 
                            ? 'bg-gradient-to-r from-green-600 to-green-500 hover:shadow-green-500/30' 
                            : isLoading 
                                ? 'bg-gray-700' 
                                : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:shadow-purple-500/30'
                        }
          `}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Warrior...</span>
                        </>
                    ) : isSuccess ? (
                        <>
                            <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                            <span>Success! Redirecting to OTP...</span>
                        </>
                    ) : (
                        <>
                            <Sword className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform" />
                            <span>Join Battle</span>
                            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {/* Login Link */}
                <div className="text-center pt-3 md:pt-4 border-t border-purple-900/50">
                    <p className="text-gray-400 text-sm md:text-base">
                        Already a warrior?{' '}
                        <Link
                            to="/login"
                            className="text-purple-400 hover:text-purple-300 font-semibold transition-colors duration-300 hover:underline"
                        >
                            Enter the Arena →
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default SignUpForm;