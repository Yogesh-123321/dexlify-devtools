import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "@/lib/api";
import useAuth from "@/store/useAuthStore";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/signup", form);
      login(res.data.token, res.data.name);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto text-white">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 bg-zinc-800 rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
        <button type="submit" className="w-full bg-primary text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
