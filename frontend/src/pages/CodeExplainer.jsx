import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkGuestLimit } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useAuthStore((state) => state.user);

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error("❌ Code is empty!");
      return;
    }

    // Guest usage restriction
    if (!user && !checkGuestLimit("codeExplainerUsage")) {
      toast.error("🚫 Guest limit reached. Please login to continue.");
      return;
    }

    setLoading(true);
    setExplanation("");

    try {
      const res = await axios.post("http://localhost:5500/api/explainer", {
        code,
      });

      setExplanation(res.data.explanation || "No explanation returned.");
      toast.success("✅ Explanation generated!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to explain the code.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode("");
    setExplanation("");
    toast("🔄 Reset successful");
  };

  const handleCopy = () => {
    if (!explanation.trim()) return toast.error("❌ Nothing to copy.");
    navigator.clipboard.writeText(explanation);
    toast.success("📋 Copied to clipboard!");
  };

  return (
    <div className="grid gap-6">
      {/* Input Section */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">🧠 Code Explainer</h2>
          <Textarea
            placeholder="Paste your code here..."
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleExplain} disabled={loading}>
              {loading ? "⏳ Explaining..." : "⚡ Explain Code"}
            </Button>
            <Button onClick={handleReset}>🔄 Reset</Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {explanation && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">📄 Explanation</h3>
              <Button onClick={handleCopy} className="text-sm">
                📋 Copy
              </Button>
            </div>
            <Textarea
              value={explanation}
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

export default CodeExplainer;
