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

export const { logout, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;

// // redux/slice.ts
// import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
// import { loginThunk, signupThunk, logoutThunk, verifyOTPThunk, resendOTPThunk, googleAuthThunk } from "./thunk";

// interface User {
//     id: string;
//     name: string;
//     email: string;
//     username?: string;
//     phoneNumber?: string;
// }

// interface AuthState {
//     user: User | null;
//     token: string | null;
//     refreshToken: string | null;
//     tempToken: string | null;
//     loading: boolean;
//     error: string | null;
// }

// const initialState: AuthState = {
//     user: null,
//     token: null,
//     refreshToken: null,
//     tempToken: null,
//     loading: false,
//     error: null,
// };

// const authSlice = createSlice({
//     name: "auth",
//     initialState,
//     reducers: {
//         logout(state) {
//             state.user = null;
//             state.token = null;
//             state.refreshToken = null;
//             state.tempToken = null;
//             state.error = null;
//             state.loading = false;
//         },
//         clearError(state) {
//             state.error = null;
//         },
//         setUser(state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) {
//             state.user = action.payload.user;
//             state.token = action.payload.token;
//             if (action.payload.refreshToken) {
//                 state.refreshToken = action.payload.refreshToken;
//             }
//             state.error = null;
//         },
//         setLoading(state, action: PayloadAction<boolean>) {
//             state.loading = action.payload;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Login cases
//             .addCase(loginThunk.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(loginThunk.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 state.refreshToken = action.payload.refreshToken;
//                 state.error = null;
//             })
//             .addCase(loginThunk.rejected, (state, action) => {
//                 state.loading = false;
//                 state.user = null;
//                 state.token = null;
//                 state.refreshToken = null;
//                 state.error = action.payload as string;
//             })

//             // Signup cases
//             .addCase(signupThunk.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(signupThunk.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.user = action.payload.user;
//                 state.tempToken = action.payload.tempToken;
//                 state.error = null;
//             })
//             .addCase(signupThunk.rejected, (state, action) => {
//                 state.loading = false;
//                 state.user = null;
//                 state.token = null;
//                 state.refreshToken = null;
//                 state.error = action.payload as string;
//             })

//             // Logout cases
//             .addCase(logoutThunk.pending, (state) => {
//                 state.loading = true;
//             })
//             .addCase(logoutThunk.fulfilled, (state) => {
//                 state.user = null;
//                 state.token = null;
//                 state.refreshToken = null;
//                 state.tempToken = null;
//                 state.loading = false;
//                 state.error = null;
//             })
//             .addCase(logoutThunk.rejected, (state, action) => {
//                 // Even if logout fails on server, clear local state
//                 state.user = null;
//                 state.token = null;
//                 state.refreshToken = null;
//                 state.tempToken = null;
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })

//             // OTP Verification cases
//             .addCase(verifyOTPThunk.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(verifyOTPThunk.fulfilled, (state, action) => {
//                 state.user = action.payload.user;
//                 state.token = action.payload.token;
//                 state.refreshToken = action.payload.refreshToken;
//                 state.tempToken = null;
//                 state.loading = false;
//                 state.error = null;
//             })
//             .addCase(verifyOTPThunk.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })

//             // Resend OTP cases
//             .addCase(resendOTPThunk.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(resendOTPThunk.fulfilled, (state) => {
//                 state.loading = false;
//                 state.error = null;
//             })
//             .addCase(resendOTPThunk.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string;
//             })
//             .addCase(googleAuthThunk.fulfilled,(state,action)=>{
//                 state.loading = false;
//                 state.error = null;
//                 state.user = state.user = action.payload.user
//             })
//     },
// });

// export const { logout, clearError, setUser, setLoading } = authSlice.actions;
// export default authSlice.reducer;


