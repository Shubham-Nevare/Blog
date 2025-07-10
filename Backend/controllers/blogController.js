const BlogPost = require('../models/BlogPost');

// Create blog
exports.createBlog = async(req, res) => {
    try {
        const { title, desc, image, type, author, authorImg, createdAt, userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });
        const post = new BlogPost({ title, desc, image, type, author, authorImg, createdAt, userId, status: 'pending' });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create blog post', details: err.message });
    }
};

// Get all blogs
exports.getAllBlogs = async(req, res) => {
    try {
        const posts = await BlogPost.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
};

// Update blog
exports.updateBlog = async(req, res) => {
    try {
        const { title, desc, image, type, author, authorImg, status } = req.body;
        const updateFields = { title, desc, image, type, author, authorImg };
        if (status) updateFields.status = status;
        const updated = await BlogPost.findByIdAndUpdate(
            req.params.id, updateFields, { new: true }
        );
        if (!updated) return res.status(404).json({ error: 'Blog post not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blog post', details: err.message });
    }
};

// Delete blog
exports.deleteBlog = async(req, res) => {
    try {
        const deleted = await BlogPost.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: 'Blog post not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
};

exports.getBlogById = async(req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id).populate('userId', 'name email');
        if (!post) return res.status(404).json({ error: 'Blog post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
};

exports.getBlogsByUser = async(req, res) => {
    try {
        const { userId } = req.params;
        const posts = await BlogPost.find({ userId }).populate('userId', 'name email').sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user blogs' });
    }
};

// Get blog counts by status and total
exports.getBlogStats = async(req, res) => {
    try {
        const total = await BlogPost.countDocuments();
        const published = await BlogPost.countDocuments({ status: 'published' });
        const pending = await BlogPost.countDocuments({ status: 'pending' });
        const rejected = await BlogPost.countDocuments({ status: 'rejected' });
        res.json({ total, published, pending, rejected });
    } catch (err) {
        res.status(500).json({ error: 'Failed to get blog stats' });
    }
};