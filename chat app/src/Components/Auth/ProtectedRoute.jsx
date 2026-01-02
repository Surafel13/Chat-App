import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../Context/UserContext';

const ProtectedRoute = ({ requiresVerification = true }) => {
    const { user } = useUser();

    // If no user is logged in, redirect to login page
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If user is logged in but not verified (and verification is required for this route)
    if (requiresVerification && !user.emailVerified) {
        return <Navigate to="/verification" replace />;
    }

    // If user is logged in and verified (or verification not required), render children
    return <Outlet />;
};

export default ProtectedRoute;
