import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const RegexTester = () => {
  const [text, setText] = useState("");
  const [regex, setRegex] = useState("");
  const [result, setResult] = useState(null);
  const [generatedRegex, setGeneratedRegex] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("");

  const handleTest = () => {
    try {
      const pattern = new RegExp(regex);
      setResult(pattern.test(text));
    } catch (e) {
      setResult("Invalid regex");
    }
  };

  const handleUseGenerated = () => {
    setRegex(generatedRegex);
  };

  const standardPatterns = {
    "": "",
    "Email": "^[\\w.-]+@[\\w.-]+\\.\\w{2,}$",
    "Mobile (India)": "^[6-9]\\d{9}$",
    "Strong Password": "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    "PAN Card (India)": "^[A-Z]{5}[0-9]{4}[A-Z]{1}$",
    "Date (YYYY-MM-DD)": "^\\d{4}-\\d{2}-\\d{2}$",
    "IPv4 Address": "^(?:[0-9]{1,3}\\.){3}[0-9]{1,3}$",
    "Hex Color Code": "^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Regex Tester</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Regex Pattern:</label>
          <Input value={regex} onChange={(e) => setRegex(e.target.value)} placeholder="Enter regex pattern..." />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Text to Test:</label>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text here..." />
        </div>

        

        <Button onClick={handleTest}>Test</Button>

        {result !== null && (
          <div className="mt-4">
            <p className="font-semibold">Result:{" "}
              <span className={result === true ? "text-green-600" : "text-red-600"}>
                {result === true ? "Match " : result === false ? "No Match " : result}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* Standard Pattern Selector */}
      <div className="space-y-2">
        <label className="block font-medium">Select Standard Pattern:</label>
        <select
          value={selectedStandard}
          onChange={(e) => {
            setSelectedStandard(e.target.value);
            setGeneratedRegex(standardPatterns[e.target.value]);
          }}
          className="p-2 border rounded-md bg-gray-900 text-white border-gray-700"
        >
          <option value="">-- Select a Standard Pattern --</option>
          {Object.keys(standardPatterns).map(
            (key) => key && <option key={key} value={key}>{key}</option>
          )}
        </select>


        {generatedRegex && (
          <>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">{generatedRegex}</p>
            <Button onClick={handleUseGenerated}>Use in Tester</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RegexTester;
