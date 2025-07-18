import React, { useState, useEffect } from "react";
import axios from "axios";
import useAuthStore from "@/store/useAuthStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  checkGuestLimit,
  getGuestUsage,
  resetGuestLimits,
  getOrCreateGuestId,
} from "@/lib/utils";

const SnippetVault = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [guestCount, setGuestCount] = useState(0);

  const { token, user } = useAuthStore();

  useEffect(() => {
    fetchSnippets();

    if (!token) {
      const { count } = getGuestUsage("snippetVaultUsage");
      setGuestCount(count);
    }
  }, [token]);

  const fetchSnippets = async () => {
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-guest-id": getOrCreateGuestId() };

      const res = await axios.get("https://dexlify-devtools.onrender.com/api/snippets", {
        headers,
        withCredentials: true,
      });

      setSnippets(res.data);
    } catch (error) {
      toast.error("❌ Failed to load snippets.");
    }
  };

  const saveSnippet = async () => {
    if (!title.trim() || !code.trim()) {
      toast.error("❌ Title and code cannot be empty.");
      return;
    }

    const headers = token
      ? { Authorization: `Bearer ${token}` }
      : { "x-guest-id": getOrCreateGuestId() };

    if (!user) {
      const allowed = checkGuestLimit("snippetVaultUsage");
      if (!allowed) {
        toast.error("🚫 Guest limit reached. Please sign up to save more snippets.");
        return;
      }

      const { count } = getGuestUsage("snippetVaultUsage");
      setGuestCount(count);
    }

    try {
      const res = await axios.post(
        "https://dexlify-devtools.onrender.com/api/snippets",
        { title, code },
        {
          headers,
          withCredentials: true,
        }
      );
      setSnippets([res.data, ...snippets]);
      setTitle("");
      setCode("");
      toast.success("✅ Snippet saved successfully!");
    } catch (error) {
      toast.error("❌ Failed to save snippet.");
    }
  };

  const confirmDelete = async () => {
    try {
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : { "x-guest-id": getOrCreateGuestId() };

      await axios.delete(`https://dexlify-devtools.onrender.com/api/snippets/${selectedSnippet._id}`, {
        headers,
        withCredentials: true,
      });

      setSnippets(snippets.filter((s) => s._id !== selectedSnippet._id));
      toast.success("🗑️ Snippet deleted successfully!");
    } catch (error) {
      toast.error("❌ Failed to delete snippet.");
    } finally {
      setShowConfirm(false);
      setSelectedSnippet(null);
    }
  };

  return (
    <div className="space-y-6">
      {showConfirm && selectedSnippet && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-sm text-white space-y-4">
            <h2 className="text-lg font-semibold">
              Delete “{selectedSnippet.title}”?
            </h2>
            <p className="text-sm text-gray-300">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                className="bg-gray-700 hover:bg-gray-600"
                onClick={() => {
                  setShowConfirm(false);
                  setSelectedSnippet(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDelete}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card className="bg-gray-900 text-white">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-xl font-semibold">💾 Save a Snippet</h2>
          <Input
            placeholder="Snippet Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700"
          />
          <Textarea
            rows={6}
            placeholder="Write your code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700"
          />
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={saveSnippet}>Save Snippet</Button>
            {!token && (
              <span className="text-sm text-gray-400">
                Guest usage: {guestCount}/2
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {snippets.map((snippet) => (
          <Card key={snippet._id} className="bg-gray-800 text-white">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{snippet.title}</h3>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedSnippet(snippet);
                    setShowConfirm(true);
                  }}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </div>
              <pre className="bg-black/30 p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
                {snippet.code}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SnippetVault;
