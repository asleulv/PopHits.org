"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileUpdateForm() {
  const { authToken, user, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Populate form with user data when available
  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Basic form validation
      if (
        !formData.username ||
        !formData.email
      ) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }
      
      // Check if passwords match if provided
      if (formData.password && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
  
      // Prepare data for update
      const updateData = {
        username: formData.username,
        email: formData.email,
      };
      
      // Only include password if provided
      if (formData.password) {
        updateData.password = formData.password;
      }
  
      // Call API to update profile
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authToken}`,
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Profile update failed');
      }
      
      setSuccess("Profile updated successfully!");
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      setError(error.message || "Profile update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated && !isLoading) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-md">
          {success}
        </div>
      )}
      
      <form onSubmit={handleUpdateProfile}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">New Password (leave blank to keep current):</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirm New Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
