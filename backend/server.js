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
const PORT = process.env.PORT || 5500;

app.use(cors({
  origin: "https://dexlify-frontend.onrender.com",
  credentials: true,
}));

app.use(express.json());

app.use("/api/snippets", snippetRoutes);
app.use("/api/explainer", explainerRoute);
app.use("/api/jsonformatter", jsonFormatterRoutes);
app.use("/api/auth", authRoutes);

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
