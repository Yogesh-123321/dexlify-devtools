import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkGuestLimit, getOrCreateGuestId, getGuestUsage } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [guestCount, setGuestCount] = useState(0);
  const { user, token } = useAuthStore();

  useEffect(() => {
    fetchHistory();
    if (!user) {
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const userId = user ? user._id : getOrCreateGuestId();
      const res = await axios.get(`https://dexlify-devtools.onrender.com/api/jsonformatter?user=${userId}`);
      setHistory(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching history:", err.message);
    }
  };

  const handleFormat = async () => {
    if (!input.trim()) {
      toast.error("❌ Input is empty!");
      return;
    }

    if (!user) {
      const allowed = checkGuestLimit("jsonFormatterUsage");
      if (!allowed) return toast.error("🚫 Guest limit reached. Please sign up to continue.");
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);

      await axios.post("https://dexlify-devtools.onrender.com/api/jsonformatter", {
        input,
        output: pretty,
        mode: "format",
        userId: user ? user._id : "guest",
      });

      toast.success("✨ JSON formatted and saved!");
      fetchHistory();
    } catch (err) {
      toast.error("❌ Invalid JSON.");
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) {
      toast.error("❌ Input is empty!");
      return;
    }

    if (!user) {
      const allowed = checkGuestLimit("jsonFormatterUsage");
      if (!allowed) return toast.error("🚫 Guest limit reached. Please sign up to continue.");
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);

      await axios.post("https://dexlify-devtools.onrender.com/api/jsonformatter", {
        input,
        output: minified,
        mode: "minify",
        userId: user ? user._id : "guest",
      });

      toast.success("📦 JSON minified and saved!");
      fetchHistory();
    } catch (err) {
      toast.error("❌ Invalid JSON.");
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
              <div key={idx} className="border border-gray-700 p-3 rounded space-y-1 bg-gray-800">
                <p className="text-xs text-gray-400">🕒 {new Date(entry.createdAt).toLocaleString()}</p>
                <p className="text-sm">📥 Input: <pre className="whitespace-pre-wrap text-gray-300">{entry.input}</pre></p>
                <p className="text-sm">📤 Output: <pre className="whitespace-pre-wrap text-green-400">{entry.output}</pre></p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonFormatter;
