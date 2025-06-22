// ConfirmResetPassword.js

import { useState } from 'react';
import axios from 'axios';

function ConfirmResetPassword({ uid, token }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const url = `/api/confirm-reset-password/${uid}/${token}/`;

      await axios.post(url, {
        new_password: password
      });

      setSuccess(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 px-6 py-8 bg-white shadow-md rounded-lg">
      {success && <p className="text-green-500 mb-4">Password reset successful!</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 mb-4 border rounded"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ConfirmResetPassword;