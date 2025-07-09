import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import useAuthStore from "@/store/useAuthStore";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      login(res.data.token, res.data.name);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Log In</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 bg-zinc-800 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 bg-zinc-800 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
