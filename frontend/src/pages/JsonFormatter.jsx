import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkGuestLimit, getGuestUsage, getOrCreateGuestId } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [guestCount, setGuestCount] = useState(0);
  const { user } = useAuthStore();

  const fetchHistory = async () => {
    try {
      const userId = user ? user._id : "guest";
      const res = await axios.get(`https://dexlify-devtools.onrender.com/api/jsonformatter?user=${userId}`);
      setHistory(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch JSON history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    if (!user) {
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }
  }, [user]);

  const saveFormattedJson = async (formatted, mode = "formatted") => {
    try {
      const userId = user ? user._id : "guest";
      const res = await axios.post("https://dexlify-devtools.onrender.com/api/jsonformatter", {
        input,
        output: formatted,
        mode,
        userId,
      });
      setHistory((prev) => [res.data, ...prev]);
      toast.success("💾 Saved to history!");
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error("🔒 Guest limit reached. Please log in to save more.");
      } else {
        toast.error("❌ Failed to save JSON.");
      }
    }
  };

  const handleFormat = () => {
    if (!user) {
      const allowed = checkGuestLimit("jsonFormatterUsage");
      if (!allowed) {
        return toast.error("🚫 Guest limit reached. Please sign up to format more JSON.");
      }
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      saveFormattedJson(pretty, "formatted");
      toast.success("✨ JSON formatted!");
    } catch (err) {
      toast.error("❌ Invalid JSON.");
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      saveFormattedJson(minified, "minified");
      toast.success("📦 JSON minified!");
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://dexlify-devtools.onrender.com/api/jsonformatter/${id}`);
      setHistory(history.filter((entry) => entry._id !== id));
      toast.success("🗑️ Deleted from history");
    } catch {
      toast.error("❌ Failed to delete entry");
    }
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
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleFormat}>✨ Format</Button>
            <Button onClick={handleMinify}>📦 Minify</Button>
            <Button onClick={handleReset}>🔄 Reset</Button>
          </div>
          {!user && (
            <span className="text-sm text-gray-400">
              Guest usage: {guestCount}/2
            </span>
          )}
        </CardContent>
      </Card>

      {/* Output */}
      {output && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">🧾 Output</h3>
              <Button onClick={handleCopy} className="text-sm">
                📋 Copy
              </Button>
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
        <div className="grid gap-4">
          <h3 className="text-xl text-white font-semibold">📜 History</h3>
          {history.map((entry) => (
            <Card key={entry._id} className="bg-gray-800 text-white">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">
                    Mode: {entry.mode}
                  </span>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(entry._id)}
                    className="text-sm bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
                <pre className="bg-black/40 p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
                  {entry.output}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;
