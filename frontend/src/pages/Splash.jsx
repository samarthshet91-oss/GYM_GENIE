import { motion } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoDark from "../assets/logo-dark.png";

const particles = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  left: `${6 + ((index * 29) % 88)}%`,
  top: `${8 + ((index * 31) % 82)}%`,
  delay: (index % 10) * 0.24,
  duration: 5.2 + (index % 6) * 0.38,
  size: index % 6 === 0 ? "h-1.5 w-1.5" : "h-1 w-1"
}));

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      navigate("/dashboard", { replace: true });
    }, 9200);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#010309] px-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(34,211,238,.11),transparent_30%),radial-gradient(circle_at_50%_72%,rgba(74,222,128,.08),transparent_34%),linear-gradient(180deg,#000_0%,#06101a_52%,#010309_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.026)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.018)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className={`absolute rounded-full bg-cyan-100/75 shadow-[0_0_14px_rgba(103,232,249,.72)] ${particle.size}`}
          style={{ left: particle.left, top: particle.top }}
          initial={{ opacity: 0, y: 18, scale: 0.25 }}
          animate={{ opacity: [0, 0.78, 0], y: [-4, -64], scale: [0.25, 1, 0.18] }}
          transition={{ delay: particle.delay, duration: particle.duration, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      <motion.div
        className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-[125px]"
        animate={{ opacity: [0.08, 0.42, 0.28, 0.38], scale: [0.78, 1.08, 1.22, 1.1] }}
        transition={{ duration: 9.2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/9 blur-[110px]"
        animate={{ opacity: [0.04, 0.32, 0.18, 0.28], scale: [0.7, 1.18, 1.04, 1.16] }}
        transition={{ duration: 9.2, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/0"
        animate={{
          opacity: [0, 0.26, 0.48, 0.16, 0],
          scale: [0.72, 1, 1.14, 1.28, 1.44],
          borderColor: [
            "rgba(103,232,249,0)",
            "rgba(103,232,249,.22)",
            "rgba(74,222,128,.36)",
            "rgba(34,211,238,.16)",
            "rgba(34,211,238,0)"
          ]
        }}
        transition={{ duration: 9.2, times: [0, 0.24, 0.48, 0.74, 1], ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 flex w-full max-w-[390px] flex-col items-center text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ duration: 9.2, times: [0, 0.18, 0.88, 1], ease: "easeInOut" }}
      >
        <motion.img
          src={logoDark}
          alt="GymGenie AI"
          draggable="false"
          className="h-72 w-72 rounded-[44px] object-cover shadow-[0_0_78px_rgba(34,211,238,.26)] max-[360px]:h-64 max-[360px]:w-64"
          initial={{ opacity: 0, scale: 0.82, filter: "blur(24px) drop-shadow(0 0 0 rgba(34,211,238,0))" }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            scale: [0.82, 1, 1.025, 1.015, 0.82],
            y: [18, 0, -8, 0, -18],
            filter: [
              "blur(24px) drop-shadow(0 0 0 rgba(34,211,238,0))",
              "blur(0px) drop-shadow(0 0 42px rgba(34,211,238,.36))",
              "blur(0px) drop-shadow(0 0 66px rgba(74,222,128,.34))",
              "blur(0px) drop-shadow(0 0 48px rgba(34,211,238,.30))",
              "blur(8px) drop-shadow(0 0 12px rgba(34,211,238,.10))"
            ]
          }}
          transition={{ duration: 9.2, times: [0, 0.22, 0.5, 0.82, 1], ease: "easeInOut" }}
        />

        <motion.div
          className="-mt-2"
          initial={{ opacity: 0, y: 14, letterSpacing: "0.18em" }}
          animate={{
            opacity: [0, 0, 1, 1, 0],
            y: [14, 14, 0, 0, -10],
            letterSpacing: ["0.18em", "0.18em", "0.32em", "0.36em", "0.42em"]
          }}
          transition={{ duration: 9.2, times: [0, 0.34, 0.46, 0.84, 1], ease: "easeInOut" }}
        >
          <p className="text-[11px] font-extrabold uppercase text-cyan-200">Your AI Fitness Coach</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
