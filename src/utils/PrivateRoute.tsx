import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface PrivateRouteProps {
    requiredPermission?: string;
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredPermission, children }) => {
    const { isAuthenticated, isLoading} = useAuth0();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return <>{children}</>;
};

export default PrivateRoute;
