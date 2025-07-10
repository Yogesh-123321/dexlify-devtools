import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkGuestLimit } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore"; // assuming you're already using this

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const { user } = useAuthStore(); // ✅ Move this line up to top if not already present

const handleFormat = () => {
  // 🔐 Guest check
  if (!user) {
    const allowed = checkGuestLimit("jsonFormatterUsage");
    if (!allowed) {
      return toast.error("🚫 Guest limit reached. Please sign up to format more JSON.");
    }
  }

  try {
    const parsed = JSON.parse(input);
    const pretty = JSON.stringify(parsed, null, 2);
    setOutput(pretty);
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
    toast.success("📦 JSON minified!");
  } catch (err) {
    console.error("❌ JSON parse error:", err.message);
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
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleFormat}>✨ Format</Button>
            <Button onClick={handleMinify}>📦 Minify</Button>
            <Button onClick={handleReset} >
              🔄 Reset
            </Button>
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
    </div>
  );
};

export default JsonFormatter;
