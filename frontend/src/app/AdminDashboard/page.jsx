"use client";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import MakeBlog from "./components/MakeBlog";
import ViewBlogs from "./components/ViewBlogs";
import PendingBlog from "./components/PendingBlog";
import RejectedBlog from "./components/RejectedBlog";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:5000/api/blog";
const USER_API_URL = "http://localhost:5000/api/user";

const AdminDashboard = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [type, setType] = useState("");
  const ADMIN_NAME = "Admin";
  const ADMIN_IMG =
    "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff&rounded=true";
  const router = useRouter();
  const [blogStats, setBlogStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    rejected: 0,
  });
  const [totalUsers, setTotalUsers] = useState(0);
  const ADMIN_USER_ID = "686d2190a6c8f88c53615025"; // TODO: Replace with your actual admin userId from MongoDB

  useEffect(() => {
    fetchPosts();
    fetchBlogStats();
    fetchUserCount();
  }, []);

  useEffect(() => {
    if (selectedMenu === "create") setLoading(false);
  }, [selectedMenu]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPosts(res.data);
    } catch (err) {
      setError("Failed to fetch posts");
    }
    setLoading(false);
  };

  const fetchBlogStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/stats`);
      setBlogStats(res.data);
      console.log("Total admin blogs:", res.data.total);
     
    } catch (err) {
      // Optionally handle error
    }
  };

  const fetchUserCount = async () => {
    try {
      const res = await axios.get(`${USER_API_URL}/count`);
      setTotalUsers(res.data.totalUsers);
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !desc || !image || !type) return;
    setLoading(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        const res = await axios.post(API_URL, {
          title,
          desc,
          image: base64Image,
          type,
          author: ADMIN_NAME,
          authorImg: ADMIN_IMG,
          userId: ADMIN_USER_ID,
          createdAt: new Date().toISOString(),
        });
        setPosts([res.data, ...posts]);
        setTitle("");
        setDesc("");
        setImage(null);
        setPreview(null);
        setType("");
        setToast({
          show: true,
          message: "Blog posted successfully!",
          type: "success",
        });
        setTimeout(
          () => setToast({ show: false, message: "", type: "" }),
          3000
        );
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError("Failed to post blog");
      setToast({ show: true, message: "Failed to post blog", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
    }
    setLoading(false);
  };

  // Edit logic
  const handleEditClick = (post) => {
    if (!post) {
      setEditId(null);
      setEditTitle("");
      setEditDesc("");
      setEditImage(null);
      setEditPreview(null);
      return;
    }
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
    setError("");
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
      setEditTitle("");
      setEditDesc("");
      setEditImage(null);
      setEditPreview(null);
    } catch (err) {
      setError("Failed to update blog");
    }
    setLoading(false);
  };

  // Delete logic
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?"))
      return;
    setLoading(true);
    setError("");
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      setError("Failed to delete blog");
    }
    setLoading(false);
  };

  const handlePublish = async (id) => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`${API_URL}/${id}`, { status: "published" });
      fetchPosts();
      setToast({ show: true, message: "Blog published!", type: "success" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 2000);
    } catch (err) {
      setError("Failed to publish blog");
    }
    setLoading(false);
  };

  const handleReject = async (id) => {
    setLoading(true);
    setError("");
    try {
      await axios.put(`${API_URL}/${id}`, { status: "rejected" });
      fetchPosts();
      setToast({ show: true, message: "Blog rejected!", type: "error" });
      setTimeout(() => setToast({ show: false, message: "", type: "" }), 2000);
    } catch (err) {
      setError("Failed to reject blog");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    // Optionally clear any admin session here
    router.push("/Login");
  };

  // Calculate total admin-authored blogs
  const totalAdminBlogs = useMemo(
    () => posts.filter((post) => post.author === "Admin").length,
    [posts]
  );
  // console.log(totalAdminBlogs);

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
          <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
            Admin Dashboard
          </h1>
          {toast.show && (
            <div
              className={`fixed top-6 right-8 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all ${
                toast.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {toast.message}
            </div>
          )}
          {selectedMenu === "dashboard" && (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold mb-4 text-blue-700">
                Welcome, Admin!
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-blue-100 text-blue-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{blogStats.total}</div>
                  <div className="text-sm">Total Blogs</div>
                </div>
                <div className="bg-green-100 text-green-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">
                    {blogStats.published}
                  </div>
                  <div className="text-sm">Published</div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{blogStats.pending}</div>
                  <div className="text-sm">Pending</div>
                </div>
                <div className="bg-red-100 text-red-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{blogStats.rejected}</div>
                  <div className="text-sm">Rejected</div>
                </div>
                <div className="bg-purple-100 text-purple-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <div className="text-sm">Total Users</div>
                </div>
              </div>
              {/* <div className="text-lg">Total Blogs: <span className="font-bold text-blue-700">{blogStats.total}</span></div> */}
              <div className="text-lg">
                Admin Authored Blogs:{" "}
                <span className="font-bold text-blue-700">
                  {totalAdminBlogs}
                </span>
              </div>
            </div>
          )}
          {selectedMenu === "create" && (
            <MakeBlog
              title={title}
              desc={desc}
              image={image}
              preview={preview}
              loading={loading}
              error={error}
              type={type}
              onTypeChange={(e) => setType(e.target.value)}
              onTitleChange={(e) => setTitle(e.target.value)}
              onDescChange={(e) => setDesc(e.target.value)}
              onImageChange={handleImageChange}
              onSubmit={handleSubmit}
            />
          )}
          {selectedMenu === "manage" && (
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
              onEditTitleChange={(e) => setEditTitle(e.target.value)}
              onEditDescChange={(e) => setEditDesc(e.target.value)}
              onEditImageChange={handleEditImageChange}
              onEditSubmit={handleEditSubmit}
            />
          )}
          {selectedMenu === "pending" && (
            <PendingBlog
              posts={posts}
              loading={loading}
              error={error}
              onPublish={handlePublish}
              onReject={handleReject}
            />
          )}
          {selectedMenu === "rejected" && (
            <RejectedBlog posts={posts} loading={loading} error={error} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
