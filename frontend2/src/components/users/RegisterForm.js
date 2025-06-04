"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterForm() {
  const { registerUser, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verification: "",
  });
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to check if the username is invalid
  const isInvalidUsername = (username) => {
    const invalidUsernames = ["admin", "administrator", "pophits.org"]; // Add more invalid usernames as needed
    return invalidUsernames.includes(username);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Basic form validation
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        formData.password !== formData.confirmPassword
      ) {
        setError("Please fill in all fields correctly.");
        setIsLoading(false);
        return;
      }
      
      // Verification check
      if (formData.verification.toLowerCase() !== "abba") {
        setError("Verification answer is incorrect.");
        setIsLoading(false);
        return;
      }
      
      // Username validation
      if (isInvalidUsername(formData.username.toLowerCase())) {
        setError("This username is not allowed. Please choose a different one.");
        setIsLoading(false);
        return;
      }

      // Register the user
      await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      setSuccess("🥳 Registration successful, please check your email");
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, redirect to profile
  if (isAuthenticated) {
    router.push('/profile');
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      
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
      
      <form onSubmit={handleRegistration}>
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
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">
            Who had the hit "Dancing Queen"?
          </label>
          <input
            type="text"
            name="verification"
            value={formData.verification}
            onChange={handleInputChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      
      <p className="mt-4 text-gray-700">
        Already have an account? <Link href="/login" className="text-pink-500 hover:text-pink-700 transition-colors duration-300">Login here</Link>
      </p>
    </div>
  );
}
