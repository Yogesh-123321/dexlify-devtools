import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);

  useEffect(() => {
    // Clear the warning if user types something
    if (code.trim()) {
      setShowEmptyWarning(false);
    }
  }, [code]);

  const handleExplain = async () => {
    if (!code.trim()) {
      setShowEmptyWarning(true);
      return;
    }

    setLoading(true);
    setExplanation("");
    setShowEmptyWarning(false);

    try {
      const res = await axios.post("http://localhost:5000/api/explainer", {
        code,
      });

      setExplanation(res.data.explanation || "⚠️ No explanation returned.");
    } catch (error) {
      console.error("Error:", error);
      setExplanation("❌ An error occurred while trying to explain the code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Code Explainer</h2>
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
            <h3 className="text-lg font-semibold mb-2">Explanation</h3>
            <pre className="whitespace-pre-wrap">{explanation}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeExplainer;
