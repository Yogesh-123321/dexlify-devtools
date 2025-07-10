import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  const [history, setHistory] = useState([]);

  const { user, token } = useAuthStore(); // ✅ Use token directly

  // ✅ Clear warning when typing
  useEffect(() => {
    if (code.trim()) setShowEmptyWarning(false);
  }, [code]);

  // ✅ Fetch explanation history when token is available
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/explainer", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch explanation history:", err);
      }
    };

    if (token) fetchHistory();
  }, [token]); // ✅ correct dependency

  const handleExplain = async () => {
    if (!code.trim()) {
      setShowEmptyWarning(true);
      return;
    }

    setLoading(true);
    setExplanation("");
    setShowEmptyWarning(false);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/explainer",
        { code },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      setExplanation(res.data.explanation || "⚠️ No explanation returned.");
      if (token) {
        setHistory((prev) => [res.data, ...prev]);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      if (
        error.response?.data?.error ===
        "Guest trial limit reached. Please log in."
      ) {
        setExplanation("🚫 Guest trial limit reached. Please log in to continue.");
      } else {
        setExplanation("❌ An error occurred while trying to explain the code.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">🧠 Code Explainer</h2>
          <Textarea
            placeholder="Paste your code here..."
            rows={8}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-800 text-white"
          />
          {showEmptyWarning && (
            <div className="text-yellow-400 text-sm">
              ⚠️ Please enter some code before explaining.
            </div>
          )}
          <Button onClick={handleExplain} disabled={loading}>
            {loading ? "Explaining..." : "Explain Code"}
          </Button>
        </CardContent>
      </Card>

      {explanation && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">💬 Explanation</h3>
            <pre className="whitespace-pre-wrap text-sm">{explanation}</pre>
          </CardContent>
        </Card>
      )}

      {token && history.length > 0 && (
        <Card className="bg-gray-800 text-white mt-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">📜 Your Previous Explanations</h3>
            <div className="space-y-4 max-h-[300px] overflow-auto">
              {history.map((entry) => (
                <div
                  key={entry._id}
                  className="border border-gray-700 rounded p-3 bg-gray-900"
                >
                  <p className="text-sm text-gray-400 mb-2">
                    🕒 {new Date(entry.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-green-400 font-semibold mb-1">🧾 Code:</p>
                  <pre className="whitespace-pre-wrap text-gray-200 text-xs bg-gray-950 p-2 rounded">
                    {entry.code}
                  </pre>
                  <p className="text-sm text-yellow-400 font-semibold mt-2 mb-1">💬 Explanation:</p>
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm">{entry.explanation}</pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeExplainer;
