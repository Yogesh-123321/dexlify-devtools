import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, EyeIcon } from "lucide-react";

const themes = [
  {
    name: "Cyberpunk",
    description: "Neon pink and teal for AI/gaming/dark-tech feel.",
    colors: {
      background: "#0f0f0f",
      primary: "#e11d48",
      accent: "#0ea5e9",
      text: "#f1f5f9",
    },
  },
  {
    name: "Pastel Dream",
    description: "Soft pastels for blogs, lifestyle or ecommerce.",
    colors: {
      background: "#fff1f2",
      primary: "#f472b6",
      accent: "#c084fc",
      text: "#1e293b",
    },
  },
  {
    name: "Elegant Dark",
    description: "Modern portfolio/dashboard with deep purples.",
    colors: {
      background: "#111827",
      primary: "#7c3aed",
      accent: "#facc15",
      text: "#f8fafc",
    },
  },
  {
    name: "Forest Green",
    description: "Natural green tones for eco or health brands.",
    colors: {
      background: "#f0fdf4",
      primary: "#166534",
      accent: "#65a30d",
      text: "#0f172a",
    },
  },
  {
    name: "Royal Gold",
    description: "Premium landing pages or luxury products.",
    colors: {
      background: "#0a0a0a",
      primary: "#d97706",
      accent: "#fde68a",
      text: "#f9fafb",
    },
  },
  {
    name: "Cool Mint",
    description: "Fresh and bright for startups or SaaS.",
    colors: {
      background: "#f0fdfa",
      primary: "#22d3ee",
      accent: "#2dd4bf",
      text: "#111827",
    },
  },
  {
    name: "Retro Arcade",
    description: "Bold 80s-style palette for creatives.",
    colors: {
      background: "#1e293b",
      primary: "#f43f5e",
      accent: "#a78bfa",
      text: "#fef9c3",
    },
  },
  {
    name: "Paper White",
    description: "Clean minimalist blog or writing layout.",
    colors: {
      background: "#f9fafb",
      primary: "#1e3a8a",
      accent: "#64748b",
      text: "#111827",
    },
  },
];

const ThemeGenerator = () => {
  const [selected, setSelected] = useState(null);

  const copyToClipboard = () => {
    if (selected)
      navigator.clipboard.writeText(JSON.stringify(selected.colors, null, 2));
  };

  return (
    <div className="text-white space-y-6 max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">🎨 Theme Generator</h1>
      <p className="text-muted-foreground mb-6">
        Browse curated color palettes for your next UI. Click to preview and copy.
      </p>

      {/* Theme Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <div
            key={theme.name}
            onClick={() => setSelected(theme)}
            className={`cursor-pointer p-4 rounded-lg transition border shadow-sm hover:shadow-md ${
              selected?.name === theme.name
                ? "border-yellow-500 bg-zinc-900"
                : "border-zinc-700 bg-zinc-800"
            }`}
          >
            <h3 className="font-semibold text-lg mb-1">{theme.name}</h3>
            <p className="text-xs text-muted-foreground mb-3">{theme.description}</p>
            <div className="flex gap-2">
              {Object.values(theme.colors).map((color) => (
                <div
                  key={color}
                  className="w-6 h-6 rounded shadow-inner"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Theme Preview */}
      {selected && (
        <div className="bg-zinc-800 rounded-lg mt-10 p-6 space-y-6 shadow-inner">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <EyeIcon className="w-5 h-5" />
            Preview: <span className="text-yellow-400">{selected.name}</span>
          </h2>

          {/* Color Swatches */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(selected.colors).map(([label, value]) => (
              <div
                key={label}
                className="bg-zinc-900 p-3 rounded-md flex flex-col items-center text-center"
              >
                <div
                  className="w-10 h-10 rounded-full border border-white mb-2"
                  style={{ backgroundColor: value }}
                />
                <p className="text-xs text-muted-foreground uppercase">{label}</p>
                <p className="text-sm font-mono">{value}</p>
              </div>
            ))}
          </div>

          {/* Copy Theme */}
          <Button onClick={copyToClipboard}>
            <CopyIcon className="w-4 h-4 mr-2" />
            Copy Theme as JSON
          </Button>

          {/* 🔥 Browser-style Live Preview */}
          <div
            className="rounded-md overflow-hidden shadow-lg border border-zinc-700 mt-8"
            style={{ backgroundColor: selected.colors.background }}
          >
            {/* Fake browser bar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-700">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
            </div>

            {/* Page content */}
            <div
              className="p-6 space-y-4 text-sm"
              style={{ color: selected.colors.text }}
            >
              <h3 className="text-xl font-semibold">Welcome to Dexlify!</h3>
              <p>This is how your website might look with this theme.</p>

              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded-md font-medium shadow"
                  style={{
                    backgroundColor: selected.colors.primary,
                    color: selected.colors.text,
                  }}
                >
                  Primary Button
                </button>

                <button
                  className="px-4 py-2 rounded-md font-medium shadow"
                  style={{
                    backgroundColor: selected.colors.accent,
                    color: selected.colors.text,
                  }}
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ThemeGenerator;
