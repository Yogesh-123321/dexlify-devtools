import {
  HomeIcon,
  FileTextIcon,
  BrainIcon,
  FlaskConicalIcon,
  NotebookTextIcon,
  CodeIcon,
  PaletteIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Dashboard", icon: <HomeIcon className="w-5 h-5" /> },
  { to: "/json", label: "JSON Formatter", icon: <CodeIcon className="w-5 h-5" /> },
  { to: "/regex", label: "Regex Tester", icon: <CodeIcon className="w-5 h-5" /> },
  { to: "/markdown", label: "Markdown Editor", icon: <NotebookTextIcon className="w-5 h-5" /> },
  { to: "/snippets", label: "Snippet Vault", icon: <FileTextIcon className="w-5 h-5" /> },
  { to: "/explain", label: "Code Explainer", icon: <BrainIcon className="w-5 h-5" /> },
  { to: "/api", label: "API Tester", icon: <FlaskConicalIcon className="w-5 h-5" /> },
  { to: "/color", label: "Color Picker", icon: <PaletteIcon className="w-5 h-5" /> },
  { to: "/theme", label: "Theme Generator", icon: <PaletteIcon className="w-5 h-5" /> },
];

export default function Sidebar({ closeSidebar }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const renderLinks = () => (
    <nav className="flex flex-col gap-1">
      {navLinks.map(({ to, label, icon }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={closeSidebar}
            className={cn(
              "flex items-center gap-3 text-sm font-medium px-4 py-2 rounded-md transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow"
                : "bg-black text-white hover:bg-zinc-700"
            )}
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <aside
      className={cn(
        "h-full bg-black border-r border-primary shadow-lg flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Top Bar: Logo + Collapse + Mobile Close */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo + Collapse */}
        <div className="flex items-center gap-2">
          {!collapsed && (
            <img
              src="/assets/dexlify.png"
              alt="Dexlify Logo"
              className="w-36 object-contain drop-shadow"
            />
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-white"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* Mobile Close Button */}
        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="md:hidden text-white text-2xl font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {renderLinks()}
      </div>
    </aside>
  );
}
