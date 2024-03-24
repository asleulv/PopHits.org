import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(null); // State variable to track login error
  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async () => {
    try {
      // Call login API function
      const { token } = await loginUser({ email, password });
      
      // Authentication succeeded
      setLoginError(null); // Clear any previous login error
    } catch (error) {
      // Handle login error
      setLoginError('Invalid email or password'); // Set login error message
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      {loginError && (
        <div className="mb-4 text-red-500">{loginError}</div>
      )}
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mr-2"
        >
          Login
        </button>
        <Link to="/reset-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
      </form>
      <p className="mt-4 text-gray-700">No account yet? <Link to="/register" className="text-blue-500 hover:underline">Register here</Link></p>
    </div>
  );
};

export default Login;
