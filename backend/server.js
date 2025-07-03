const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const snippetRoutes = require('./routes/snippets');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/snippets', snippetRoutes);

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/dexlify')
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => console.error('MongoDB connection error:', err));
