const Dashboard = () => {
  return (
    <div className="text-white space-y-6">
      <h1 className="text-3xl font-bold">👋 Welcome to Dexlify</h1>
      <p className="text-lg text-gray-300">
        🚀 Dexlify is your all-in-one developer utility suite:
      </p>
      <ul className="list-disc list-inside text-gray-400 space-y-1">
        <li>💾 Save and reuse code snippets</li>
        <li>🔍 Understand any code using AI</li>
        <li>🧪 Test APIs instantly</li>
        <li>🔠 Format, Test, and Edit your developer content</li>
      </ul>

      {/* Optional guest alert */}
      {/* <div className="bg-yellow-800 text-yellow-100 p-4 rounded">
        👤 You're in guest mode. Limited to 2 snippets. <a href="/signup" className="underline text-yellow-300">Sign up</a> to unlock full access.
      </div> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <a href="/json" className="bg-gray-800 p-4 rounded hover:bg-yellow-500 hover:text-black transition">
          🧾 JSON Formatter
        </a>
        <a href="/regex" className="bg-gray-800 p-4 rounded hover:bg-yellow-500 hover:text-black transition">
          🔍 Regex Tester
        </a>
        <a href="/markdown" className="bg-gray-800 p-4 rounded hover:bg-yellow-500 hover:text-black transition">
          📝 Markdown Editor
        </a>
        <a href="/snippets" className="bg-gray-800 p-4 rounded hover:bg-yellow-500 hover:text-black transition">
          💾 Snippet Vault
        </a>
        <a href="/explain" className="bg-gray-800 p-4 rounded hover:bg-yellow-500 hover:text-black transition">
          🧠 Code Explainer
        </a>
        <a href="/api" className="bg-gray-800 p-4 rounded hover:bg-yellow-500 hover:text-black transition">
          🔧 API Tester
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
