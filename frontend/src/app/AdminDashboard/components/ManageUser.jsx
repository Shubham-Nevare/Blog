import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", status: "Active" });
  const [addUserError, setAddUserError] = useState("");
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "" });
  const [editUser, setEditUser] = useState(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [editUserError, setEditUserError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user/all`);
        const usersWithStatus = res.data.map((user) => ({
          ...user,
          status: user.status || "Active",
        }));
        setUsers(usersWithStatus);
        setError("");
      } catch (err) {
        setError("Failed to fetch users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  // Filter users by search input
  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  // Example action handlers (local only)
  const handleBlock = async (id) => {
    try {
  await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/status`, { status: "Blocked" });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: "Blocked" } : user
        )
      );
    } catch (err) {
      setToast({ show: true, message: "Failed to block user" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    }
  };

  const handleActivate = async (id) => {
    try {
  await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}/status`, { status: "Active" });
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, status: "Active" } : user
        )
      );
    } catch (err) {
      setToast({ show: true, message: "Failed to activate user" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/user/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      setToast({ show: true, message: "User deleted successfully!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    } catch (err) {
      setToast({ show: true, message: "Failed to delete user" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    }
  };

  // Optional: handle form submit (e.g., for search)
  const onSubmit = (e) => {
    e.preventDefault();
    // You can add more logic here if needed
  };

  // Add User Modal Handlers
  const openModal = () => {
    setNewUser({ name: "", email: "", password: "", status: "Active" });
    setAddUserError("");
    setEditUser(null);
    setShowModal(true);
  };
  // Edit User Modal Handlers
  const openEditModal = (user) => {
    setEditUser({ ...user });
    setEditUserError("");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditUser(null);
  };
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserLoading(true);
    setAddUserError("");
    try {
  const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/user/signup`, newUser);
      setUsers((prev) => [
        { ...res.data.user, status: newUser.status, _id: res.data.user?._id || Math.random().toString(36) },
        ...prev,
      ]);
      setShowModal(false);
      setToast({ show: true, message: "User added successfully!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    } catch (err) {
      setAddUserError(err.response?.data?.error || "Failed to add user");
    }
    setAddUserLoading(false);
  };

  const handleEditUserChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setEditUserLoading(true);
    setEditUserError("");
    try {
  const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/user/${editUser._id}`, {
        name: editUser.name,
        email: editUser.email,
        status: editUser.status,
      });
      setUsers((prev) => prev.map((u) => (u._id === editUser._id ? { ...u, ...res.data.user } : u)));
      setShowModal(false);
      setToast({ show: true, message: "User updated successfully!" });
      setTimeout(() => setToast({ show: false, message: "" }), 2000);
    } catch (err) {
      setEditUserError(err.response?.data?.error || "Failed to update user");
    }
    setEditUserLoading(false);
  };

  return (
    <div className="p-6">
      {toast.show && (
        <div className="fixed top-6 right-8 z-50 px-6 py-3 rounded shadow-lg text-white font-semibold transition-all bg-green-600">
          {toast.message}
        </div>
      )}
      <div className="flex items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-left">Manage Users</h2>
        <button
          onClick={openModal}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
        >
          Add User
        </button>
      </div>
      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl" onClick={closeModal}>&times;</button>
            <h3 className="text-xl font-bold mb-4">{editUser ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={editUser ? handleUpdateUser : handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" value={editUser ? editUser.name : newUser.name} onChange={editUser ? handleEditUserChange : handleNewUserChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" name="email" value={editUser ? editUser.email : newUser.email} onChange={editUser ? handleEditUserChange : handleNewUserChange} required className="w-full border px-3 py-2 rounded" />
              </div>
              {!editUser && (
                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input type="password" name="password" value={newUser.password} onChange={handleNewUserChange} required className="w-full border px-3 py-2 rounded" />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select name="status" value={editUser ? editUser.status : newUser.status} onChange={editUser ? handleEditUserChange : handleNewUserChange} className="w-full border px-3 py-2 rounded">
                  <option value="Active">Active</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
              {addUserError && !editUser && <div className="text-red-600 text-sm">{addUserError}</div>}
              {editUserError && editUser && <div className="text-red-600 text-sm">{editUserError}</div>}
              <button type="submit" disabled={addUserLoading || editUserLoading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold disabled:opacity-60">
                {editUser
                  ? editUserLoading
                    ? "Updating..."
                    : "Update User"
                  : addUserLoading
                  ? "Adding..."
                  : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
      <form
        onSubmit={onSubmit}
        className="bg-white shadow-md rounded-lg p-6 mb-10 space-y-4"
      >
        <div className="flex items-center space-x-4 justify-start">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2 w-full"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>
      {loading ? (
        <div className="text-center py-8 text-blue-600 font-semibold">
          Loading users...
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 font-semibold">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="py-3 px-6 border-b text-left min-w-[180px]">Name</th>
                <th className="py-3 px-6 border-b text-left">Email</th>
                <th className="py-3 px-6 border-b text-left">Status</th>
                <th className="py-3 px-6 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-4 text-left text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border-b text-left min-w-[180px]">
                      {user.name}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {user.email}
                    </td>
                    <td className="py-2 px-4 border-b space-x-2 text-left">
                      {/* Toggle Switch for Active/Blocked */}
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={user.status === "Active"}
                          onChange={() =>
                            user.status === "Active"
                              ? handleBlock(user._id)
                              : handleActivate(user._id)
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full transition-colors duration-200
                            ${user.status === "Active" ? "bg-green-500" : "bg-red-500"}
                            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500
                            relative flex items-center`}
                        >
                          <span
                            className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200
                              ${user.status === "Active" ? "translate-x-5" : "translate-x-1"}`}
                          ></span>
                        </div>
                        <span
                          className={`ml-3 text-sm font-medium inline-block align-middle ${
                            user.status === "Active"
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                          style={{ minWidth: '64px' }}
                        >
                          {user.status === "Active" ? "Active" : "Blocked"}
                        </span>
                      </label>
                    </td>
                    <td>
                      <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center justify-center">
                        <button
                          onClick={() => openEditModal(user)}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 font-semibold w-20 text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 font-semibold w-20 text-center"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
