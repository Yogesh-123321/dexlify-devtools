import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      setError("");
    } catch (e) {
      setOutput("");
      setError(" Invalid JSON format");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">🧾 JSON Formatter</h1>

      <textarea
        rows="10"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your JSON here..."
        className="w-full p-4 bg-gray-800 text-white rounded-md border border-gray-600 outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-4 mt-4">
        <Button onClick={handleFormat}>Format</Button>
        <Button onClick={handleClear}>Clear</Button>
      </div>

      {error && (
        <div className="mt-4 p-4 text-red-400 border border-red-400 rounded-md bg-red-900/20">
          {error}
        </div>
      )}

      {output && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-white">Formatted Output:</h2>
          <pre className="bg-gray-900 text-green-300 p-4 rounded-md overflow-auto max-h-[400px]">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;
