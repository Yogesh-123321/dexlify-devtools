import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner"; // ✅ Import toast

const ColorPicker = () => {
  const [color, setColor] = useState("#7c3aed");

  const hex = color;
  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function hexToHsl(hex) {
    let r = parseInt(hex.substr(1, 2), 16) / 255;
    let g = parseInt(hex.substr(3, 2), 16) / 255;
    let b = parseInt(hex.substr(5, 2), 16) / 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  }

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("✅ Copied to clipboard");
  };

  return (
    <div className="text-white space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">🎨 Color Picker</h1>

      {/* Input Row */}
      <div className="flex flex-wrap gap-4 items-center">
        <Input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-16 h-12 p-0 border border-zinc-600 rounded"
        />
        <Input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-40"
        />
        <div
          className="w-24 h-12 rounded-md border border-zinc-600 shadow-inner"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Color Formats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-zinc-800 p-4 rounded-md shadow-sm">
          <p className="mb-2 font-semibold">HEX</p>
          <div className="flex justify-between items-center">
            <span>{hex}</span>
            <Button size="sm" onClick={() => copy(hex)}>
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-md shadow-sm">
          <p className="mb-2 font-semibold">RGB</p>
          <div className="flex justify-between items-center">
            <span>{rgb}</span>
            <Button size="sm" onClick={() => copy(rgb)}>
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="bg-zinc-800 p-4 rounded-md shadow-sm">
          <p className="mb-2 font-semibold">HSL</p>
          <div className="flex justify-between items-center">
            <span>{hsl}</span>
            <Button size="sm" onClick={() => copy(hsl)}>
              <CopyIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
