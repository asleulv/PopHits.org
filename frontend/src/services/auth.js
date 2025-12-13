import axios from 'axios';
import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, useContext, createContext } from 'react';

// Base url
let BASE_URL = 'https://pophits.org'; // Default to production URL

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:8000'; // Use local URL for development
}

const AuthApi = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const getAuthToken = () => localStorage.getItem('authToken');
  const [authToken, setAuthToken] = useState(getAuthToken);
  const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
  const [key, setKey] = useState(0);

  const updateAuthToken = useCallback((newToken) => {
    console.log('Updating auth token:', newToken);
    localStorage.setItem('authToken', newToken);
    setAuthToken(newToken);
    setIsAuthenticated(!!newToken);
    setKey((prevKey) => prevKey + 1); // Increment the key to force a remount
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = getAuthToken();
      if (newToken !== authToken) {
        updateAuthToken(newToken);
      }
    };

    // Listen for changes to localStorage
    window.addEventListener('storage', handleStorageChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [authToken, updateAuthToken]);

  const registerUser = async (userData) => {
    try {
      const response = await AuthApi.post('register/', userData);
      const { token, message } = response.data;
      updateAuthToken(token);
      return { token, message };
    } catch (error) {
      throw error;
    }
  };

  const loginUser = async (credentials) => {
    try {
      const response = await AuthApi.post('login/', credentials);
      const { token, message } = response.data;
      updateAuthToken(token);
      return { token, message };
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (usernameOrEmail) => {
    try {
      const response = await AuthApi.post('reset-password/', { usernameOrEmail });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      // Clear the token from local storage on logout
      localStorage.removeItem('authToken');
      setAuthToken(null);
      setIsAuthenticated(false);
      setKey((prevKey) => prevKey + 1); // Increment the key to force a remount

      const response = await AuthApi.post('logout/');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    isAuthenticated,
    updateAuthToken,
    registerUser,
    loginUser,
    resetPassword,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

