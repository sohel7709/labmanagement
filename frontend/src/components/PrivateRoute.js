import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = ({ component: Component, requiredRole = null, requiredPermission = null, ...rest }) => {
  const { user, loading, hasRole, hasPermission } = useRole();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Route
      {...rest}
      render={props => {
        if (!user) {
          // Not logged in, redirect to login page with return url
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location }
              }}
            />
          );
        }

        if (requiredRole && !hasRole(requiredRole)) {
          // Role doesn't match, redirect to home page
          return <Redirect to="/" />;
        }

        if (requiredPermission && !hasPermission(requiredPermission)) {
          // Permission missing, redirect to home page
          return <Redirect to="/" />;
        }

        // Authorized, render component
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
