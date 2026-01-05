"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, UserCog, ShieldCheck, AlertTriangle } from "lucide-react";

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

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

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
      if (!formData.username || !formData.email) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }
      
      if (formData.password && formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
  
      const updateData = {
        username: formData.username,
        email: formData.email,
      };
      
      if (formData.password) {
        updateData.password = formData.password;
      }
  
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
      setFormData({ ...formData, password: '', confirmPassword: '' });
    } catch (error) {
      console.error("Profile update failed:", error);
      setError(error.message || "Profile update failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated && !isLoading) return null;

  return (
    <div className="max-w-2xl mx-auto mt-12 pb-20 px-4 animate-in fade-in duration-700">
      {/* 1. Header Section */}
      <div className="text-center mb-10 space-y-2">
        <h2 className="inline-block bg-black text-white px-4 py-1 text-xs font-black italic uppercase tracking-[0.2em]">
          Personnel Modification
        </h2>
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-black block">
          Update Dossier
        </h1>
      </div>

      <div className="bg-[#fdfbf7] border-4 border-black p-6 md:p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        
        {/* Status Messages */}
        {error && (
          <div className="mb-8 p-4 bg-red-600 text-white border-2 border-black flex items-center gap-3 animate-shake">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <span className="font-black uppercase italic text-sm tracking-tight">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-8 p-4 bg-green-500 text-black border-2 border-black flex items-center gap-3 animate-in zoom-in-95 duration-300">
            <ShieldCheck className="w-6 h-6 shrink-0" />
            <span className="font-black uppercase italic text-sm tracking-tight">{success}</span>
          </div>
        )}
        
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          
          {/* Group 1: Identity */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <UserCog className="w-5 h-5" />
              <h3 className="font-black uppercase italic text-lg tracking-tighter">Core Identity</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="bg-white border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Group 2: Security */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b-2 border-black pb-2">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="font-black uppercase italic text-lg tracking-tighter">Security Credentials</h3>
            </div>
            
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest italic leading-tight">
              Leave password fields blank unless requesting a credential reset.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="bg-white border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/50">Confirm Reset</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="bg-white border-2 border-black p-3 font-bold focus:bg-yellow-50 outline-none transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-1 focus:translate-y-1"
                />
              </div>
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto bg-black text-white px-10 py-4 font-black uppercase italic text-xl tracking-tighter hover:bg-amber-500 hover:text-black transition-all active:translate-y-1 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Processing...
                </>
              ) : (
                'Commit Changes'
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center text-[10px] font-black uppercase tracking-[0.3em] text-black/20 italic">
        PopHits.org Archive Security Protocol // 2026
      </div>
    </div>
  );
}