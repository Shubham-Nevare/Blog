const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Signup
exports.signup = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            console.error('Signup error: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            console.error('Signup error: Email already in use');
            return res.status(400).json({ error: 'Email already in use' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Signup failed', details: err.message || String(err) });
    }
};

// Login
exports.login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.error('Login error: All fields are required');
            return res.status(400).json({ error: 'All fields are required' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            console.error('Login error: Invalid credentials');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.error('Login error: Invalid credentials');
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', user: { name: user.name, email: user.email, id: user._id } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed', details: err.message || String(err) });
    }
};

// Get total user count
exports.getTotalUsers = async(req, res) => {
    try {
        const count = await User.countDocuments();
        res.json({ totalUsers: count });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get user count' });
    }
};

// Get all users (for admin management)
exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.find({}, 'name email status'); // Exclude password
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get users' });
    }
};

// Delete user by ID
exports.deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};

// Update user status by ID
exports.updateUserStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['Active', 'Blocked'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const user = await User.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User status updated', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
};

// Update user details by ID
exports.updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, status } = req.body;
        const update = {};
        if (name) update.name = name;
        if (email) update.email = email;
        if (status) update.status = status;
        const user = await User.findByIdAndUpdate(id, update, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update user' });
    }
};