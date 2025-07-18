import express from "express";
import Snippet from "../models/Snippet.js";
import { detectUser } from "../middleware/verifyToken.js";

const router = express.Router();

/**
 * 🔐 Save Snippet
 * - If user is logged in, attach userId
 * - If guest, attach guestId from headers
 */
router.post("/", detectUser, async (req, res) => {
  try {
    const guestId = req.headers["x-guest-id"];

    if (!req.userId && !guestId) {
      return res.status(401).json({ error: "Unauthorized: No user or guest ID" });
    }

    const snippet = new Snippet({
      ...req.body,
      userId: req.userId || undefined,
      guestId: guestId || undefined,
    });

    await snippet.save();
    res.status(201).json(snippet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * 📥 Get Snippets
 * - Returns user's snippets if logged in
 * - Returns guest snippets (by guestId) otherwise
 */
router.get("/", detectUser, async (req, res) => {
  try {
    const guestId = req.headers["x-guest-id"];

    if (!req.userId && !guestId) {
      return res.status(401).json({ error: "Unauthorized: No user or guest ID" });
    }

    const query = req.userId
      ? { userId: req.userId }
      : { guestId: guestId };

    const snippets = await Snippet.find(query).sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 🗑 Delete Snippet
 * - Only deletes snippet belonging to current user or guest
 */
router.delete("/:id", detectUser, async (req, res) => {
  try {
    const guestId = req.headers["x-guest-id"];

    if (!req.userId && !guestId) {
      return res.status(401).json({ error: "Unauthorized: No user or guest ID" });
    }

    const query = {
      _id: req.params.id,
      ...(req.userId ? { userId: req.userId } : { guestId }),
    };

    const deleted = await Snippet.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({ error: "Snippet not found" });
    }

    res.status(200).json({ message: "Snippet deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete snippet" });
  }
});

export default router;
