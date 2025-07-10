import {
  HomeIcon,
  FileTextIcon,
  BrainIcon,
  FlaskConicalIcon,
  NotebookTextIcon,
  CodeIcon,
  MenuIcon,
  XIcon,
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

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const renderLinks = () => (
    <nav className="flex flex-col gap-1">
      {navLinks.map(({ to, label, icon }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 text-sm font-medium px-4 py-2 rounded-md transition-all",
              isActive
                ? "bg-primary text-primary-foreground shadow"
                : "hover:bg-primary/80 hover:text-black text-white bg-zinc-800"
            )}
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );

  const logoBlock = (
    <div className="flex items-center justify-between px-4 py-3">
      {!collapsed && (
        <img
          src="/assets/dexlify-logo-modern.png"
          alt="Dexlify Logo"
          className="w-36 object-contain drop-shadow"
        />
      )}
      <button onClick={() => setCollapsed(!collapsed)} className="text-white">
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex h-screen bg-black border-r border-primary shadow-lg flex-col transition-all duration-300",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {logoBlock}
        <div className="flex-1 overflow-y-auto px-2 py-2">{renderLinks()}</div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden flex justify-between items-center bg-black px-4 py-3 border-b border-primary shadow">
        <img
          src="/assets/dexlify-logo-modern.png"
          alt="Dexlify Logo"
          className="w-28 object-contain drop-shadow-md"
        />
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <XIcon className="w-6 h-6 text-white" /> : <MenuIcon className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Mobile Sidebar Panel */}
      {mobileOpen && (
        <div className="md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-black border-r border-primary p-5 space-y-6 shadow-xl">
          <div className="flex justify-between items-center">
            <img
              src="/assets/dexlify-logo-modern.png"
              alt="Dexlify Logo"
              className="w-28 object-contain drop-shadow-md"
            />
            <button onClick={() => setMobileOpen(false)}>
              <XIcon className="w-5 h-5 text-white" />
            </button>
          </div>
          {renderLinks()}
        </div>
      )}
    </>
  );
}
