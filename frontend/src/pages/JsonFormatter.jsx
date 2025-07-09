import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import API from "@/lib/api";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [savedEntries, setSavedEntries] = useState([]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      const pretty = JSON.stringify(parsed, null, 2);
      setOutput(pretty);
      setError("");
    } catch (e) {
      setOutput("");
      setError("Invalid JSON format");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

 const handleSave = async () => {
  try {
    const res = await API.post("/jsonformatter", {
      input,
      output,
      mode: "beautify",
      userId: "guest", // 👈 pass this explicitly
    });
    alert("✅ JSON saved!");
    fetchSavedEntries();
  } catch (err) {
    const msg = err?.response?.data?.error || "❌ Failed to save JSON";
    alert(msg);
    console.error("Save failed:", err);
  }
};


  const fetchSavedEntries = async () => {
  try {
    const res = await API.get("/jsonformatter?user=guest");
    setSavedEntries(res.data);
  } catch (err) {
    console.error("Failed to fetch JSON:", err);
  }
};


  useEffect(() => {
    fetchSavedEntries();
  }, []);

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

      <div className="flex flex-wrap gap-4 mt-4">
        <Button onClick={handleFormat}>Format</Button>
        <Button onClick={handleClear} >
          Clear
        </Button>
        <Button onClick={handleSave} >
          Save 
        </Button>
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

      {/* Saved Entries List */}
      {savedEntries.length > 0 && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-white mb-4">📂 Your Saved JSONs</h2>
          <div className="grid gap-4">
            {savedEntries.map((entry) => (
              <div
                key={entry._id}
                className="bg-zinc-800 p-4 rounded-md border border-zinc-700"
              >
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(entry.createdAt).toLocaleString()}
                </p>
                <pre className="bg-black text-green-400 text-sm p-2 rounded overflow-x-auto max-h-40">
                  {entry.output}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default JsonFormatter;
