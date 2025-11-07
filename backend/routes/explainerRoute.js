import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import Explanation from "../models/Explanation.js";
import { detectUser } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", detectUser, async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "deepseek/deepseek-chat-v3-0324:free",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful AI code explainer. Explain this code step-by-step in a beginner-friendly way.",
      },
      {
        role: "user",
        content: `Explain this code:\n\n${code}`,
      },
    ],
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NODE_ENV === "production"
        ? "https://dexlify-frontend.onrender.com"
        : "http://localhost:5173",
      "X-Title": "Dexlify Code Explainer",
    },
  }
);

    const explanation = response.data.choices?.[0]?.message?.content?.trim();
    if (!explanation)
      return res.status(500).json({ error: "No explanation returned by model" });

    const entry = new Explanation({
      code,
      explanation,
      user: userId ? new mongoose.Types.ObjectId(userId) : null,
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error("OpenRouter/DeepSeek error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get explanation from DeepSeek" });
  }
});

export default router;
