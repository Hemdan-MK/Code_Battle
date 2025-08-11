// redux/slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginThunk, signupThunk, logoutThunk, verifyOTPThunk, resendOTPThunk, googleAuthThunk } from "./thunk";

interface AuthState {
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.error = null;
            state.loading = false;
        },
        clearError(state) {
            state.error = null;
        },
        addError(state, action: PayloadAction<string>) {
            state.error = action.payload
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Signup cases
            .addCase(signupThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signupThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signupThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Logout cases
            .addCase(logoutThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // OTP Verification cases
            .addCase(verifyOTPThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOTPThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyOTPThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Resend OTP cases
            .addCase(resendOTPThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resendOTPThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resendOTPThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Google Auth cases
            .addCase(googleAuthThunk.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
    },
});

export const { logout, clearError, setLoading,addError } = authSlice.actions;
export default authSlice.reducer;
