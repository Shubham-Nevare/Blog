import React from 'react';
import {typeBadgeStyles} from '@/app/data';


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

const ViewBlogs = ({ posts, loading, onEdit, onDelete, editId, editTitle, editDesc, editImage, editPreview, onEditTitleChange, onEditDescChange, onEditImageChange, onEditSubmit }) => (
  <div>
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
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col relative" key={post._id || idx}>
          {post.type && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${typeBadgeStyles[post.type] || 'bg-gray-200 text-gray-700'}`}>
              {post.type}
            </span>
          )}
          {editId === post._id ? (
            <form onSubmit={onEditSubmit} className="p-4 flex-1 flex flex-col space-y-2">
              <input
                type="text"
                value={editTitle}
                onChange={onEditTitleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                value={editDesc}
                onChange={onEditDescChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
                rows={3}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={onEditImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {editPreview && (
                <img src={editPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg my-2 border border-gray-200" />
              )}
              <div className="flex gap-2 mt-2">
                <button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-semibold">Save</button>
                <button type="button" className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md font-semibold" onClick={() => onEdit(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-1 text-blue-700">{post.title}</h3>
                <p className="text-gray-700 flex-1">
                  {post.desc.length > 120
                    ? <>
                        {post.desc.slice(0, 120)}...<span className="text-blue-600 font-semibold ml-1">Read more</span>
                      </>
                    : post.desc}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <img src={post.authorImg || "default-avatar.webp"} alt={post.author || 'Author'} className="w-8 h-8 rounded-full object-cover" />
                  <span className="text-sm font-medium text-gray-900">{post.author || 'Unknown'}</span>
                  <span className="text-gray-400 text-xs">• {timeAgo(post.createdAt)}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md font-semibold" onClick={() => onEdit(post)}>Edit</button>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md font-semibold" onClick={() => onDelete(post._id)}>Delete</button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default ViewBlogs; 