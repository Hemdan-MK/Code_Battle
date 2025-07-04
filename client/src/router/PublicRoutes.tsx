import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken, getUser } from '@/utils/tokenUtils';

const PublicRoute: React.FC = () => {
    const user = getUser();
    const token = getToken();
    const isAuthenticated = user && token;
    console.log("isAuthenticated : ", isAuthenticated);
    

    return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoute;
