const UserBlogList = ({ posts, loading, type }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-6 text-blue-700">{type === 'rejected' ? 'Rejected Blogs' : 'Published Blogs'}</h2>
    {loading && <div className="text-center">Loading...</div>}
    {posts.length === 0 && !loading && <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded text-center mb-4">No blogs yet.</div>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post, idx) => (
        <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col" key={post._id || idx}>
          {post.image && (
            <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
          )}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-bold mb-1 text-blue-700">{post.title}</h3>
            <p className="text-gray-700 flex-1">{post.desc}</p>
            <div className="flex gap-2 mt-2">
              {/* Edit and Delete buttons can be added here */}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default UserBlogList; 