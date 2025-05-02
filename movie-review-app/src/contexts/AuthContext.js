import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuthenticated(true);
    }
  }, [token]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(config.ENDPOINTS.LOGIN, {
        username,
        password
      });

      if (response.data.success) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        axios.defaults.headers.common['Authorization'] = token;
        setIsAuthenticated(true);
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Login failed' };
    }
  };

  const signup = async (name, username, password) => {
    try {
      const response = await axios.post(config.ENDPOINTS.SIGNUP, {
        name,
        username,
        password
      });

      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Signup failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 