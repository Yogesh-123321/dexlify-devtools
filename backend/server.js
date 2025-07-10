import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import snippetRoutes from "./routes/snippets.js";
import explainerRoute from "./routes/explainerRoute.js";
import jsonFormatterRoutes from "./routes/jsonFormatterRoute.js";
import authRoutes from "./routes/authRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Global logger middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.originalUrl}`);
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/snippets", snippetRoutes);
app.use("/api/explainer", explainerRoute);
app.use("/api/jsonformatter", jsonFormatterRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/dexlify")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
