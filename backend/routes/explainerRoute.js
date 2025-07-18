import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import Explanation from "../models/Explanation.js";
import { detectUser } from "../middleware/verifyToken.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// POST /api/explainer
router.post("/", detectUser, async (req, res) => {
  const { code } = req.body;
  const userId = req.userId;

  console.log("📥 Received code:", code, "| User ID:", userId);

  if (!code) return res.status(400).json({ error: "Code is required" });

  const python = spawn("python3", ["explain.py"], {
    cwd: path.join(__dirname, ".."),
  });

  python.on("error", (err) => {
    console.error("❌ Failed to start Python process:", err.message);
    return res.status(500).json({ error: "Failed to start Python process" });
  });

  let result = "", error = "";

  python.stdout.on("data", (data) => (result += data.toString()));
  python.stderr.on("data", (data) => (error += data.toString()));

  python.on("close", async () => {
    if (error) {
      console.error("❌ Python error:", error);
      return res.status(500).json({ error: "Python script failed" });
    }

    try {
      const json = JSON.parse(result);
      if (json.error) return res.status(400).json(json);

      const entry = new Explanation({
        user: userId === "guest" ? null : userId,
        code,
        explanation: json.explanation,
      });

      await entry.save();
      res.status(201).json(entry);
    } catch (e) {
      console.error("❌ JSON Parse error:", e.message);
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });

  python.stdin.write(JSON.stringify({ code }));
  python.stdin.end();
});

// GET /api/explainer
router.get("/", detectUser, async (req, res) => {
  const userId = req.userId;

  if (userId === "guest") {
    return res.status(403).json({ error: "Login required to fetch history." });
  }

  try {
    const entries = await Explanation.find({ user: userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch {
    res.status(500).json({ error: "Failed to fetch explanation history." });
  }
});

export default router;
