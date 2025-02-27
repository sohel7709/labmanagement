import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';

const RoleContext = createContext();

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifySession(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifySession = async (token) => {
    try {
      const response = await axios.get('/api/auth/verify-session', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Session verification failed');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const hasPermission = (permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const hasRole = (role) => {
    return user?.role === role;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    hasPermission,
    hasRole
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
};

export default RoleContext;
