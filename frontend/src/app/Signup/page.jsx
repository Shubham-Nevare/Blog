"use client"
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/user/signup', { name, email, password });
      router.push('/Login');
    } catch (err) {
      console.error('Signup error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.response?.data?.details || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Create an Account</h1>
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;