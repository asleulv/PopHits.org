"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect to profile
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    try {
      // Call login API function
      await loginUser({ email, password });
      
      // Redirect to profile page on successful login
      router.push('/profile');
    } catch (error) {
      // Handle login error
      setLoginError('Invalid email or password');
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {loginError && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
          {loginError}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-2 px-4 rounded-md mr-2 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <Link href="/reset-password" className="text-amber-700 hover:amber-900 font-medium transition-colors duration-300">
          Forgot Password?
        </Link>
      </form>
      <p className="mt-4 text-gray-700">
        No account yet? <Link href="/register" className="text-amber-700 hover:amber-900 font-medium transition-colors duration-300">Register here</Link>
      </p>
    </div>
  );
}
