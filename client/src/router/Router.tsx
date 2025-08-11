import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from '@/pages/user/LandingPage';
import HomePage from '@/pages/user/HomePage';
import LoginPage from '@/pages/user/LoginPage';
import SignupPage from '@/pages/user/SignupPage';
import ForgotPasswordPage from '@/pages/user/ForgotPasswordPage';
import NotFoundPage from '@/pages/user/NotFoundPage';
import UserLayout from '@/components/_layouts/UserLayout';
import OTPVerificationPage from "@/pages/user/OtpSignupPage";
import SignUpSuccessPage from "@/pages/user/SignupSuccessPage";
import ResetPasswordPage from "@/pages/user/ResetPassword";
import ResetPasswordSuccessPage from "@/pages/user/ResetPasswordSuccessPage";
import { ProtectedRoute } from "./ProtectedRoutes";
import OtpForgotPasswordPage from '@/pages/user/OtpForgotPasswordPage'
// import { RequireSignup, RequireSignOTP } from './guards/RequireSignup'

import AdminLayout from '@/pages/admin/DashboardPage';
import GitHubCallback from "@/components/_auth/GithubCallback";
import GoogleCallback from "@/components/_auth/GoogleCallback";
import PublicRoute from "./PublicRoutes";
import BannedPage from "@/pages/BannedPage";
import ProfilePage from "@/pages/user/ProfilePage";

const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<UserLayout />}>
                    <Route index element={<LandingPage />} />
                    <Route element={<ProtectedRoute role="user" />}>
                        <Route path="/home" element={<HomePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Route>
                </Route>


                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/otp-sign" element={<OTPVerificationPage />} />
                    <Route path="/signup-success" element={<SignUpSuccessPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/verify-reset-code" element={<OtpForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/reset-password-success" element={<ResetPasswordSuccessPage />} />
                    <Route path="/auth/github/callback" element={<GitHubCallback />} />
                    <Route path="/auth/google/callback" element={<GoogleCallback />} />
                </Route>

                <Route element={<ProtectedRoute role="admin" />}>
                    <Route path="/admin/dashboard" element={<AdminLayout />}></Route>
                </Route>

                <Route path="/banned" element={<BannedPage />} />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
};


export default AppRouter;
