import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import JsonFormatter from "@/pages/JsonFormatter";
import RegexTester from "@/pages/RegexTester";
import MarkdownEditor from "./pages/MarkdownEditor";
import ApiTester from "./pages/ApiTester";
import SnippetVault from "./pages/SnippetVault";
import CodeExplainer from "./pages/CodeExplainer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="json" element={<JsonFormatter />} />
          <Route path="regex" element={<RegexTester />} />
          <Route path="markdown" element={<MarkdownEditor />} />
          <Route path="api" element={<ApiTester />} />
          <Route path="snippets" element={<SnippetVault />} />
          <Route path="explain" element={<CodeExplainer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
