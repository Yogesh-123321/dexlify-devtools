import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.post("/", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Code is required" });

  const python = spawn("python", ["explain.py"], { cwd: path.join(__dirname, "..") });

  let result = "", error = "";

  python.stdout.on("data", data => result += data.toString());
  python.stderr.on("data", data => error += data.toString());

  python.on("close", () => {
    if (error) {
      console.error("Python error:", error);
      return res.status(500).json({ error: "Python script failed" });
    }

    try {
      const json = JSON.parse(result);
      if (json.error) return res.status(400).json(json);
      res.json({ explanation: json.explanation });
    } catch (e) {
      res.status(500).json({ error: "Failed to parse Python output" });
    }
  });

  python.stdin.write(JSON.stringify({ code }));
  python.stdin.end();
});

export default router;
