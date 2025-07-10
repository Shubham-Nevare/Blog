const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    image: { type: String, required: true }, // Store image as URL or base64
    type: { type: String, required: true },
    author: { type: String, required: true },
    authorImg: { type: String, required: false, default: "" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);