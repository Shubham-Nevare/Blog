import React from 'react';

const menuItems = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'manage', label: 'Manage Blog' },
  { key: 'manageUser', label: 'Manage User' },
  { key: 'create', label: 'Create New Blog' },
  { key: 'pending', label: 'Pending Blog' },
  // { key: 'rejected', label: 'Rejected Blog' },
];

const Sidebar = ({ selected, onSelect, blogCount, onLogout }) => {
  return (
    <div className="w-56 h-screen bg-gray-900 text-white flex flex-col justify-between fixed left-0 top-0 shadow-lg">
      <div>
        <div className="py-8 px-6 border-b border-gray-800">
          <h2 className="text-xl font-bold tracking-wide text-white">Admin Dashboard</h2>
        </div>
        <ul className="mt-8">
          {menuItems.map(item => (
            <li
              key={item.key}
              className={`px-6 py-3 cursor-pointer text-base transition-colors ${selected === item.key ? 'bg-gray-700 font-semibold' : 'hover:bg-gray-800'}`}
              onClick={() => onSelect(item.key)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <div className="py-6 px-6 border-t border-gray-800 flex items-center justify-between">
          <span>Total Blogs:</span>
          <span className="font-bold text-lg">{blogCount}</span>
        </div>
        <button
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-b focus:outline-none transition-colors"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 