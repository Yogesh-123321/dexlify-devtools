import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import {
  checkGuestLimit,
  getGuestUsage,
} from "@/lib/utils";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [guestCount, setGuestCount] = useState(0);

  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      const { count } = getGuestUsage("jsonFormatterUsage");
      setGuestCount(count);
    }
  }, [token]);

  const handleFormat = () => {
    if (!user && !checkGuestLimit("jsonFormatterUsage")) {
      toast.error("🚫 Guest limit reached. Please sign up to format more JSON.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      toast.success("✨ JSON formatted!");
    } catch (err) {
      toast.error("❌ Invalid JSON. Please check your syntax.");
    }
  };

  const handleMinify = () => {
    if (!user && !checkGuestLimit("jsonFormatterUsage")) {
      toast.error("🚫 Guest limit reached. Please sign up to minify more JSON.");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      toast.success("📦 JSON minified!");
    } catch (err) {
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
    <div className="grid gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Input */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <h2 className="text-xl font-semibold">🔧 JSON Formatter</h2>
          <Textarea
            placeholder="Paste your JSON here..."
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleFormat} className="w-full sm:w-auto">
              ✨ Format
            </Button>
            <Button onClick={handleMinify} className="w-full sm:w-auto">
              📦 Minify
            </Button>
            <Button onClick={handleReset} className="w-full sm:w-auto">
              🔄 Reset
            </Button>
          </div>
          {!token && (
            <p className="text-sm text-gray-400">
              Guest usage: {guestCount}/2
            </p>
          )}
        </CardContent>
      </Card>

      {/* Output */}
      {output && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4 sm:p-6 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-lg font-semibold">🧾 Output</h3>
              <Button onClick={handleCopy} className="text-sm w-full sm:w-auto">
                📋 Copy
              </Button>
            </div>
            <Textarea
              value={output}
              readOnly
              rows={10}
              className="bg-gray-900 text-green-400 font-mono resize-none"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JsonFormatter;
