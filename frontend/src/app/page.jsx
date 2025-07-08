"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./components/Navbar";

const API_URL = 'http://localhost:5000/api/blog';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) {
      setError('Failed to fetch blog posts');
    }
    setLoading(false);
  };

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Our Blog</h1>
            <p className="text-gray-600 text-lg">Discover the latest articles and stories</p>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-blue-700">Latest Blog Posts</h2>

          {loading && (
            <div className="flex justify-center my-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-center">{error}</div>
          )}

          {posts.length === 0 && !loading && !error && (
            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-center mb-4">
              No blog posts yet. Login as admin to add one!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, idx) => (
              <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col" key={post._id || idx}>
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-52 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-blue-700 mb-2">{post.title}</h3>
                  <p className="text-gray-700 flex-1">{post.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;