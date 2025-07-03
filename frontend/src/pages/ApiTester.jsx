import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const APITester = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState("");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const sendRequest = async () => {
    setResponse("");
    setError("");

    try {
      const options = {
        method,
        headers: headers ? JSON.parse(headers) : {},
      };

      if (method !== "GET" && body) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const text = await res.text();

      try {
        const json = JSON.parse(text);
        setResponse(JSON.stringify(json, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold mb-2">API Tester</h2>

          <div className="grid grid-cols-2 gap-4">
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
                <option>DELETE</option>
                <option>PATCH</option>
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
                placeholder='{"title": "new value"}'
                className="bg-gray-800 text-white"
              />
            </div>
          )}


          <Button onClick={sendRequest} className="bg-green-600 hover:bg-green-700">
            Send Request
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 text-white overflow-auto">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-2">Response</h3>
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <pre className="whitespace-pre-wrap">{response}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default APITester;
