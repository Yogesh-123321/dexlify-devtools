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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Markdown Input Side (Left) */}
      <Card className="h-full bg-gray-900 text-white">
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2">Markdown Input</h2>

          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 mb-4">
            {toolbarButtons.map((btn, index) => (
              <Button key={index} variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-2 py-1" onClick={btn.onClick}>
                {btn.label}
              </Button>
            ))}
          </div>

          <Textarea
            ref={textareaRef}
            rows={25}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write some markdown here..."
            className="min-h-[200px] bg-gray-900 text-white placeholder:text-gray-400"
          />

          {/* Export .md only */}
          <div className="mt-4">
            <Button onClick={downloadMarkdown}>
              Export as .md
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Markdown Preview Side (Right) */}
      <Card className="h-full bg-gray-900 text-white overflow-auto">
        <CardContent className="p-4 prose prose-invert max-w-none">
          <h2 className="text-xl font-semibold mb-2">Preview</h2>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>

          {/* Export PDF here */}
          <div className="mt-4">
            <Button onClick={downloadPDF}>
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default MarkdownEditor;
