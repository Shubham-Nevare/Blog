"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {typeBadgeStyles} from '@/app/data';


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

const API_URL = 'http://localhost:5000/api/blog';

export default function BlogDetail() {
  const { blogId } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${API_URL}/${blogId}`);
        setPost(res.data);
      } catch (err) {
        setError("Failed to fetch blog post");
      }
      setLoading(false);
    };
    if (blogId) fetchPost();
  }, [blogId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
  );
  if (error) return <div className="text-center text-red-600 py-10">{error}</div>;
  if (!post) return null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="mx-auto max-w-2xl px-4 py-8 w-full">
        <button
          className="flex items-center gap-2 text-blue-700 font-semibold mb-6 hover:underline focus:outline-none"
          onClick={() => router.back()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="relative mb-6">
          {post.type && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeStyles[post.type] || 'bg-gray-200 text-gray-700'}`}>
              {post.type}
            </span>
          )}
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg" />
          )}
        </div>
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{post.title}</h1>
        <div className="flex items-center gap-3 mb-6">
          <img src={post.authorImg || defaultAvatar} alt={post.author || 'Admin'} className="w-10 h-10 rounded-full object-cover" />
          <span className="text-base font-medium text-gray-900">{post.author || 'Admin'}</span>
          <span className="text-gray-400 text-sm">• {timeAgo(post.createdAt)}</span>
        </div>
        <p className="text-lg text-gray-800 leading-relaxed">{post.desc}</p>
      </div>
    </main>
  );
} 