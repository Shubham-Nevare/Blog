import React from "react";

const UserPendingBlog = ({ posts = [], loading, error }) => {
  const pending = posts.filter(post => post.status === "pending");
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (pending.length === 0) return <div className="text-gray-500">No pending blogs found.</div>;
  return (
    <div className="space-y-6">
    <h2 className="text-2xl font-semibold mb-6 text-blue-700">Pending Blog Posts</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {pending.map((post) => (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col relative" key={post._id}>
          {post.type && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
              {post.type}
            </span>
          )}
          <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-1 text-blue-700">{post.title}</h3>
            <p className="text-gray-700 flex-1 mb-2">
              {post.desc.length > 120
                ? <>{post.desc.slice(0, 120)}...<span className="text-blue-600 font-semibold ml-1">Read more</span></>
                : post.desc}
            </p>
            <div className="flex items-center gap-2 mt-2 mb-4">
             <span className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
           
          </div>
        </div>
      ))}
    </div>
  </div>
  );
};

export default UserPendingBlog;
