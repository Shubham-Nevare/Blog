"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import MakeBlog from './components/MakeBlog';
import ViewBlogs from './components/ViewBlogs';
import { useRouter } from 'next/navigation';

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
  const [selectedMenu, setSelectedMenu] = useState('dashboard');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const router = useRouter();

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
        setToast({ show: true, message: 'Blog posted successfully!', type: 'success' });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError('Failed to post blog');
      setToast({ show: true, message: 'Failed to post blog', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
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

  const handleLogout = () => {
    // Optionally clear any admin session here
    router.push('/Login');
  };

  return (
    <div className="flex">
      <Sidebar
        selected={selectedMenu}
        onSelect={setSelectedMenu}
        blogCount={posts.length}
        onLogout={handleLogout}
      />
      <div className="ml-56 w-full">
        <div className="mx-auto max-w-3xl px-4 py-8 pt-10">
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">Admin Dashboard</h1>
          {toast.show && (
            <div className={`fixed top-6 right-8 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
              {toast.message}
            </div>
          )}
          {selectedMenu === 'dashboard' && (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">Welcome, Admin!</h2>
              <p className="text-lg">Total Blogs: <span className="font-bold text-blue-700">{posts.length}</span></p>
              {/* Add more dashboard stats here if needed */}
            </div>
          )}
          {selectedMenu === 'create' && (
            <MakeBlog
              title={title}
              desc={desc}
              image={image}
              preview={preview}
              loading={loading}
              error={error}
              onTitleChange={e => setTitle(e.target.value)}
              onDescChange={e => setDesc(e.target.value)}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
            />
          )}
          {selectedMenu === 'manage' && (
            <ViewBlogs
              posts={posts}
              loading={loading}
              onEdit={handleEditClick}
              onDelete={handleDelete}
              editId={editId}
              editTitle={editTitle}
              editDesc={editDesc}
              editImage={editImage}
              editPreview={editPreview}
              onEditTitleChange={e => setEditTitle(e.target.value)}
              onEditDescChange={e => setEditDesc(e.target.value)}
              onEditImageChange={handleEditImageChange}
              onEditSubmit={handleEditSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;