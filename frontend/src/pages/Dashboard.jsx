import React from "react";
// If you're using React Router or Next.js, import Link instead of <a>
// import { Link } from "react-router-dom";

const Dashboard = () => {
  // Simulated user state — replace with actual state management later
  const isGuest = true;
  const snippetsCount = 5;
  const explanationsCount = 3;

  const tools = [
    {
      href: "/json",
      icon: "🧾",
      name: "JSON Formatter",
      desc: "Clean & Minify your JSON with ease.",
    },
    {
      href: "/regex",
      icon: "🔍",
      name: "Regex Tester",
      desc: "Test & debug your regex patterns.",
    },
    {
      href: "/markdown",
      icon: "📝",
      name: "Markdown Editor",
      desc: "Write markdown with live preview.",
    },
    {
      href: "/snippets",
      icon: "💾",
      name: "Snippet Vault",
      desc: "Save & reuse your code snippets.",
    },
    {
      href: "/explain",
      icon: "🧠",
      name: "Code Explainer",
      desc: "AI-powered code understanding.",
    },
    {
      href: "/api",
      icon: "🔧",
      name: "API Tester",
      desc: "Send requests & test your APIs.",
    },
    {
      href: "/color",
      icon: "🎨",
      name: "Color Picker",
      desc: "Pick and explore color palettes.",
    },
    {
      href: "/theme",
      icon: "🌈",
      name: "Theme Generator",
      desc: "Create beautiful themes effortlessly.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      {/* Header */}
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-primary-foreground">
          👋 Welcome to <span className="text-primary">Dexlify</span>
        </h1>

        <p className="text-primary-foreground/80 text-lg max-w-3xl mx-auto">

          Your all-in-one developer utility suite designed to supercharge your
          workflow. From code snippets to API testing — everything in one place.
        </p>

        {isGuest && (
          <div className="mt-6 bg-yellow-900 text-yellow-100 p-3 rounded max-w-md mx-auto">
            👤 You’re in <strong>Guest Mode</strong>. Limited to 2 snippets and
            explanations.{" "}
            <a
              href="/signup"
              className="underline font-semibold hover:text-yellow-300"
            >
              Sign up
            </a>{" "}
            to unlock full access.
          </div>
        )}
      </section>

      {/* Usage Stats */}
      <section className="mb-12 flex justify-center gap-12 text-primary-foreground/70 text-center">
        <div>
          <h2 className="text-3xl font-bold text-yellow-400">{snippetsCount}</h2>
          <p>Snippets saved</p>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-yellow-400">{explanationsCount}</h2>
          <p>Codes explained</p>
        </div>
      </section>

      {/* Tools Grid */}
      <section>
        <h3 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">
          Explore Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tools.map(({ href, icon, name, desc }) => (
           <a
  key={name}
  href={href}
  className="group border border-primary bg-primary text-primary-foreground p-6 rounded-lg shadow-md hover:bg-primary/80 transition-colors duration-200 flex flex-col"
>
  <span className="text-4xl mb-4">{icon}</span>
  <h4 className="text-xl font-semibold mb-2">{name}</h4>
  <p className="text-sm text-primary-foreground/80 flex-grow">{desc}</p>
  <span className="mt-4 font-semibold text-yellow-300">Try it →</span>
</a>




          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-700 pt-8 text-gray-500 text-center text-sm">
        <p>✨ Made with 💛 for developers.</p>
        <p>
          Join our{" "}
          <a
            href="https://discord.gg/yourdiscord"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-400"
          >
            Discord Community
          </a>{" "}
          or check our{" "}
          <a
            href="https://github.com/Yogesh-123321"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-400"
          >
            GitHub
          </a>
          .
        </p>
        <p className="mt-2 italic text-gray-600">
          v1.0 coming soon: snippet history, cloud sync & more!
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
