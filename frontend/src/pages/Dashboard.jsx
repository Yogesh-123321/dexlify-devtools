import { motion } from "framer-motion";
import useAuthStore from "@/store/useAuthStore";

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const isGuest = !user || user === "guest";

  const tools = [
    { href: "/json", icon: "🧾", name: "JSON Formatter", desc: "Clean & Minify your JSON with ease." },
    { href: "/regex", icon: "🔍", name: "Regex Tester", desc: "Test & debug your regex patterns." },
    { href: "/markdown", icon: "📝", name: "Markdown Editor", desc: "Write markdown with live preview." },
    { href: "/snippets", icon: "💾", name: "Snippet Vault", desc: "Save & reuse your code snippets." },
    { href: "/explain", icon: "🧠", name: "Code Explainer", desc: "AI-powered code understanding." },
    { href: "/api", icon: "🔧", name: "API Tester", desc: "Send requests & test your APIs." },
    { href: "/color", icon: "🎨", name: "Color Picker", desc: "Pick and explore color palettes." },
    { href: "/theme", icon: "🌈", name: "Theme Generator", desc: "Create beautiful themes effortlessly." },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      {/* Hero Section */}
      <motion.section
        className="mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-extrabold mb-4">
          👋 Welcome to <span className="text-yellow-400">Dexlify</span>
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
          Your all-in-one developer utility suite designed to supercharge your workflow.
          From code snippets to API testing — everything in one place.
        </p>

        {isGuest && (
          <motion.div
            className="mt-6 bg-yellow-900 text-yellow-100 p-3 rounded max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            👤 You’re in <strong>Guest Mode</strong>.{" "}
            <a href="/signup" className="underline font-semibold hover:text-yellow-300">
              Sign up
            </a>{" "}
            to unlock full features.
          </motion.div>
        )}
      </motion.section>

      {/* Why Choose Dexlify Section */}
      <motion.section
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div
          className="bg-zinc-800 p-6 sm:p-8 rounded-lg shadow-md"
          variants={fadeUp}
          custom={0}
        >
          <h3 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">
            Why Choose Dexlify?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                title: "⚡ Fast Tools",
                desc: "Lightning-fast utilities optimized for productivity.",
              },
              {
                title: "🧠 Smart AI",
                desc: "Use AI to explain and understand code instantly.",
              },
              {
                title: "📦 All-in-One",
                desc: "Access all dev tools in one seamless dashboard.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i + 1}
                className="bg-zinc-900 p-4 rounded-md hover:bg-zinc-700 hover:scale-[1.02] hover:shadow-lg transition-all duration-300"
              >
                <h4 className="text-lg font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Tool Grid Section */}
      <section>
        <h3 className="text-2xl font-semibold mb-6 text-yellow-400 text-center">
          Explore Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tools.map(({ href, icon, name, desc }, i) => (
            <motion.a
              key={name}
              href={href}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="bg-primary text-primary-foreground p-6 rounded-lg shadow hover:shadow-yellow-400/30 hover:bg-primary/90 hover:scale-105 transition-all duration-300 flex flex-col"
            >
              <span className="text-4xl mb-4">{icon}</span>
              <h4 className="text-xl font-semibold mb-2">{name}</h4>
              <p className="text-gray-800 flex-grow">{desc}</p>
              <span className="mt-4 font-semibold">Try it →</span>
            </motion.a>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-16 border-t border-gray-700 pt-8 text-gray-500 text-center text-sm">
        <p>✨ Made with 💛 for developers.</p>
        <p>
          Join our{" "}
          <a
            href="https://discord.gg/WysPNEWz"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-400"
          >
            Discord
          </a>{" "}
          or check our{" "}
          <a
            href="https://github.com/Yogesh-123321/dexlify-devtools"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-yellow-400"
          >
            GitHub
          </a>.
        </p>
        <p className="mt-2 italic text-gray-600">
          v1.0 coming soon: snippet history, cloud sync & more!
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
