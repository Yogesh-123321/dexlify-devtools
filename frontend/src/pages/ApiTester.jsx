import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const APITester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [queryParams, setQueryParams] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const sendRequest = async () => {
    setResponse("");
    setError("");

    try {
      let finalUrl = url;
      if (queryParams.trim()) {
        try {
          const queryObj = JSON.parse(queryParams);
          const searchParams = new URLSearchParams(queryObj).toString();
          finalUrl += "?" + searchParams;
        } catch (err) {
          setError("❌ Invalid Query Params JSON");
          return;
        }
      }

      const options = {
        method,
        headers: headers ? JSON.parse(headers) : {},
      };

      if (method !== "GET" && method !== "DELETE" && body) {
        options.body = body;
      }

      const res = await fetch(finalUrl, options);
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        setResponse(JSON.stringify(json, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="grid gap-6 max-w-5xl mx-auto p-4 sm:p-6">
      {/* Request Card */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">🌐 API Tester</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Method</Label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-gray-800 text-white p-2 rounded w-full"
              >
                <option>GET</option>
                <option>POST</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>

            <div>
              <Label className="text-white">URL</Label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://jsonplaceholder.typicode.com/posts"
              />
            </div>
          </div>

          <div>
            <Label className="text-white">Query Params (JSON)</Label>
            <Textarea
              rows={2}
              value={queryParams}
              onChange={(e) => setQueryParams(e.target.value)}
              placeholder='{"search": "book", "limit": 10}'
              className="bg-gray-800 text-white"
            />
          </div>

          <div>
            <Label className="text-white">Headers (JSON)</Label>
            <Textarea
              rows={3}
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
              placeholder={`{\n  "Content-Type": "application/json"\n}`}
              className="bg-gray-800 text-white"
            />
          </div>

          {(method === "POST" || method === "PUT" || method === "PATCH") && (
            <div>
              <Label className="text-white">Body</Label>
              <Textarea
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"title": "foo", "body": "bar"}'
                className="bg-gray-800 text-white"
              />
            </div>
          )}

          <Button onClick={sendRequest}>🚀 Send Request</Button>
        </CardContent>
      </Card>

      {/* Response Card */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-2">
          <h3 className="text-lg font-semibold">📬 Response</h3>
          <div className="max-h-[400px] overflow-auto bg-gray-800 p-3 rounded text-sm whitespace-pre-wrap">
            {error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <pre>{response}</pre>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APITester;
