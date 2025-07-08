"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blog';

const AdminDashboard = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) {
      setError('Failed to fetch posts');
    }
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !image) return;
    setLoading(true);
    setError('');
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const res = await axios.post(API_URL, { title, desc, image: base64Image });
        setPosts([res.data, ...posts]);
        setTitle('');
        setDesc('');
        setImage(null);
        setPreview(null);
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError('Failed to post blog');
    }
    setLoading(false);
  };

  // Edit logic
  const handleEditClick = (post) => {
    setEditId(post._id);
    setEditTitle(post.title);
    setEditDesc(post.desc);
    setEditImage(null);
    setEditPreview(post.image);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    setEditPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let base64Image = editPreview;
      if (editImage) {
        const reader = new FileReader();
        await new Promise((resolve) => {
          reader.onloadend = () => {
            base64Image = reader.result;
            resolve();
          };
          reader.readAsDataURL(editImage);
        });
      }
      const res = await axios.put(`${API_URL}/${editId}`, {
        title: editTitle,
        desc: editDesc,
        image: base64Image,
      });
      setPosts(posts.map((p) => (p._id === editId ? res.data : p)));
      setEditId(null);
      setEditTitle('');
      setEditDesc('');
      setEditImage(null);
      setEditPreview(null);
    } catch (err) {
      setError('Failed to update blog');
    }
    setLoading(false);
  };

  // Delete logic
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;
    setLoading(true);
    setError('');
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete blog');
    }
    setLoading(false);
  };

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-8 pt-20">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Admin Dashboard</h1>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {preview && (
            <div className="flex justify-center">
              <img src={preview} alt="Preview" className="w-48 h-48 object-cover rounded-lg my-4 border border-gray-200" />
            </div>
          )}
          {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-60"
          >
            {loading ? 'Posting...' : 'Post Blog'}
          </button>
        </form>

        <h2 className="text-2xl font-semibold mb-6 text-blue-700">Blog Posts</h2>
        {loading && (
          <div className="flex justify-center my-8">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}
        {posts.length === 0 && !loading && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-center mb-4">No posts yet.</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, idx) => (
            <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col" key={post._id || idx}>
              {editId === post._id ? (
                <form onSubmit={handleEditSubmit} className="p-4 flex-1 flex flex-col space-y-2">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleEditImageChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {editPreview && (
                    <img src={editPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg my-2 border border-gray-200 mx-auto" />
                  )}
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors">Save</button>
                    <button type="button" onClick={() => setEditId(null)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors">Cancel</button>
                  </div>
                </form>
              ) : (
                <>
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
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditClick(post)}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;