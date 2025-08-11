
import React, { useCallback, useEffect, useState, useRef, type JSX } from "react";
import { z } from "zod";
import userService from "@/services/admin/userService";
import type { User, UserStatus, UserRank, CreateUser, UpdateUser } from "@/types/index";

const createUserSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password must be less than 100 characters"),
    phone: z.number()
        .int("Phone number must be an integer")
        .positive("Phone number must be positive"),
    rank: z.enum(["Silver", "Gold", "Platinum", "Diamond", "Unranked"] as const),
    xp: z.number()
        .int("XP must be an integer")
        .min(0, "XP cannot be negative"),
    role: z.enum(['user', 'admin'])
});

const updateUserSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be less than 30 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    email: z.string()
        .email("Please enter a valid email address")
        .min(1, "Email is required"),
    phone: z.number()
        .int("Phone number must be an integer")
        .positive("Phone number must be positive")
    ,
    rank: z.enum(["Silver", "Gold", "Platinum", "Diamond", "Unranked"] as const),
    xp: z.number()
        .int("XP must be an integer")
        .min(0, "XP cannot be negative"),
    role: z.enum(['user', 'admin'])
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

interface UserManagementState {
    users: User[];
    loading: boolean;
    error: string;
    searchTerm: string;
    filterStatus: UserStatus | 'all';
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    usersPerPage: number;
    showCreateModal: boolean;
    showViewModal: boolean;
    showUpdateModal: boolean;
    selectedUser: User | null;
}

interface FormErrors {
    [key: string]: string;
}

