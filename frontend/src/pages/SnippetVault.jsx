import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

const SnippetVault = () => {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [snippets, setSnippets] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/snippets");
      setSnippets(res.data);
    } catch (error) {
      console.error("Error fetching snippets:", error);
    }
  };

  const saveSnippet = async () => {
    if (!title.trim() || !code.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/snippets", {
        title,
        code,
      });
      setSnippets([res.data, ...snippets]);
      setTitle("");
      setCode("");
    } catch (error) {
      console.error("Error saving snippet:", error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedSnippet) return;
    try {
      await axios.delete(`http://localhost:5000/api/snippets/${selectedSnippet._id}`);
      setSnippets((prev) => prev.filter((s) => s._id !== selectedSnippet._id));
    } catch (error) {
      console.error("Error deleting snippet:", error);
    } finally {
      setShowConfirm(false);
      setSelectedSnippet(null);
    }
  };

  return (
    <div className="grid gap-6 relative">
      {/* Custom confirmation modal */}
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
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Save a Snippet</h2>
          <Input
            placeholder="Snippet title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <Textarea
            rows={6}
            placeholder="Write your code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <Button onClick={saveSnippet} className="bg-green-600 hover:bg-green-700">
            Save
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {snippets.map((snippet) => (
          <Card key={snippet._id} className="bg-gray-800 text-white">
            <CardContent className="p-4 flex flex-col justify-between h-full">
              <h3 className="text-lg font-semibold mb-2">{snippet.title}</h3>
              <pre className="flex-grow whitespace-pre-wrap">{snippet.code}</pre>
              <div className="mt-4">
                <Button
                  
                  onClick={() => {
                    setSelectedSnippet(snippet);
                    setShowConfirm(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default SnippetVault;
