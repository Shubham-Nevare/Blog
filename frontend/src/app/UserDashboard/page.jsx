"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import UserSidebar from "./components/UserSidebar";
import UserBlogForm from "./components/UserBlogForm";
import UserBlogList from "./components/UserBlogList";
import UserPublishedBlog from "./components/UserPublishedBlog";
import UserPendingBlog from "./components/UserPendingBlog";
import UserRejectedBlog from "./components/UserRejectedBlog";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/blog`;


export default function UserDashboard() {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [type, setType] = useState("");
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user"))
        : null;
    setUser(storedUser);
    setUserLoading(false);
    if (!storedUser) {
      router.push("/Login");
      return;
    }
    fetchUserBlogs(storedUser.id); // Pass only the id
    // eslint-disable-next-line
  }, []);

  const fetchUserBlogs = async (userId) => {
    setLoading(true);
    try {
      // console.log("Fetching blogs for userId:", userId);
      const res = await axios.get(`${API_URL}/user/${userId}`);
      setPosts(res.data);
      // console.log("Fetched blogs:", res.data);
    } catch (err) {
      setError("Failed to fetch your blogs");
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
    if (!title || !desc || !image || !type) return;
    setLoading(true);
    setError("");
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        await axios.post(API_URL, {
          title,
          desc,
          image: base64Image,
          type,
          author: user.name,
          authorImg: "",
          userId: user.id, // Always use user.id
          createdAt: new Date().toISOString(),
        });
        setTitle("");
        setDesc("");
        setImage(null);
        setPreview(null);
        setType("");
        fetchUserBlogs(user.id); // Always use user.id
      };
      reader.readAsDataURL(image);
    } catch (err) {
      setError("Failed to post blog");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/Login");
  };

  if (userLoading) return null; // Or a loading spinner
  if (!user) return null;

  // Calculate blog stats
  const totalBlogs = posts.length;
  const totalPublished = posts.filter(
    (post) => post.status === "published"
  ).length;
  const totalRejected = posts.filter(
    (post) => post.status === "rejected"
  ).length;
  const totalPending = posts.filter((post) => post.status === "pending").length;

  return (
    <div className="flex">
      <UserSidebar
        selected={selectedMenu}
        onSelect={setSelectedMenu}
        blogCount={posts.length}
        onLogout={handleLogout}
      />
      <div className="ml-56 w-full">
        <div className="mx-auto max-w-3xl px-4 py-8 pt-10">
          {/* Profile and Heading Row */}
          <div className="flex items-center justify-between gap-4 mb-8">
           
            <h1 className="text-3xl font-bold text-blue-700 ml-4">User Dashboard</h1>
            <div className="flex items-center gap-2">
            <img
              src={user.authorImg || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=0D8ABC&color=fff&rounded=true'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-blue-200"
            />
            <span className="text-xl font-semibold text-gray-800">{user.name}</span></div>
          </div>
          {selectedMenu === "dashboard" && (
            <div>
               <div className="text-center text-lg text-gray-700">
                Welcome to your dashboard!
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-blue-100 text-blue-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{totalBlogs}</div>
                  <div className="text-sm">Total Blogs</div>
                </div>
                <div className="bg-green-100 text-green-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{totalPublished}</div>
                  <div className="text-sm">Published</div>
                </div>
                <div className="bg-yellow-100 text-yellow-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{totalPending}</div>
                  <div className="text-sm">Pending</div>
                </div>
                <div className="bg-red-100 text-red-800 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">{totalRejected}</div>
                  <div className="text-sm">Rejected</div>
                </div>
              </div>
             
            </div>
          )}
          {selectedMenu === "create" && (
            <UserBlogForm
              title={title}
              desc={desc}
              image={image}
              preview={preview}
              type={type}
              loading={loading}
              error={error}
              onTitleChange={(e) => setTitle(e.target.value)}
              onDescChange={(e) => setDesc(e.target.value)}
              onImageChange={handleImageChange}
              onTypeChange={(e) => setType(e.target.value)}
              onSubmit={handleSubmit}
            />
          )}
          {selectedMenu === "publish" && <UserPublishedBlog posts={posts} loading={loading} error={error} />}
          {selectedMenu === "pending" && <UserPendingBlog posts={posts} loading={loading} error={error} />}
          {selectedMenu === "reject" && <UserRejectedBlog posts={posts} loading={loading} error={error} />}
        </div>
      </div>
    </div>
  );
}
