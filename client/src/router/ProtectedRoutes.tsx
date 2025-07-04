import { getAdmin, getToken, getUser } from "@/utils/tokenUtils";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  role: "user" | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const token = getToken();

  const isAuthenticated =
    role === "user"
      ? getUser() && token
      : role === "admin"
      ? getAdmin() && token
      : false;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};