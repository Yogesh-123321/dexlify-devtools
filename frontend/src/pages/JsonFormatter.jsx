import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import {
  checkGuestLimit,
  getGuestUsage,
  getOrCreateGuestId,
} from "@/lib/utils";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [guestCount, setGuestCount] = useState(0);

  const { user, token } = useAuthStore();

  useEffect(() => {
    if (user || token !== null) {
      fetchHistory();
    }

    if (!user && !token) {
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }
  }, [user, token]);

  const fetchHistory = async () => {
    try {
      const userId = user?._id || getOrCreateGuestId();
      if (!userId) return;

      const res = await axios.get(
        `https://dexlify-devtools.onrender.com/api/jsonformatter?user=${userId}`
      );
      setHistory(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch history:", err.message);
    }
  };

  const saveToHistory = async (formatted, mode) => {
    try {
      const userId = user?._id || "guest";

      await axios.post("https://dexlify-devtools.onrender.com/api/jsonformatter", {
        input,
        output: formatted,
        mode,
        userId,
      });

      fetchHistory(); // refresh after save
    } catch (err) {
      console.error("❌ History save error:", err.message);
    }
  };

  const handleFormat = () => {
    if (!user && !checkGuestLimit("jsonFormatterUsage")) {
      toast.error("🚫 Guest limit reached. Please sign up to format more JSON.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      saveToHistory(pretty, "beautify");
      toast.success("✨ JSON formatted!");
    } catch {
      toast.error("❌ Invalid JSON. Please check your syntax.");
    }
  };

  const handleMinify = () => {
    if (!user && !checkGuestLimit("jsonFormatterUsage")) {
      toast.error("🚫 Guest limit reached. Please sign up to format more JSON.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      saveToHistory(minified, "minify");
      toast.success("📦 JSON minified!");
    } catch {
      toast.error("❌ Invalid JSON. Please check your syntax.");
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    toast("🔄 Reset successful");
  };

  const handleCopy = () => {
    if (!output.trim()) return toast.error("❌ Nothing to copy.");
    navigator.clipboard.writeText(output);
    toast.success("📋 Copied to clipboard!");
  };

  return (
    <div className="grid gap-6">
      {/* Input */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">🔧 JSON Formatter</h2>
          <Textarea
            placeholder="Paste your JSON here..."
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <div className="flex gap-3 flex-wrap items-center">
            <Button onClick={handleFormat}>✨ Format</Button>
            <Button onClick={handleMinify}>📦 Minify</Button>
            <Button onClick={handleReset}>🔄 Reset</Button>
            {!user && (
              <span className="text-sm text-gray-400">
                Guest usage: {guestCount}/2
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      {output && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">🧾 Output</h3>
              <Button onClick={handleCopy} className="text-sm">📋 Copy</Button>
            </div>
            <Textarea
              value={output}
              readOnly
              rows={10}
              className="bg-gray-900 text-green-400 font-mono"
            />
          </CardContent>
        </Card>
      )}

      {/* History */}
      {history.length > 0 && (
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-4 space-y-4">
            <h3 className="text-lg font-semibold">📚 JSON History</h3>
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="bg-gray-800 p-3 rounded text-sm overflow-auto whitespace-pre-wrap border border-gray-700"
              >
                <p className="text-xs text-gray-400 mb-1">
                  Mode: {entry.mode} | {new Date(entry.createdAt).toLocaleString()}
                </p>
                <pre>{entry.output}</pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonFormatter;
