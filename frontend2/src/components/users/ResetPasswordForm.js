"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail(''); // Clear the email field after successful submission
    } catch (err) {
      setError('Email not in database. Did you even register for an account?');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-500 rounded-md">
          Check your email for reset link.
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleResetPassword}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email:</label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Processing...' : 'Reset Password'}
        </button>
      </form>

      <div className="mt-4 flex justify-between">
        <Link href="/login" className="text-pink-500 hover:text-pink-700 transition-colors duration-300">
          Back to Login
        </Link>
        <Link href="/register" className="text-pink-500 hover:text-pink-700 transition-colors duration-300">
          Create Account
        </Link>
      </div>
    </div>
  );
}
