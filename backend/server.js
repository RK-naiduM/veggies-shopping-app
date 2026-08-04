require('dns').setDefaultResultOrder('ipv4first'); // Forces Node to use IPv4

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const bulkOrderRoutes = require('./routes/bulkOrderRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const contactUs = require('./routes/contactUs');
const blogRoutes = require('./routes/blogRoutes');

// Initialize the App
const app = express();

// Middleware
app.use(express.json());

// CORS Configuration
app.use(cors({
    origin: '*', 
    credentials: true
}));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/bulk-orders', bulkOrderRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactUs);
app.use('/api/blogs', blogRoutes);

// Serve Images (Clean and simple now)
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Simple Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});