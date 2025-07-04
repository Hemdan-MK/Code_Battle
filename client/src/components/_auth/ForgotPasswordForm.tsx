// src/components/_auth/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { forgotPasswordAPI } from '../../services/auth';
import {
  Mail,
  Sword,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Send,
} from 'lucide-react';

// Zod schema for email validation
const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(254, 'Email address is too long')
});

type EmailFormData = z.infer<typeof emailSchema>;

type ForgotPasswordFormProps = {
  setShowNoUserModal: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
};

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ setShowNoUserModal, email, setEmail }) => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (data: EmailFormData) => {
    try {
      emailSchema.parse(data);
      return { success: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors[0].message };
      }
      return { success: false, error: 'Validation failed' };
    }
  };

  const sendEmailToServer = async (email: string) => {
    try {
      const response = await forgotPasswordAPI({ email });
      return response;
    } catch (error: any) {
      console.error('Server request failed:', error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to connect to server');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation with Zod
    const validation = validateEmail({ email });
    if (!validation.success) {
      setError(validation.error || 'Invalid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await sendEmailToServer(email);

      if (response.success && response.userExists) {
        // User exists, reset code sent successfully
        console.log('Reset code sent successfully');
        // Navigate to verification page with email and resetToken if provided
        navigate('/verify-reset-code', {
          state: {
            email,
          }
        });
      } else if (response.success && response.userExists === false) {
        // User doesn't exist in database
        setShowNoUserModal(true);
      } else {
        setError(response.message || 'Failed to send reset code');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <>
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
            Forgot Password?
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            No worries! Enter your email and we'll send you a reset code
          </p>
        </div>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
                value={email}
                onChange={handleInputChange}
                className={`
                  w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-400 text-sm md:text-base
                  focus:outline-none focus:ring-2 transition-all duration-300
                  ${error
                    ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                  }
                `}
                placeholder="Enter your registered email"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
                <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                {error}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-purple-900/50 rounded">
                <Sword className="w-3 h-3 md:w-4 md:h-4 text-purple-400" />
              </div>
              <div className="text-xs md:text-sm text-gray-300">
                <p className="font-medium text-purple-300 mb-1">Security Notice</p>
                <p>We'll send a 6-digit verification code to your email. The code expires in 10 minutes for your security.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`
              group w-full py-2.5 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 
              flex items-center justify-center gap-2
              ${isLoading
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                <span>Validating Email...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                <span>Send Reset Code</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          {/* Back to Login Link */}
          <div className="text-center pt-3 md:pt-4 border-t border-purple-900/50">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm md:text-base transition-colors duration-300 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>

          {/* Additional Help */}
          <div className="text-center pt-2">
            <p className="text-gray-500 text-xs md:text-sm">
              Still having trouble?{' '}
              <Link
                to="/contact-support"
                className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </div>
        </form>
      </div>


    </>
  );
};

export default ForgotPasswordForm;