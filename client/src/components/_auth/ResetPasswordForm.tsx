// src/components/_auth/ResetPasswordForm.tsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Shield,
  Key
} from 'lucide-react';
import { resetPasswordAPI } from '@/services/auth';

interface ResetPasswordFormProps {
  email: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ email }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate()
  // Password strength checker
  useEffect(() => {
    const password = formData.password;
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 20;

    setPasswordStrength(Math.min(strength, 100));
  }, [formData.password]);

  const getStrengthColor = (strength: number) => {
    if (strength < 30) return 'bg-red-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStrengthText = (strength: number) => {
    if (strength < 30) return 'Weak';
    if (strength < 60) return 'Fair';
    if (strength < 80) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      setErrors({});

      const result = await resetPasswordAPI(JSON.stringify(formData.password))

      if (result.success) {

        setTimeout(() => {
          navigate('/reset-password-success', {
            state: {
              email
            },
            replace: true
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ submit: 'Failed to reset password. Please try again.' });
    } finally {
      setIsLoading(false);
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
            <Lock className="w-6 h-6 md:w-8 md:h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-purple-300 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent mb-2">
          Create New Password
        </h2>
        <p className="text-gray-400 text-sm md:text-base mb-2">
          Set a strong password for
        </p>
        <p className="text-purple-300 font-medium text-sm md:text-base">
          {maskEmail(email)}
        </p>
      </div>

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        {/* New Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            <Key className="w-4 h-4 inline mr-2" />
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg pr-12 text-white
                focus:outline-none focus:ring-2 transition-all duration-300
                ${errors.password
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                }
              `}
              placeholder="Enter your new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">Password Strength</span>
                <span className={`text-xs font-medium ${passwordStrength < 30 ? 'text-red-400' :
                  passwordStrength < 60 ? 'text-yellow-400' :
                    passwordStrength < 80 ? 'text-blue-400' :
                      'text-green-400'
                  }`}>
                  {getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
            </div>
          )}

          {errors.password && (
            <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              {errors.password}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            <Shield className="w-4 h-4 inline mr-2" />
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`
                w-full px-4 py-2.5 md:py-3 bg-gray-900 border rounded-lg pr-12 text-white
                focus:outline-none focus:ring-2 transition-all duration-300
                ${errors.confirmPassword
                  ? 'border-red-500 focus:border-red-400 focus:ring-red-400/20'
                  : 'border-purple-800 focus:border-purple-400 focus:ring-purple-400/20'
                }
              `}
              placeholder="Confirm your new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.confirmPassword && (
            <div className={`flex items-center gap-2 text-xs ${formData.password === formData.confirmPassword
              ? 'text-green-400'
              : 'text-red-400'
              }`}>
              <CheckCircle className={`w-3 h-3 ${formData.password === formData.confirmPassword
                ? 'text-green-400'
                : 'text-red-400'
                }`} />
              {formData.password === formData.confirmPassword
                ? 'Passwords match'
                : 'Passwords do not match'
              }
            </div>
          )}

          {errors.confirmPassword && (
            <div className="flex items-center gap-2 text-red-400 text-xs md:text-sm">
              <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
              {errors.confirmPassword}
            </div>
          )}
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800/50">
            <AlertCircle className="w-4 h-4" />
            {errors.submit}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !formData.password || !formData.confirmPassword}
          className={`
            group w-full py-2.5 md:py-3 px-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300 
            flex items-center justify-center gap-2
            ${isLoading || !formData.password || !formData.confirmPassword
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30'
            }
          `}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Resetting Password...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
              <span>Reset Password</span>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {/* Back Link */}
        <div className="text-center pt-3 md:pt-4 border-t border-purple-900/50">
          <Link
            to="/verify-otp"
            state={{ email }}
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium text-sm md:text-base transition-colors duration-300 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Verification
          </Link>
        </div>

        {/* Security Note */}
        <div className="text-center pt-2">
          <p className="text-gray-500 text-xs md:text-sm">
            Your password will be encrypted and stored securely. For help, contact{' '}
            <Link
              to="/contact-support"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300 hover:underline"
            >
              support
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;