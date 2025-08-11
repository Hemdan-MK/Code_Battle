import { getAdmin, getToken, getUser, isTokenExpired, logout } from "@/utils/tokenUtils";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role: "user" | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const token = getToken();

  // Check if token is expired
  if (token && isTokenExpired(token)) {
    logout()
    return <Navigate to="/login" replace />;
  }

  const isAuthenticated =
    role === "user"
      ? getUser() && token
      : role === "admin"
        ? getAdmin() && token
        : false;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};