// explainerRoute.js
import express from "express";
import axios from "axios";
import mongoose from "mongoose";
import Explanation from "../models/Explanation.js";
import { detectUser } from "../middleware/verifyToken.js";

const router = express.Router();

// POST /api/explainer
router.post("/", detectUser, async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  if (!code) return res.status(400).json({ error: "Code is required" });

  try {
    // 🧠 Send code to OpenRouter API for explanation
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini", // You can try "anthropic/claude-3.5-sonnet" or "mistralai/mixtral-8x7b"
        messages: [
          {
            role: "system",
            content:
              "You are a professional programming tutor. Explain code step-by-step in a clear, beginner-friendly way.",
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
          "HTTP-Referer": "https://yourdexlifydomain.com", // change to your domain
          "X-Title": "Dexlify Code Explainer",
        },
      }
    );

    const explanation = response.data.choices?.[0]?.message?.content?.trim();

    if (!explanation) {
      return res.status(500).json({ error: "No explanation returned by model" });
    }

    // ✅ Save explanation in DB (for logged-in users)
    const entry = new Explanation({
      code,
      explanation,
      user: userId ? new mongoose.Types.ObjectId(userId) : null,
    });

    await entry.save();

    res.status(201).json(entry);
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch explanation from model" });
  }
});

// ✅ GET /api/explainer – fetch explanation history
router.get("/", detectUser, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(403).json({ error: "Login required to fetch history." });
  }

  try {
    const entries = await Explanation.find({
      user: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch explanation history." });
  }
});

export default router;
