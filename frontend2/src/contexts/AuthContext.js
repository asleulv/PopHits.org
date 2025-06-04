"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Create the auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  
  // Get auth token from localStorage (only on client side)
  const getAuthToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }, []);
  
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on component mount
  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);
    setIsAuthenticated(!!token);
    setLoading(false);
    
    if (token) {
      fetchUserProfile(token);
    }
  }, [getAuthToken]);

  // Update auth token in localStorage and state
  const updateAuthToken = useCallback((newToken) => {
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('authToken', newToken);
      } else {
        localStorage.removeItem('authToken');
      }
    }
    
    setAuthToken(newToken);
    setIsAuthenticated(!!newToken);
  }, []);

  // Fetch user profile data
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // If profile fetch fails, log out the user
        updateAuthToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      updateAuthToken(null);
      setUser(null);
    }
  };

  // Register a new user
  const registerUser = async (userData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      
      const { token, message } = data;
      updateAuthToken(token);
      
      if (token) {
        await fetchUserProfile(token);
      }
      
      return { token, message };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Login a user
  const loginUser = async (credentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      const { token, message } = data;
      updateAuthToken(token);
      
      if (token) {
        await fetchUserProfile(token);
      }
      
      return { token, message };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }
      
      return data;
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Logout a user
  const logoutUser = async () => {
    try {
      if (authToken) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Token ${authToken}`,
            'Content-Type': 'application/json',
          },
        });
      }
      
      updateAuthToken(null);
      setUser(null);
      router.push('/');
      
      return { message: 'Logout successful' };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear the token even if the API call fails
      updateAuthToken(null);
      setUser(null);
      throw error;
    }
  };

  // Context value
  const value = {
    isAuthenticated,
    authToken,
    user,
    loading,
    registerUser,
    loginUser,
    resetPassword,
    logoutUser,
    updateAuthToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
