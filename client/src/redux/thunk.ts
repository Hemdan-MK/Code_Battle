// redux/thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    loginAPI,
    resendOTPAPI,
    signupAPI,
    verifyOTPAPI,
    googleAuthAPI,
    githubAuthAPI,
} from "@/services/auth";

import {
    removeToken,
    removeTempToken,
    removeTempUser,
    setTempUser,
    setToken,
    setTempToken,
    setUser,
    removeUser,
    logout,
    setRefreshToken,
    removeRefreshToken,
    setAdmin,
} from "@/utils/tokenUtils";
import { isDataView } from "util/types";

interface LoginData {
    email: string;
    password: string;
}

export const loginThunk = createAsyncThunk(
    "auth/login",
    async (data: LoginData, thunkAPI) => {
        try {
            console.log('Attempting login with:', { email: data.email });

            const response = await loginAPI(data);

            console.log('Login API response:', response);

            // Store the token in localStorage/sessionStorage
            if (response.token) {
                setToken(response.token);
            }

            // Store refresh token if available
            if (response.refreshToken) {
                setRefreshToken(response.refreshToken)
            }

            if (response.isAdmin) {
                await setAdmin(response.user);
            } else {
                await setUser(response.user);
            }

            return response;
        } catch (error: any) {
            console.error('Login thunk error:', error);

            // Remove any existing tokens on login failure
            removeToken();
            removeRefreshToken()

            let errorMessage = "Login failed. Please try again.";

            // Handle different types of errors
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);


export const signupThunk = createAsyncThunk(
    "auth/signup",
    async (
        data: {
            username: string;
            email: string;
            password: string;
            phoneNumber: string;
        },
        thunkAPI
    ) => {
        try {
            const response = await signupAPI(data);
            console.log(response);

            setTempUser(response.user);
            setTempToken(response.tempToken);

            return {
                ...response,
                requiresOTP: true,
            };
        } catch (error) {
            removeToken();

            let errorMessage = "Signup failed. Please try again.";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// resend OTP thunk
export const resendOTPThunk = createAsyncThunk(
    "auth/resendOTP",
    async (data: { method: "email" | "phone"; tempToken: string }, thunkAPI) => {
        try {
            const response = await resendOTPAPI(data);
            return response;
        } catch (error) {
            let errorMessage = "Failed to resend OTP. Please try again.";
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// OTP verification thunk
export const verifyOTPThunk = createAsyncThunk(
    "auth/verifyOTP",
    async (
        data: { otp: string; tempToken: string; method: "email" | "phone" },
        thunkAPI
    ) => {
        try {
            const response = await verifyOTPAPI(data);

            removeTempToken();
            removeTempUser();
            
            setToken(response.token);
            setUser(response.user);
            setRefreshToken(response.refreshToken);

            return response;
        } catch (error) {
            let errorMessage = "OTP verification failed. Please try again.";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const googleAuthThunk = createAsyncThunk(
    "auth/googleAuth",
    async (data: { credential: string }, thunkAPI) => {
        try {
            const response = await googleAuthAPI(data);

            await setToken(response.token);
            await setRefreshToken(response.refreshToken)

            if (response.isAdmin) {
                await setAdmin(response.user);
            } else {
                await setUser(response.user);
            }

            return response;
        } catch (error) {
            removeToken();

            let errorMessage = "Google authentication failed. Please try again.";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const githubAuthThunk = createAsyncThunk(
    "auth/githubAuth",
    async (data: { code: string }, thunkAPI) => {
        try {
            const response = await githubAuthAPI(data);

            await setToken(response.token);
            await setRefreshToken(response.refreshToken)

            if (response.isAdmin) {
                await setAdmin(response.user);
            } else {
                await setUser(response.user);
            }

            return response;
        } catch (error) {
            removeToken();

            let errorMessage = "GitHub authentication failed. Please try again.";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            // await logoutAPI();
            await logout()

            return null;
        } catch (error) {
            removeToken();

            let errorMessage = "Logout failed";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
