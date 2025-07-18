import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import useAuth from "@/store/useAuthStore";
import { toast } from "sonner";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", form);
      login(res.data.token, res.data.name);
      toast.success("✅ Signup successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black">
      <div className="w-full max-w-sm bg-zinc-900 rounded-lg shadow p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">📝 Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Pro Developer"
              className="w-full p-2 bg-zinc-800 text-white rounded focus:outline-none focus:ring focus:ring-primary"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full p-2 bg-zinc-800 text-white rounded focus:outline-none focus:ring focus:ring-primary"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-2 bg-zinc-800 text-white rounded focus:outline-none focus:ring focus:ring-primary"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
