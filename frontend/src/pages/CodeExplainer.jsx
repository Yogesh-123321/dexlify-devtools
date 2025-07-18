import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { checkGuestLimit, getGuestUsage } from "@/lib/utils";
import useAuthStore from "@/store/useAuthStore";
import axios from "axios";

const CodeExplainer = () => {
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);

  // Fetch history on load
  useEffect(() => {
    if (user && token) {
      fetchHistory();
    } else {
      const { count } = getGuestUsage("codeExplainerUsage");
      setGuestCount(count);
    }
  }, [user, token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://dexlify-devtools.onrender.com/api/explainer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch explanation history:", err.message);
      if (err.response?.status === 403) {
        toast.error("⚠️ Login required to fetch history. Please log in again.");
      }
    }
  };

  const handleExplain = async () => {
    if (!code.trim()) {
      toast.error("❌ Code is empty!");
      return;
    }

    if (!user && !checkGuestLimit("codeExplainerUsage")) {
      toast.error("🚫 Guest limit reached. Please login to continue.");
      return;
    }

    if (!user) {
      const { count } = getGuestUsage("codeExplainerUsage");
      setGuestCount(count);
    }

    setLoading(true);
    setExplanation("");

    try {
      const res = await axios.post(
        "https://dexlify-devtools.onrender.com/api/explainer",
        { code },
        user
          ? { headers: { Authorization: `Bearer ${token}` } }
          : undefined
      );

      setExplanation(res.data.explanation || "No explanation returned.");
      toast.success("✅ Explanation generated!");

      if (user) {
        fetchHistory();
      }
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
    <div className="grid gap-6 max-w-5xl mx-auto p-4 sm:p-6">
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
          <div className="flex flex-wrap gap-3 items-center">
            <Button onClick={handleExplain} disabled={loading}>
              {loading ? "⏳ Explaining..." : "⚡ Explain Code"}
            </Button>
            <Button onClick={handleReset}>🔄 Reset</Button>
            {!user && (
              <span className="text-sm text-gray-400">
                Guest usage: {guestCount}/2
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {explanation && (
        <Card className="bg-gray-800 text-white">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between items-center flex-wrap gap-2">
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

      {/* History Section */}
      {user && history.length > 0 && (
        <Card className="bg-gray-900 text-white">
          <CardContent className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">📜 Your Explanation History</h2>
            {history.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-700 rounded p-3 space-y-2 bg-gray-800"
              >
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap bg-black/30 p-2 rounded">
                  {item.code}
                </pre>
                <div className="text-green-400 font-mono text-sm bg-black/20 p-2 rounded">
                  {item.explanation}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CodeExplainer;
