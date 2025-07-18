import express from "express";
import JsonEntry from "../models/JsonEntry.js";

const router = express.Router();

// ✅ POST: Save a formatted/minified entry
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

// ✅ GET: Fetch all entries for a user (or guest)
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

// ✅ DELETE: Remove a single entry by ID
router.delete("/:id", async (req, res) => {
  try {
    await JsonEntry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    console.error("❌ Error deleting JSON:", error);
    res.status(500).json({ error: "Failed to delete JSON entry." });
  }
});

export default router;
