import express from "express";
import JsonEntry from "../models/JsonEntry.js";

const router = express.Router();

// Guest-friendly POST route
router.post("/", async (req, res) => {
  try {
    const { input, output, mode, userId = "guest" } = req.body;

    // 🧮 Limit guest saves to 2
    if (userId === "guest") {
      const guestCount = await JsonEntry.countDocuments({ user: "guest" });

      if (guestCount >= 2) {
        return res.status(403).json({
          error: "🔒 Guest limit reached. Please sign up to save more JSON entries.",
        });
      }
    }

    const entry = new JsonEntry({ user: userId, input, output, mode });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    console.error("❌ Error saving JSON:", error);
    res.status(500).json({ error: "Failed to save JSON." });
  }
});

// Public GET: show guest's saved entries only
router.get("/", async (req, res) => {
  try {
    const userId = req.query.user || "guest";
    const entries = await JsonEntry.find({ user: userId }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    console.error("❌ Error fetching JSON:", error);
    res.status(500).json({ error: "Failed to fetch saved JSON." });
  }
});

export default router;
