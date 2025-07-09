import {
  HomeIcon,
  FileTextIcon,
  BrainIcon,
  FlaskConicalIcon,
  NotebookTextIcon,
  CodeIcon,
  MenuIcon,
  XIcon,
  PaletteIcon
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navLinks = [
  { to: "/", label: "Dashboard", icon: <HomeIcon className="w-4 h-4" /> },
  { to: "/json", label: "JSON Formatter", icon: <CodeIcon className="w-4 h-4" /> },
  { to: "/regex", label: "Regex Tester", icon: <CodeIcon className="w-4 h-4" /> },
  { to: "/markdown", label: "Markdown Editor", icon: <NotebookTextIcon className="w-4 h-4" /> },
  { to: "/snippets", label: "Snippet Vault", icon: <FileTextIcon className="w-4 h-4" /> },
  { to: "/explain", label: "Code Explainer", icon: <BrainIcon className="w-4 h-4" /> },
  { to: "/api", label: "API Tester", icon: <FlaskConicalIcon className="w-4 h-4" /> },
  { to: "/color", label: "Color Picker", icon: <PaletteIcon className="w-4 h-4" /> },
  { to: "/theme", label: "Theme Generator", icon: <PaletteIcon className="w-4 h-4" /> },
];

export default function Sidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderLinks = () => (
    <nav className="flex flex-col gap-2">
      {navLinks.map(({ to, label, icon }) => {
        const isActive = location.pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "inline-flex items-center justify-start gap-3 rounded-md text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring px-4 py-2 transform",
              isActive
                ? "bg-primary text-primary-foreground scale-105 shadow-md"
                : "bg-zinc-800 text-white hover:bg-primary/90 hover:text-black"
            )}
          >
            {icon}
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const logoBlock = (
    <div className="flex justify-center items-center py-4">
      <img
        src="/assets/dexlify-logo-modern.png"
        alt="Dexlify Logo"
        className="w-36 h-auto object-contain drop-shadow-md"
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen bg-black border-r border-primary p-5 flex-col gap-8 shadow-lg">
        {logoBlock}
        {renderLinks()}
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
