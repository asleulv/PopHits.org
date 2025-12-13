import React, { useState } from "react";
import { useAuth } from "../../services/auth";

const RegistrationForm = () => {
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    verification: "", // New field for verification
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = async () => {
    try {
      // Basic form validation
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        formData.password !== formData.confirmPassword ||
        formData.verification.toLowerCase() !== "abba" || // Verification check
        isInvalidUsername(formData.username.toLowerCase()) // Username validation
      ) {
        setError("Please fill in all fields correctly.");
        return;
      }

      const user = await registerUser(formData);
      setSuccess("🥳 Registration successful, please check your email ");
      setError(null);
      console.log("User registered:", user);
    } catch (error) {
      if (error.response && error.response.data.detail) {
        setError(error.response.data.detail);
      } else {
        setError("Registration failed. Please try again.");
      }
      setSuccess(null);
      console.error("Registration failed:", error);
    }
  };

  // Function to check if the username is invalid
  const isInvalidUsername = (username) => {
    const invalidUsernames = ["admin", "administrator", "pophits.org"]; // Add more invalid usernames as needed
    return invalidUsernames.includes(username);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <div className="mb-4">
        <label className="block text-gray-700">Username:</label>
        <input
          type="text"
          name="username"
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Email:</label>
        <input
          type="email"
          name="email"
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">
          Who had the hit "Dancing Queen"?
        </label>
        <input
          type="text"
          name="verification"
          onChange={handleInputChange}
          className="mt-1 p-2 w-full border rounded-md"
        />
      </div>
      <button
        onClick={handleRegistration}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
      >
        Register
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default RegistrationForm;
