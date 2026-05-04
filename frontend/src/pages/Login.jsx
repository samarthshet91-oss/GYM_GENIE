import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-bg flex min-h-screen items-center px-4">
      <div className="phone-frame grid place-items-center">
      <GlassCard className="mx-auto w-full max-w-[398px] p-6" hover={false}>
        <Link to="/landing" className="soft-btn mb-6 inline-flex h-11 w-11 items-center justify-center rounded-2xl" aria-label="Back">
          <ArrowLeft size={18} />
        </Link>
        <div className="mb-8 flex items-center gap-4">
          <BrandMark small />
          <div>
            <h1 className="font-display text-3xl">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted">Pick up where your momentum left off.</p>
          </div>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold">
            Email
            <div className="input-shell flex items-center gap-3 rounded-[22px] px-4 py-1">
              <Mail size={18} className="text-cyan-300" />
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-w-0 flex-1 bg-transparent py-4 outline-none" placeholder="you@example.com" required />
            </div>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Password
            <div className="input-shell flex items-center gap-3 rounded-[22px] px-4 py-1">
              <Lock size={18} className="text-emerald-300" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="min-w-0 flex-1 bg-transparent py-4 outline-none" placeholder="Your password" required />
            </div>
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="neon-button mt-2 flex items-center justify-center gap-2 rounded-[22px] px-5 py-4 text-sm font-extrabold disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
            <ArrowRight size={18} />
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Need an account?{" "}
          <Link className="font-bold text-cyan-300" to="/register">
            Register
          </Link>
        </p>
      </GlassCard>
      </div>
    </div>
  );
}
