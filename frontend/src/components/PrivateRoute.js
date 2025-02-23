import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, roles = [] }) => {
    const location = useLocation();
    
    // Mock user with admin privileges to bypass authentication
    const mockUser = {
        role: 'super_admin'
    };

    // Bypass authentication check and use mock user
    if (roles.length > 0 && !roles.includes(mockUser.role)) {
        // Role not authorized, redirect to home page
        return <Navigate to="/" replace />;
    }

    // Authorized, render component
    return children;
};

export default PrivateRoute;
