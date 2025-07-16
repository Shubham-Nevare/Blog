import {BLOG_TYPES} from "@/app/data";


const UserBlogForm = ({ title, desc, image, preview, type, loading, error, onTitleChange, onDescChange, onImageChange, onTypeChange, onSubmit }) => (
  <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4">
    <div>
      <label htmlFor="type" className="block text-sm font-medium text-blue-700 mb-1">Type of Blog</label>
      <select
        id="type"
        value={type}
        onChange={onTypeChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-gray-900"
      >
        {BLOG_TYPES.map(opt => (
          <option key={opt.value} value={opt.value} disabled={opt.value === ''}>{opt.label}</option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="title" className="block text-sm font-medium text-blue-700 mb-1">Title</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={onTitleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div>
      <label htmlFor="desc" className="block text-sm font-medium text-blue-700 mb-1">Description</label>
      <textarea
        id="desc"
        value={desc}
        onChange={onDescChange}
        required
        rows={4}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 resize-vertical"
      />
    </div>
    <div>
      <label htmlFor="image" className="block text-sm font-medium text-blue-700 mb-1">Image</label>
      <input
        id="image"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        required
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
    {preview && (
      <div className="flex justify-center">
        <img src={preview} alt="Preview" className="w-cover h-48 object-cover rounded-lg my-4 border border-gray-200" />
      </div>
    )}
    {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">{error}</div>}
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-60"
    >
      {loading ? 'Posting...' : 'Post Blog'}
    </button>
  </form>
);

export default UserBlogForm; 