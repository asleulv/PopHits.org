import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {

  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/reset-password/', {email})
      setSuccess(true);
    } catch (err) {
      setError('Email not in database. Did you even register for an account?'); 
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
      
      {success && <p className="text-green-500 mb-4">Check your email for reset link.</p>}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleResetPassword}>
        <label className="block text-gray-700">Email:</label>
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md" 
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mr-2 mt-4"
        >
          Reset Password
        </button>
      </form>

    </div>
  );
}

export default ForgotPassword;
