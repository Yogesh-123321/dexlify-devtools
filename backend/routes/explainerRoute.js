// explainerRoute.js
import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Explanation from "../models/Explanation.js";
import { detectUser } from "../middleware/verifyToken.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// POST /api/explainer
router.post("/", detectUser, async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  if (!code) return res.status(400).json({ error: "Code is required" });

  const python = spawn("python3", ["explain.py"], {
    cwd: path.join(__dirname, ".."),
  });

  let result = "", error = "";

  python.stdout.on("data", (data) => (result += data.toString()));
  python.stderr.on("data", (data) => (error += data.toString()));

  python.on("close", async () => {
    if (error) return res.status(500).json({ error: "Python error" });

    try {
      const json = JSON.parse(result);
      if (json.error) return res.status(400).json(json);

      const entry = new Explanation({
        code,
        explanation: json.explanation,
        user: userId ? new mongoose.Types.ObjectId(userId) : null,
      });

      await entry.save();
      res.status(201).json(entry);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });

  python.stdin.write(JSON.stringify({ code }));
  python.stdin.end();
});

// ✅ GET /api/explainer – Secure fetch for logged-in users only
router.get("/", detectUser, async (req, res) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(403).json({ error: "Login required to fetch history." });
  }

  try {
    const entries = await Explanation.find({
      user: new mongoose.Types.ObjectId(userId), // ✅ CAST required
    }).sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch explanation history." });
  }
});

export default router;
