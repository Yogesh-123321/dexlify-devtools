import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkGuestLimit, getGuestUsage } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [history, setHistory] = useState([]);
  const [guestCount, setGuestCount] = useState(0);

  const { user } = useAuthStore();

  useEffect(() => {
    fetchHistory();

    if (!user) {
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://dexlify-devtools.onrender.com/api/jsonformatter", {
        params: {
          user: user?._id || "guest",
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history:", err.message);
    }
  };

  const handleFormat = async () => {
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
      toast.success("✨ JSON formatted!");
      await saveEntry(pretty, "format");
      fetchHistory();
    } catch {
      toast.error("❌ Invalid JSON.");
    }
  };

  const handleMinify = async () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      toast.success("📦 JSON minified!");
      await saveEntry(minified, "minify");
      fetchHistory();
    } catch {
      toast.error("❌ Invalid JSON. Please check your syntax.");
    }
  };

  const saveEntry = async (result, mode) => {
    try {
      await axios.post("https://dexlify-devtools.onrender.com/api/jsonformatter", {
        input,
        output: result,
        mode,
        userId: user?._id || "guest",
      });
    } catch (err) {
      console.warn("⚠️ Failed to save entry:", err.response?.data?.error || err.message);
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
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">📜 Your JSON History</h2>
            {history.map((item, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded p-3 space-y-2 bg-gray-800"
              >
                <div className="text-sm text-gray-400">
                  Mode: {item.mode?.toUpperCase() || "UNKNOWN"}
                </div>
                <pre className="whitespace-pre-wrap text-xs bg-black/30 p-2 rounded text-green-300">
                  {item.output}
                </pre>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonFormatter;
