const BlogPost = require('../models/BlogPost');

// Create blog
exports.createBlog = async(req, res) => {
    try {
        const { title, desc, image, type, author, authorImg, createdAt } = req.body;
        const post = new BlogPost({ title, desc, image, type, author, authorImg, createdAt });
        await post.save();
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create blog post', details: err.message });
    }
};

// Get all blogs
exports.getAllBlogs = async(req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
};

// Update blog
exports.updateBlog = async(req, res) => {
    try {
        const { title, desc, image, type, author, authorImg } = req.body;
        const updated = await BlogPost.findByIdAndUpdate(
            req.params.id, { title, desc, image, type, author, authorImg }, { new: true }
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
        const post = await BlogPost.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Blog post not found' });
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blog post' });
    }
};