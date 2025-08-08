"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "./components/Navbar";
import Link from 'next/link';
import { BLOG_TYPES, typeBadgeStyles } from './data';
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/blog`;


const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_URL}?status=published`);
      setPosts(res.data);
      console.log('Total published blogs:', res.data.length);
    } catch (err) {
      setError('Failed to fetch blog posts');
    }
    setLoading(false);
  };

  const defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&rounded=true';
  function timeAgo(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  }

  // Only show published blogs
  const publishedPosts = posts.filter(post => post.status === 'published');

  // Find most recent published blog that matches the filter
  const filteredSortedPosts = filterType
    ? publishedPosts.filter(post => post.type === filterType).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [...publishedPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentBlog = filteredSortedPosts[0];
  // Grid: all matching blogs except the big card
  const gridPosts = filteredSortedPosts.slice(1);

  return (
    <>
      <main className="flex min-h-screen items-center justify-center bg-gray-50 pt-10">
        <div className="mx-auto max-w-4xl px-4 py-8 w-full">
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
            </div>
          )}
          {!loading && (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to Our Blog</h1>
                <p className="text-gray-600 text-lg">Discover the latest articles and stories</p>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-blue-700">Latest Blog Posts</h2>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900 w-full md:w-60"
                >
                  {BLOG_TYPES.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Recent Blog Highlight */}
              {recentBlog && (
                <Link href={`/${recentBlog._id}`} className="block bg-white shadow-lg rounded-lg overflow-hidden mb-8 group hover:shadow-2xl transition-shadow">
                  <div className="relative">
                    {recentBlog.type && (
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeStyles[recentBlog.type] || 'bg-gray-200 text-gray-700'}`}>
                        {recentBlog.type}
                      </span>
                    )}
                    {recentBlog.image && (
                      <img
                        src={recentBlog.image}
                        alt={recentBlog.title}
                        className="w-full h-72 object-cover group-hover:scale-105 transition-transform"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-blue-700 mb-2">{recentBlog.title}</h3>
                    <p className="text-gray-700 mb-4">
                      {recentBlog.desc.length > 180
                        ? <>{recentBlog.desc.slice(0, 180)}...<span className="text-blue-600 font-semibold ml-1">Read more</span></>
                        : recentBlog.desc}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <img src={recentBlog.authorImg || "default-avatar.webp"} alt={recentBlog.author || 'Admin'} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-base font-medium text-gray-900">{recentBlog.author || 'Admin'}</span>
                      <span className="text-gray-400 text-sm">• {timeAgo(recentBlog.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gridPosts.map((post, idx) => (
                  <Link href={`/${post._id}`} key={post._id || idx} className="bg-white shadow rounded-lg overflow-hidden flex flex-col relative cursor-pointer hover:shadow-lg transition-shadow">
                    {post.type && (
                      <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeStyles[post.type] || 'bg-gray-200 text-gray-700'}`}>
                        {post.type}
                      </span>
                    )}
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-52 object-cover"
                      />
                    )}
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-blue-700 mb-2">{post.title}</h3>
                      <p className="text-gray-700 flex-1">
                        {post.desc.length > 120
                          ? <>
                              {post.desc.slice(0, 120)}...<span className="text-blue-600 font-semibold ml-1">Read more</span>
                            </>
                          : post.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-4">
                        <img src={post.authorImg || "default-avatar.webp"} alt={post.author || 'Admin'} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm font-medium text-gray-900">{post.author || 'Admin'}</span>
                        <span className="text-gray-400 text-xs">• {timeAgo(post.createdAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;