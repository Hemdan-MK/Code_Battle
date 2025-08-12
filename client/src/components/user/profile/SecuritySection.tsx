import { addError } from "@/redux/authSlice";
import { getDetailsAPI, updatePassword, updateUsername } from "@/services/user/getDetailsService";
import { Eye, EyeOff, Shield, User, Loader2, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { z } from "zod";

const SecuritySection = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [tagName, setTagName] = useState('');

    // Store original values for comparison
    const [originalUsername, setOriginalUsername] = useState('');
    const [originalTagName, setOriginalTagName] = useState('');

    // Loading, success, and failure states
    const [userUpdateLoading, setUserUpdateLoading] = useState(false);
    const [userUpdateSuccess, setUserUpdateSuccess] = useState(false);
    const [userUpdateFailed, setUserUpdateFailed] = useState(false);
    const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
    const [passwordUpdateFailed, setPasswordUpdateFailed] = useState(false);

    // Validation errors
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [userErrors, setUserErrors] = useState([]);

    // Validation schemas
    const passwordSchema = z.object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string()
            .min(8, "Password must be at least 8 characters")
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
        confirmPassword: z.string()
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    });

    const userSchema = z.object({
        username: z.string()
            .min(3, "Username must be at least 3 characters")
            .max(20, "Username must be less than 20 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
        tagName: z.string()
            .min(2, "Tag name is required")
            .max(10, "Tag name must be less than 10 characters")
            .regex(/^[a-zA-Z0-9_]+$/, "Tag name can only contain letters, numbers, and underscores")
    });

    const dispatch = useDispatch()

    useEffect(() => {
        const getDetails = async () => {
            setIsLoading(true);
            try {
                const result = await getDetailsAPI();
                if (result) {
                    setUsername(result.username);
                    setTagName(result.tag);
                    setOriginalUsername(result.username);
                    setOriginalTagName(result.tag);
                }
            } catch (error) {
                if (error instanceof Error) {
                    dispatch(addError(error.message));
                } else {
                    dispatch(addError('An unknown error occurred while fetching profile details.'));
                }
            } finally {
                setIsLoading(false);
            }
        }

        getDetails()
    }, [dispatch])

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (field: keyof typeof passwordForm, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    };

    // Check if user data has changed
    const isUserDataUnchanged = username === originalUsername && tagName === originalTagName;

    const handlePasswordSubmit = async () => {
        // Reset states
        setPasswordUpdateLoading(true);
        setPasswordUpdateSuccess(false);
        setPasswordUpdateFailed(false);
        setPasswordErrors([]);

        try {
            // Validate form data
            passwordSchema.parse(passwordForm);

            // Make API call and wait for response
            const response = await updatePassword(
                passwordForm.currentPassword,
                passwordForm.newPassword
            );

            if (response.success) {
                setPasswordUpdateSuccess(true);

                // Reset form after successful update
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });

                // Reset success state after 3 seconds
                setTimeout(() => {
                    setPasswordUpdateSuccess(false);
                }, 3000);
            } else {
                // Handle error returned from backend (e.g. wrong current password)
                setPasswordErrors([response.message || 'Failed to update password.']);
                setPasswordUpdateFailed(true);

                // Reset failure state after 3 seconds
                setTimeout(() => {
                    setPasswordUpdateFailed(false);
                }, 3000);
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                setPasswordErrors(error.errors.map(err => err.message));
            } else {
                dispatch(addError(error.message || 'An unknown error occurred'));
            }
            setPasswordUpdateFailed(true);

            // Reset failure state after 3 seconds
            setTimeout(() => {
                setPasswordUpdateFailed(false);
            }, 3000);
        } finally {
            setPasswordUpdateLoading(false);
        }
    };


    const handleUserSubmit = async () => {
        // Reset states
        setUserUpdateLoading(true);
        setUserUpdateSuccess(false);
        setUserUpdateFailed(false);
        setUserErrors([]);

        try {
            // Validate form data
            userSchema.parse({ username, tagName });

            await updateUsername(username, tagName);
            setUserUpdateSuccess(true);

            // Update original values after successful update
            setOriginalUsername(username);
            setOriginalTagName(tagName);

            // Reset success state after 3 seconds
            setTimeout(() => {
                setUserUpdateSuccess(false);
            }, 3000);
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                setUserErrors(error.errors.map(err => err.message));
            } else {
                // Handle API errors
                dispatch(addError(error.message || 'An unknown error occurred'));
            }
            setUserUpdateFailed(true);

            // Reset failure state after 3 seconds
            setTimeout(() => {
                setUserUpdateFailed(false);
            }, 3000);
        } finally {
            setUserUpdateLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="pt-20 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="ml-4 text-white text-lg">Loading profile...</span>
            </div>
        );
    }

    return (
        <div className="pt-20 space-y-6">
            <div className="flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-white">Security Settings</h2>
            </div>

            {/* Change Username Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <User className="w-5 h-5 text-purple-400" />
                    <h3 className="text-lg font-semibold text-white">Change Username</h3>
                </div>
                <div className="space-y-4">
                    <div className="flex space-x-3">
                        <div className="flex-1/2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="Enter username"
                                disabled={userUpdateLoading}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-300 mb-2">Tag Name</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">#</span>
                                <input
                                    type="text"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-8 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                    placeholder="Enter tag name"
                                    disabled={userUpdateLoading}
                                />
                            </div>
                        </div>
                    </div>

                    {/* User validation errors */}
                    {userErrors.length > 0 && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <X className="w-4 h-4" />
                                <span className="font-medium">Validation Error:</span>
                            </div>
                            <ul className="mt-2 text-sm text-red-300 space-y-1">
                                {userErrors.map((error, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="group w-full">
                        <button
                            type="button"
                            onClick={handleUserSubmit}
                            disabled={userUpdateLoading || isUserDataUnchanged}
                            className={`w-full text-white font-semibold py-3 px-6 rounded-lg 
                                     transition-all duration-200 transform 
                                     ${!isUserDataUnchanged && !userUpdateLoading ? 'hover:scale-102' : ''}
                                     ${userUpdateSuccess
                                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                                    : userUpdateFailed
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : isUserDataUnchanged
                                            ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                            : 'bg-gradient-to-r from-purple-600 via-pink-700 to-cyan-600 bg-[length:200%_200%] bg-[position:0%_50%] group-hover:animate-[gradientMove_3s_ease_infinite]'
                                }
                                     ${userUpdateLoading ? 'opacity-80 cursor-not-allowed' : ''}
                                     flex items-center justify-center gap-2`}
                        >
                            {userUpdateLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : userUpdateSuccess ? (
                                <>
                                    <Check className="w-5 h-5 animate-pulse" />
                                    Updated Successfully!
                                </>
                            ) : userUpdateFailed ? (
                                <>
                                    <X className="w-5 h-5 animate-pulse" />
                                    Update Failed
                                </>
                            ) : isUserDataUnchanged ? (
                                'No Changes Made'
                            ) : (
                                'Update User'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 lg:p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Change Password</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordForm.currentPassword}
                                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="Enter current password"
                                disabled={passwordUpdateLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                disabled={passwordUpdateLoading}
                            >
                                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordForm.newPassword}
                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="Enter new password"
                                disabled={passwordUpdateLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                disabled={passwordUpdateLoading}
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordForm.confirmPassword}
                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                                placeholder="Confirm new password"
                                disabled={passwordUpdateLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                disabled={passwordUpdateLoading}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Password validation errors */}
                    {passwordErrors.length > 0 && (
                        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                <X className="w-4 h-4" />
                                <span className="font-medium">Validation Error:</span>
                            </div>
                            <ul className="mt-2 text-sm text-red-300 space-y-1">
                                {passwordErrors.map((error, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-red-400 mt-1">•</span>
                                        {error}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="group w-full">
                        <button
                            type="button"
                            onClick={handlePasswordSubmit}
                            disabled={passwordUpdateLoading}
                            className={`w-full text-white font-semibold py-3 px-6 rounded-lg 
                                     transition-all duration-200 transform 
                                     hover:scale-102
                                     ${passwordUpdateSuccess
                                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                                    : passwordUpdateFailed
                                        ? 'bg-gradient-to-r from-red-500 to-red-600'
                                        : 'bg-gradient-to-r from-purple-600 via-pink-700 to-cyan-600 bg-[length:200%_200%] bg-[position:0%_50%] group-hover:animate-[gradientMove_3s_ease_infinite]'
                                }
                                     ${passwordUpdateLoading ? 'opacity-80 cursor-not-allowed' : ''}
                                     flex items-center justify-center gap-2`}
                        >
                            {passwordUpdateLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Updating...
                                </>
                            ) : passwordUpdateSuccess ? (
                                <>
                                    <Check className="w-5 h-5 animate-pulse" />
                                    Password Updated!
                                </>
                            ) : passwordUpdateFailed ? (
                                <>
                                    <X className="w-5 h-5 animate-pulse" />
                                    Update Failed
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecuritySection;