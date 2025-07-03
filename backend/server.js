require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const snippetRoutes = require('./routes/snippets');
const explainerRoute = require("./routes/explainerRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/snippets', snippetRoutes);
console.log("DEBUG TYPE:", typeof explainerRoute); // should log "function"
app.use("/api/explainer", explainerRoute);

mongoose.connect('mongodb://localhost:27017/dexlify')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
