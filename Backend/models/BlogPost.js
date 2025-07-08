const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true }, // Store image as URL or base64
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema); 