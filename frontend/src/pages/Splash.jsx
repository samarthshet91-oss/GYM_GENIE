import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import { useAuth } from "../context/AuthContext";

export default function Splash() {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate(token ? "/dashboard" : "/landing", { replace: true });
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [navigate, token]);

  return (
    <div className="app-bg flex min-h-screen items-center justify-center overflow-hidden px-6">
      <motion.div
        className="relative text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div
          className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-emerald-300/20 blur-[90px]"
          animate={{ scale: [1, 1.22, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
        />
        <motion.div
          className="mx-auto mb-6 flex w-fit items-center justify-center"
          animate={{ boxShadow: ["0 0 0 rgba(34,211,238,0)", "0 0 60px rgba(34,211,238,.28)", "0 0 0 rgba(34,211,238,0)"] }}
          transition={{ repeat: Infinity, duration: 2.1 }}
        >
          <BrandMark />
        </motion.div>
        <h1 className="font-display text-4xl">GymGenie AI</h1>
        <p className="mt-2 text-sm uppercase tracking-[0.28em] text-cyan-300">Your AI Fitness Coach</p>
      </motion.div>
    </div>
  );
}
