// services/auth/index.ts

import { getTempToken, removeTempToken, setTempToken } from "@/utils/tokenUtils";

import api from "../_axios/axios";

export interface AuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        phoneNumber: string;
    };
    isAdmin?: boolean;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface SignupRequest {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
}

interface SignupResponse {
    success: boolean;
    message: string;
    tempToken: string;
    user: {
        id: string;
        email: string;
        username: string;
        phoneNumber: string;
    };
}

interface OTPVerificationRequest {
    otp: string;
    tempToken: string;
}

interface OTPVerificationResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        phoneNumber: string;
    };
}

interface ResendOTPRequest {
    tempToken: string;
}

interface GoogleAuthRequest {
    credential: string;
}

interface GoogleAuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        phoneNumber: string;
    };
    isAdmin?: boolean;
}

interface GitHubAuthRequest {
    code: string;
}

interface GitHubAuthResponse {
    success: boolean;
    message: string;
    token: string;
    user: {
        id: string;
        email: string;
        username: string;
        phoneNumber: string;
    };
    isAdmin?: boolean;
}

// Forgot Password Interfaces
interface ForgotPasswordRequest {
    email: string;
}

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    userExists: boolean;
    tempToken?: string;
}

interface VerifyResetCodeRequest {
    email: string;
    otp: string;
}

interface VerifyResetCodeResponse {
    success: boolean;
    message: string;
    isCorrect: boolean;
}



interface APIResponse {
    success: boolean;
    message: string;
}

// Test server connection
export const testConnection = async (): Promise<boolean> => {
    try {
        const response = await api.get("/test");
        console.log("Server connection test:", response.data);
        return true;
    } catch (error) {
        console.error("Server connection failed:", error);
        return false;
    }
};

export const loginAPI = async (data: LoginRequest): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>("/auth/login", data);
        console.log("Login response status:", response);

        return response.data;
    } catch (error) {
        console.error("Login API Error:", error);
        throw error;
    }
};

export const signupAPI = async (
    data: SignupRequest
): Promise<SignupResponse> => {
    try {
        const response = await api.post("/auth/signup", data);
        console.log("Signup response :", response.data);

        return response.data;
    } catch (error) {
        console.error("Signup API Error:", error);
        throw error;
    }
};

// OTP verification part
export const verifyOTPAPI = async (
    data: OTPVerificationRequest
): Promise<OTPVerificationResponse> => {
    try {
        const response = await api.post<AuthResponse>(
            "/auth/otp-sign",
            data
        );

        console.log("OTP verification response status:", response.status);

        return response.data;
    } catch (error) {
        console.error("OTP Verification API Error:", error);
        throw error;
    }
};

// Resend OTP API
export const resendOTPAPI = async (
    data: ResendOTPRequest
): Promise<APIResponse> => {
    try {
        const response = await api.post<APIResponse>(
            "/auth/resend-otp",
            {
                tempToken: data.tempToken,
                where: "signUp"
            }
        );

        console.log("Resend OTP response status:", response.status);

        return response.data;
    } catch (error) {
        console.error("Resend OTP API Error:", error);
        throw error;
    }
};

export const googleAuthAPI = async (
    data: GoogleAuthRequest
): Promise<GoogleAuthResponse> => {
    try {
        const response = await api.post<GoogleAuthResponse>("/auth/google", data);
        console.log("Google Auth response status:", response.status);

        return response.data;
    } catch (error) {
        console.error("Google Auth API Error:", error);
        throw error;
    }
};

export const githubAuthAPI = async (
    data: GitHubAuthRequest
): Promise<GitHubAuthResponse> => {
    try {
        const response = await api.post<GitHubAuthResponse>("/auth/github", data);
        console.log("GitHub Auth response status:", response.status);

        return response.data;
    } catch (error) {
        console.error("GitHub Auth API Error:", error);
        throw error;
    }
};

// ===== FORGOT PASSWORD FUNCTIONALITY =====

// Step 1: Send forgot password request and check if user exists
export const forgotPasswordAPI = async (
    data: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
    try {
        const response = await api.post<ForgotPasswordResponse>(
            "/auth/forgot-password",
            data
        );

        setTempToken(response.data.tempToken)

        return response.data;
    } catch (error) {
        console.error("Forgot Password API Error:", error);
        throw error;
    }
};

export const verifyResetCodeAPI = async (data: VerifyResetCodeRequest): Promise<VerifyResetCodeResponse> => {
    try {
        const tempToken = getTempToken()
        const response = await api.post<VerifyResetCodeResponse>(
            "/auth/verify-reset-code",
            {
                ...data,
                tempToken
            }
        );
        console.log("Verify reset code response status:", response.status);

        return response.data;
    } catch (error) {
        console.error("Verify Reset Code API Error:", error);
        throw error;
    }
};


export const resetPasswordAPI = async (
    data: string
): Promise<APIResponse> => {
    try {
        const tempToken = getTempToken()

        const response = await api.post<APIResponse>(
            "/auth/reset-new-password",
            {
                password: data,
                tempToken
            }
        );
        console.log("Reset password response status:", response.status);

        removeTempToken()
        return response.data;
    } catch (error) {
        console.error("Reset Password API Error:", error);
        throw error;
    }
};

export const resendResetCodeAPI = async (): Promise<APIResponse> => {
    try {

        const tempToken = getTempToken()

        const response = await api.post<APIResponse>(
            "/auth/resend-reset-code",
            {
                tempToken,
                where: "forgot"
            }

        );
        console.log("Resend reset code response status:", response.status);

        return response.data;
    } catch (error) {
        console.error("Resend Reset Code API Error:", error);
        throw error;
    }
};
