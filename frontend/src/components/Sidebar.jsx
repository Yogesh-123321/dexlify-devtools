import { Link, useLocation } from "react-router-dom";

const links = [
  { name: "Dashboard", path: "/" },
  { name: "JSON Formatter", path: "/json" },
  { name: "Regex Tester", path: "/regex" },
  { name: "Markdown Editor", path: "/markdown" },
  { name: "API Tester", path: "/api" },
  { name: "Snippet Vault", path: "/snippets" },
  { name: "Code Explainer", path: "/explain" },
];

const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col p-4 border-r border-gray-800">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">Dexlify 🚀</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`px-3 py-2 rounded-md transition-all duration-150 ${
              pathname === link.path
                ? "bg-gray-800 font-semibold text-white"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
