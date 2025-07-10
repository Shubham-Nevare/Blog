import React from "react";

const PendingBlog = ({ posts = [], loading, error, onPublish, onReject }) => {
  const pending = posts.filter(post => post.status === "pending");
  if (loading) return (
    <div className="flex justify-center my-8">
      <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
    </div>
  );
  if (error) return <div className="text-red-600">{error}</div>;
  if (pending.length === 0) return <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-center mb-4">No pending blogs found.</div>;
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
                <img src={post.authorImg || '/default-avatar.webp'} alt={post.userId?.name || 'Author'} className="w-8 h-8 rounded-full object-cover" />
                <span className="text-sm font-medium text-gray-900">{post.userId?.name || 'Unknown'}</span>
                <span className="text-gray-400 text-xs">• {new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex gap-2 mt-auto">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded font-semibold" onClick={() => onPublish && onPublish(post._id)}>Publish</button>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded font-semibold" onClick={() => onReject && onReject(post._id)}>Reject</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingBlog;