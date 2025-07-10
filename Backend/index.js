const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// ✅ Import blog routes
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ✅ MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// ✅ Base route
app.get('/', (req, res) => {
    res.send('API is running');
});

// ✅ Use blog routes
app.use('/api/blog', blogRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});