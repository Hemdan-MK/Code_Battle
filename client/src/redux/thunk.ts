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
    logout,
    setAdmin,
    getTempToken,
} from "@/utils/tokenUtils";

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

            let errorMessage = "Login failed. Please try again.";

            // Handle different types of errors
            // if (error?.response?.data?.message) {
            //     errorMessage = error.response.data.message;
            // } else if (error?.message) {
            //     errorMessage = error.message;
            // } else if (typeof error === 'string') {
            //     errorMessage = error;
            // }

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
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

            removeTempUser()

            const response = await signupAPI(data);

            setTempUser(response.user);
            setTempToken(response.tempToken);

            return {
                ...response,
                requiresOTP: true,
            };
        } catch (error: any) {
            removeToken();

            let errorMessage = "Signup failed. Please try again.";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

// resend OTP thunk
export const resendOTPThunk = createAsyncThunk(
    "auth/resendOTP",
    async (_, thunkAPI) => {
        try {
            const tempToken = await getTempToken()
            const response = await resendOTPAPI({ tempToken });
            return response;
        } catch (error) {
            let errorMessage = "Failed to resend OTP. Please try again.";
            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
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
        data: { otp: string },
        thunkAPI
    ) => {
        try {
            const tempToken = await getTempToken()

            const response = await verifyOTPAPI({
                otp: data.otp,
                tempToken
            });

            removeTempToken();
            removeTempUser();

            setToken(response.token);
            setUser(response.user);

            return response;
        } catch (error) {
            let errorMessage = "OTP verification failed. Please try again.";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
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

            if (response.isAdmin) {
                await setAdmin(response.user);
            } else {
                await setUser(response.user);
            }

            return response;
        } catch (error) {
            removeToken();

            let errorMessage = "Google authentication failed. Please try again.";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
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

            if (response.isAdmin) {
                await setAdmin(response.user);
            } else {
                await setUser(response.user);
            }

            return response;
        } catch (error) {
            removeToken();

            let errorMessage = "GitHub authentication failed. Please try again.";

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
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

            if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }


            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);
