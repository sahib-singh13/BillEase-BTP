// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        // Optional: Show a loading spinner while checking auth
        return (
             <div className="flex justify-center items-center min-h-screen">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
             </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/customerLogin" replace />;
};

export default ProtectedRoute;