const UserManagement: React.FC = () => {
    const [state, setState] = useState<UserManagementState>({
        users: [],
        loading: false,
        error: '',
        searchTerm: '',
        filterStatus: 'all',
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        usersPerPage: 10,
        showCreateModal: false,
        showViewModal: false,
        showUpdateModal: false,
        selectedUser: null
    });

    const [createForm, setCreateForm] = useState<CreateUserFormData>({
        username: '',
        email: '',
        password: '',
        phone: undefined
    });

    const [updateForm, setUpdateForm] = useState<UpdateUserFormData>({
        username: '',
        email: '',
        phone: undefined,
        rank: 'Silver',
        xp: 0,
        role: 'user'
    });

    const [createFormErrors, setCreateFormErrors] = useState<FormErrors>({});
    const [updateFormErrors, setUpdateFormErrors] = useState<FormErrors>({});

    // Use ref to avoid stale closures
    const stateRef = useRef(state);
    stateRef.current = state;

    // Track if component is mounted to prevent state updates after unmount
    const isMountedRef = useRef(true);

    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const updateState = useCallback((updates: Partial<UserManagementState>) => {
        if (isMountedRef.current) {
            setState(prev => ({ ...prev, ...updates }));
        }
    }, []);

    // Validation helper functions
    const validateCreateForm = (data: CreateUserFormData): FormErrors => {
        try {
            createUserSchema.parse(data);
            return {};
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: FormErrors = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        errors[err.path[0]] = err.message;
                    }
                });
                return errors;
            }
            return { general: 'Validation failed' };
        }
    };

    const validateUpdateForm = (data: UpdateUserFormData): FormErrors => {
        try {
            updateUserSchema.parse(data);
            return {};
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: FormErrors = {};
                error.errors.forEach((err) => {
                    if (err.path.length > 0) {
                        errors[err.path[0]] = err.message;
                    }
                });
                return errors;
            }
            return { general: 'Validation failed' };
        }
    };

    // Completely rewritten fetchUsers to avoid any state dependencies
    const fetchUsers = useCallback(async (
        page: number = 1,
        limit: number = 10,
        search: string = '',
        status: UserStatus | 'all' = 'all'
    ): Promise<void> => {
        if (!isMountedRef.current) return;

        try {
            updateState({ loading: true, error: '' });

            console.log('Fetching users with params:', { page, limit, search, status });

            const response = await userService.getUsers(page, limit, search, status);

            console.log("getUser response:", response);

            if (isMountedRef.current) {
                updateState({
                    users: response.users || [],
                    totalPages: response.totalPages || 1,
                    totalUsers: response.totalUsers || 0,
                    loading: false
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            if (isMountedRef.current) {
                updateState({ error: errorMessage, loading: false });
            }
            console.error('Error fetching users:', err);
        }
    }, [updateState]);

    const handleViewUser = async (userId: string): Promise<void> => {
        try {
            updateState({ loading: true, error: '' });
            const user = await userService.getUserById(userId);
            updateState({
                selectedUser: user,
                showViewModal: true,
                loading: false
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user details';
            updateState({ error: errorMessage, loading: false });
        }
    };

    const handleEditUser = async (userId: string): Promise<void> => {
        try {
            updateState({ loading: true, error: '' });
            const user = await userService.getUserById(userId);

            setUpdateForm({
                username: user.username,
                email: user.email,
                phone: user.phone && user.phone !== 0 ? user.phone : undefined,
                rank: user.rank,
                xp: user.xp || 0
            });

            // Clear any existing errors
            setUpdateFormErrors({});

            updateState({
                selectedUser: user,
                showUpdateModal: true,
                loading: false
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user details';
            updateState({ error: errorMessage, loading: false });
        }
    };

    const handleUpdateUser = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Validate form data
        const errors = validateUpdateForm(updateForm);
        setUpdateFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            updateState({ error: 'Please fix the validation errors' });
            return;
        }

        if (!state.selectedUser) {
            updateState({ error: 'No user selected' });
            return;
        }

        try {
            updateState({ loading: true, error: '' });

            const userData: UpdateUser = {
                username: updateForm.username,
                email: updateForm.email,
                rank: updateForm.rank,
                phone: updateForm.phone,
                xp: updateForm.xp,
                role: updateForm.role
            };

            await userService.updateUser(state.selectedUser._id, userData);

            // Close modal and reset form
            updateState({ showUpdateModal: false, selectedUser: null });
            setUpdateForm({ username: '', email: '', phone: undefined, rank: 'Silver', xp: 0 });
            setUpdateFormErrors({});

            // Refresh data
            const currentState = stateRef.current;
            await fetchUsers(
                currentState.currentPage,
                currentState.usersPerPage,
                currentState.searchTerm,
                currentState.filterStatus
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
            updateState({ error: errorMessage });
        } finally {
            updateState({ loading: false });
        }
    };

    const handleBanUser = async (userId: string, currentStatus: boolean): Promise<void> => {
        try {
            const action = currentStatus ? 'unban' : 'ban';
            console.log("user id here : ", userId);

            await userService.banUser(userId, action);

            const currentState = stateRef.current;
            await fetchUsers(
                currentState.currentPage,
                currentState.usersPerPage,
                currentState.searchTerm,
                currentState.filterStatus
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to ban/unban user';
            updateState({ error: errorMessage });
        }
    };

    const handleCreateUser = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        // Validate form data
        const errors = validateCreateForm(createForm);
        setCreateFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            updateState({ error: 'Please fix the validation errors' });
            return;
        }

        try {
            updateState({ loading: true, error: '' });

            const userData: CreateUser = {
                username: createForm.username,
                email: createForm.email,
                password: createForm.password,
                phone: createForm.phone,
                role: createForm.role,
                rank: createForm.rank,
                xp: createForm.xp | 0
            };


            await userService.createUser(userData);

            // Reset form and close modal
            setCreateForm({ username: '', email: '', password: '', phone: undefined });
            setCreateFormErrors({});
            updateState({ showCreateModal: false });

            // Refresh data
            const currentState = stateRef.current;
            await fetchUsers(
                currentState.currentPage,
                currentState.usersPerPage,
                currentState.searchTerm,
                currentState.filterStatus
            );
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
            updateState({ error: errorMessage });
        } finally {
            updateState({ loading: false });
        }
    };

    // Debounced search handler
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const newSearchTerm = event.target.value;
        updateState({ searchTerm: newSearchTerm, currentPage: 1 });

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Set new timeout
        searchTimeoutRef.current = setTimeout(() => {
            fetchUsers(1, stateRef.current.usersPerPage, newSearchTerm, stateRef.current.filterStatus);
        }, 500);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        const newFilterStatus = event.target.value as UserStatus | 'all';
        updateState({ filterStatus: newFilterStatus, currentPage: 1 });

        // Immediately fetch with new filter
        fetchUsers(1, stateRef.current.usersPerPage, stateRef.current.searchTerm, newFilterStatus);
    };

    const handlePageChange = (page: number): void => {
        updateState({ currentPage: page });
        fetchUsers(page, stateRef.current.usersPerPage, stateRef.current.searchTerm, stateRef.current.filterStatus);
    };

    const closeAllModals = (): void => {
        updateState({
            showCreateModal: false,
            showViewModal: false,
            showUpdateModal: false,
            selectedUser: null,
            error: ''
        });
        setCreateForm({ username: '', email: '', password: '', phone: undefined });
        setUpdateForm({ username: '', email: '', rank: 'Silver', xp: 0, phone: undefined });
        setCreateFormErrors({});
        setUpdateFormErrors({});
    };

    // Initial fetch - only run once on mount
    useEffect(() => {
        console.log('Component mounted, fetching initial data...');
        fetchUsers(1, 10, '', 'all');

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const getRankColor = (rank: UserRank): string => {
        const colorMap: Record<UserRank, string> = {
            Diamond: 'from-cyan-400 to-blue-500',
            Platinum: 'from-gray-300 to-gray-500',
            Gold: 'from-yellow-400 to-yellow-600',
            Silver: 'from-gray-400 to-gray-600',
            Unranked: 'from-orange-400 to-orange-600'
        };
        return colorMap[rank] || 'from-orange-400 to-orange-600';
    };

    const renderFormField = (
        label: string,
        name: string,
        type: string,
        value: string | number | undefined,
        onChange: (value: string | number) => void,
        error?: string,
        required: boolean = true,
        placeholder?: string,
        min?: number,
        max?: number
    ): JSX.Element => (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
                {label} {required && <span className="text-red-400">*</span>}
            </label>
            <input
                name={name}
                type={type}
                value={value ?? ''}
                onChange={(e) => {
                    const val = type === 'number' ? Number(e.target.value) : e.target.value;
                    onChange(val);
                }}
                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-violet-500 text-white placeholder-gray-400 ${error ? 'border-red-500' : 'border-gray-600'
                    }`}
                placeholder={placeholder}
                required={required}
                min={min}
                max={max}
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );

    const renderPagination = (): JSX.Element => {
        const pages: JSX.Element[] = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(state.totalPages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${i === state.currentPage
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                    Showing {((state.currentPage - 1) * state.usersPerPage) + 1} to {Math.min(state.currentPage * state.usersPerPage, state.totalUsers)} of {state.totalUsers} users
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(Math.max(1, state.currentPage - 1))}
                        disabled={state.currentPage === 1}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    {pages}
                    <button
                        onClick={() => handlePageChange(Math.min(state.totalPages, state.currentPage + 1))}
                        disabled={state.currentPage === state.totalPages}
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            </div>
        );
    };

    const renderViewUserModal = (): JSX.Element => {
        if (!state.showViewModal || !state.selectedUser) return <></>;

        const user = state.selectedUser;

        return (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-white">User Details</h3>
                        <button
                            onClick={closeAllModals}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* User Avatar and Basic Info */}
                        <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
                            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {user.username[0].toUpperCase()}
                            </div>
                            <div>
                                <h4 className="text-xl font-semibold text-white">{user.username}</h4>
                                <p className="text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        {/* User Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-400 mb-1">XP Points</h5>
                                <p className="text-2xl font-bold text-white">{user.xp?.toLocaleString() || 0}</p>
                            </div>
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-400 mb-1">Rank</h5>
                                <p className={`text-xl font-bold bg-gradient-to-r ${getRankColor(user.rank)} bg-clip-text text-transparent`}>
                                    {user.rank}
                                </p>
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Contact Info</h5>
                                    <p className="text-2xl font-bold text-white">{user.phone === 0 ? 'NULL' : user.phone}</p>
                                </div>
                                <div className="p-4 bg-gray-700 rounded-lg">
                                    <h5 className="text-sm font-medium text-gray-400 mb-2">Account Status</h5>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${user.isBanned
                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                                        }`}>
                                        {user.isBanned ? 'BANNED' : 'ACTIVE'}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-400 mb-2">Join Date</h5>
                                <p className="text-white">{user.joinDate || 'Unknown'}</p>
                            </div>
                            <div className="p-4 bg-gray-700 rounded-lg">
                                <h5 className="text-sm font-medium text-gray-400 mb-2">User ID</h5>
                                <p className="text-white font-mono text-sm">{user._id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUpdateUserModal = (): JSX.Element => {
        if (!state.showUpdateModal || !state.selectedUser) return <></>;

        return (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Update User</h3>
                        <button
                            onClick={closeAllModals}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleUpdateUser} className="space-y-4">
                        {renderFormField(
                            "Username",
                            "username",
                            "text",
                            updateForm.username,
                            (value) => setUpdateForm(prev => ({ ...prev, username: value as string })),
                            updateFormErrors.username,
                            true,
                            "Enter username"
                        )}

                        {renderFormField(
                            "Email",
                            "email",
                            "email",
                            updateForm.email,
                            (value) => setUpdateForm(prev => ({ ...prev, email: value as string })),
                            updateFormErrors.email,
                            true,
                            "Enter email"
                        )}

                        {renderFormField(
                            "Phone Number",
                            "phone",
                            "tel",
                            updateForm.phone,
                            (value) => setUpdateForm(prev => ({ ...prev, phone: Number(value) as number })),
                            updateFormErrors.phone,
                            true,
                            "Enter phone number"
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Rank
                            </label>
                            <select
                                value={updateForm.rank}
                                onChange={(e) => setUpdateForm(prev => ({ ...prev, rank: e.target.value as UserRank }))}
                                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-violet-500 text-white ${updateFormErrors.rank ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            >
                                <option value="Unranked">Unranked</option>
                                <option value="Silver">Silver</option>
                                <option value="Gold">Gold</option>
                                <option value="Platinum">Platinum</option>
                                <option value="Diamond">Diamond</option>
                            </select>
                            {updateFormErrors.rank && <p className="text-red-400 text-xs mt-1">{updateFormErrors.rank}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Role <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={updateForm.role}
                                onChange={(e) => setUpdateForm(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-violet-500 text-white ${updateFormErrors.role ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {updateFormErrors.role && <p className="text-red-400 text-xs mt-1">{updateFormErrors.role}</p>}
                        </div>

                        {renderFormField(
                            "XP Points",
                            "xp",
                            "number",
                            updateForm.xp,
                            (value) => setUpdateForm(prev => ({ ...prev, xp: value as number })),
                            updateFormErrors.xp,
                            false,
                            "Enter XP points",
                            0
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={closeAllModals}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={state.loading}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {state.loading ? 'Updating...' : 'Update User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderCreateUserModal = (): JSX.Element => {
        if (!state.showCreateModal) return <></>;

        return (
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20 w-full max-w-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Create New User</h3>
                        <button
                            onClick={closeAllModals}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {state.error && (
                        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                            {state.error}
                        </div>
                    )}

                    <form onSubmit={handleCreateUser} className="space-y-4">
                        {renderFormField(
                            "Username",
                            "username",
                            "text",
                            createForm.username,
                            (value) => setCreateForm(prev => ({ ...prev, username: value as string })),
                            createFormErrors.username,
                            true,
                            "Enter username"
                        )}

                        {renderFormField(
                            "Email",
                            "email",
                            "email",
                            createForm.email,
                            (value) => setCreateForm(prev => ({ ...prev, email: value as string })),
                            createFormErrors.email,
                            true,
                            "Enter email"
                        )}

                        {renderFormField(
                            "Password",
                            "password",
                            "password",
                            createForm.password,
                            (value) => setCreateForm(prev => ({ ...prev, password: value as string })),
                            createFormErrors.password,
                            true,
                            "Enter password"
                        )}

                        {renderFormField(
                            "Phone Number",
                            "phone",
                            "tel",
                            createForm.phone,
                            (value) => setCreateForm(prev => ({ ...prev, phone: Number(value) as number })),
                            createFormErrors.phone,
                            true,
                            "Enter phone number"
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Rank
                            </label>
                            <select
                                value={createForm.rank}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, rank: e.target.value as UserRank }))}
                                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-violet-500 text-white ${createFormErrors.rank ? 'border-red-500' : 'border-gray-600'
                                    }`}
                            >
                                <option value="Unranked">Unranked</option>
                                <option value="Silver">Silver</option>
                                <option value="Gold">Gold</option>
                                <option value="Platinum">Platinum</option>
                                <option value="Diamond">Diamond</option>
                            </select>
                            {createFormErrors.rank && <p className="text-red-400 text-xs mt-1">{createFormErrors.rank}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Role <span className="text-red-400">*</span>
                            </label>
                            <select
                                value={createForm.role}
                                onChange={(e) => setCreateForm(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))}
                                className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-violet-500 text-white ${createFormErrors.role ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                required
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {createFormErrors.role && <p className="text-red-400 text-xs mt-1">{createFormErrors.role}</p>}
                        </div>

                        {renderFormField(
                            "XP Points",
                            "xp",
                            "number",
                            createForm.xp,
                            (value) => setCreateForm(prev => ({ ...prev, xp: value as number })),
                            createFormErrors.xp,
                            false,
                            "Enter XP points",
                            0
                        )}

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={closeAllModals}
                                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={state.loading}
                                className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {state.loading ? 'Creating...' : 'Create User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Error Message */}
            {state.error && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
                    {state.error}
                </div>
            )}

            {/* Loading Indicator */}
            {state.loading && (
                <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-3 rounded-lg">
                    Loading users...
                </div>
            )}

            {/* Header with Create Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <button
                    onClick={() => updateState({ showCreateModal: true })}
                    className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create User
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-purple-500/20">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="Search users by username or email..."
                            value={state.searchTerm}
                            onChange={handleSearchChange}
                            className="w-full pl-4 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-white placeholder-gray-400"
                        />
                    </div>
                    <select
                        value={state.filterStatus}
                        onChange={handleFilterChange}
                        className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-violet-500 text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="banned">Banned</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">XP/Rank</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Join Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-violet-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {state.users.map((user: User) => (
                                <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                {user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-white">{user.username}</div>
                                                <div className="text-sm text-gray-400">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-white">{user.xp?.toLocaleString() || 0} XP</div>
                                        <div className={`text-sm font-medium bg-gradient-to-r ${getRankColor(user.rank)} bg-clip-text text-transparent`}>
                                            {user.rank}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                        {user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'Unknown'}                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleViewUser(user._id)}
                                            className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded hover:bg-blue-500/10 transition-colors"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEditUser(user._id)}
                                            className="text-yellow-400 hover:text-yellow-300 px-3 py-1 rounded hover:bg-yellow-500/10 transition-colors"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleBanUser(user._id, user.isBanned)}
                                            className={`px-3 py-1 rounded transition-colors ${user.isBanned
                                                ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                                                : 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                                                }`}
                                        >
                                            {user.isBanned ? 'Unban' : 'Ban'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {state.totalPages > 1 && renderPagination()}
            </div>

            {/* Modals */}
            {renderCreateUserModal()}
            {renderViewUserModal()}
            {renderUpdateUserModal()}
        </div>
    );
};

export default UserManagement;