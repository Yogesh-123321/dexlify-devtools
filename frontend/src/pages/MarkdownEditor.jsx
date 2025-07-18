import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import jsPDF from 'jspdf';

const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState('');
  const textareaRef = useRef(null);

  const insertAtCursor = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    const newText = before + selectedText + after;

    setMarkdown(markdown.slice(0, start) + newText + markdown.slice(end));

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + newText.length - after.length);
    }, 0);
  };

  const toolbarButtons = [
    { label: 'Bold', onClick: () => insertAtCursor('**', '**') },
    { label: 'Italic', onClick: () => insertAtCursor('*', '*') },
    { label: 'Code', onClick: () => insertAtCursor('`', '`') },
    { label: 'Link', onClick: () => insertAtCursor('[', '](url)') },
    { label: 'Heading', onClick: () => insertAtCursor('# ') },
    { label: 'List', onClick: () => insertAtCursor('- ') },
    { label: 'Checkbox', onClick: () => insertAtCursor('- [ ] ') },
  ];

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'markdown.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(markdown, 10, 10);
    doc.save('markdown.pdf');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Markdown Input Side */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Markdown Input</h2>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2">
            {toolbarButtons.map((btn, index) => (
              <Button
                key={index}
                variant="secondary"
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-2 py-1"
                onClick={btn.onClick}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          <Textarea
            ref={textareaRef}
            rows={20}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write some markdown here..."
            className="min-h-[200px] bg-gray-900 text-white placeholder:text-gray-400"
          />

          <Button onClick={downloadMarkdown} className="w-full sm:w-auto">
            Export as .md
          </Button>
        </CardContent>
      </Card>

      {/* Markdown Preview Side */}
      <Card className="bg-gray-900 text-white overflow-auto">
        <CardContent className="p-4 space-y-4">
          <h2 className="text-xl font-semibold">Preview</h2>

          <div className="prose prose-invert max-w-none overflow-x-auto text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>

          <Button onClick={downloadPDF} className="w-full sm:w-auto">
            Export as PDF
          </Button>
        </CardContent>
      </Card>

    </div>
  );
};

export default MarkdownEditor;
