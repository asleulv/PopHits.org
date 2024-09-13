import React, { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../../services/api";

const ProfileUpdate = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const response = await getUserProfile(authToken);
        const { username, email } = response.user_data;
        setFormData({ ...formData, username, email });
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      // Basic form validation
      if (
        !formData.username ||
        !formData.email ||
        !formData.password ||
        formData.password !== formData.confirmPassword
      ) {
        setError("Please fill in all fields and make sure passwords match.");
        return;
      }
  
      const { username, email, password, confirmPassword } = formData;
      const updatedData = { username, email, password, confirmPassword };
  
      const response = await updateUserProfile(updatedData);
      setSuccess("Profile updated successfully!");
      setError(null);
      console.log("Profile updated:", response);
    } catch (error) {
      setError("Profile update failed. Please try again.");
      setSuccess(null);
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl md:text-4xl font-cherry font-bold mb-6 text-center">Update Profile</h2>
      <div className="mb-4">
        <label className="block mb-1">Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Password:</label>
        <input
          type="password"
          name="password"
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Confirm Password:</label>
        <input
          type="password"
          name="confirmPassword"
          onChange={handleInputChange}
          className="border border-gray-300 px-3 py-2 rounded-md w-full"
        />
      </div>
      <button
        onClick={handleUpdateProfile}
        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600"
      >
        Update
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default ProfileUpdate;
