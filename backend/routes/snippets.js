import express from "express";
import Snippet from "../models/Snippet.js";

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const snippet = new Snippet(req.body);
    await snippet.save();
    res.status(201).json(snippet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Snippet.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Snippet not found' });
    res.status(200).json({ message: 'Snippet deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete snippet' });
  }
});

export default router;
