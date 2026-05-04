import { motion } from "framer-motion";
import { Bot, Dumbbell, PlayCircle, Salad, Sparkles, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";
import GlassCard from "../components/GlassCard";
import Modal from "../components/Modal";

const features = [
  { icon: Dumbbell, title: "Smart Workouts", className: "left-0 top-0" },
  { icon: Salad, title: "AI Diet Plans", className: "right-0 top-14" },
  { icon: TrendingUp, title: "Progress Tracking", className: "left-3 top-32" },
  { icon: Bot, title: "AI Coach", className: "right-8 top-48" }
];

export default function Landing() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="app-bg min-h-screen overflow-hidden px-4 py-6">
      <div className="phone-frame">
        <div className="page-wrap relative min-h-screen px-0 pb-8 pt-0">
          <motion.div className="absolute left-[-60px] top-20 h-48 w-48 rounded-full bg-cyan-300/20 blur-[100px]" animate={{ scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 5 }} />
          <motion.div className="absolute right-[-60px] top-72 h-56 w-56 rounded-full bg-emerald-300/20 blur-[110px]" animate={{ scale: [1.1, 1, 1.1] }} transition={{ repeat: Infinity, duration: 5.5 }} />

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrandMark small />
              <div>
                <p className="text-sm font-extrabold">GymGenie AI</p>
                <p className="text-xs text-muted">Your AI Fitness Coach</p>
              </div>
            </div>
            <Sparkles className="text-emerald-300" size={20} />
          </div>

          <div className="relative z-10 mt-12 text-center">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} className="mx-auto grid h-28 w-28 place-items-center rounded-[36px] bg-white/5 neon-ring">
              <BrandMark />
            </motion.div>
            <h1 className="mt-8 font-display text-[44px] leading-[0.95]">Train Smarter with AI</h1>
            <p className="mx-auto mt-4 max-w-[310px] text-sm leading-6 text-muted">
              Your personal AI trainer, dietician, and motivation coach.
            </p>
          </div>

          <div className="relative mt-9 h-[250px]">
            <div className="absolute left-1/2 top-10 h-36 w-36 -translate-x-1/2 rounded-full orb-visual shadow-[0_0_80px_rgba(34,211,238,.22)]" />
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  className={`glass-card absolute flex items-center gap-2 rounded-[24px] px-3 py-3 ${feature.className}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
                    <Icon size={16} />
                  </span>
                  <span className="whitespace-nowrap text-xs font-extrabold">{feature.title}</span>
                </motion.div>
              );
            })}
          </div>

          <GlassCard className="relative z-10 mt-2 p-4" hover={false}>
            <div className="grid gap-3">
              <Link to="/login" className="neon-button rounded-[24px] px-5 py-4 text-center text-sm font-extrabold">
                Login
              </Link>
              <Link to="/register" className="glass-card rounded-[24px] px-5 py-4 text-center text-sm font-extrabold">
                Register
              </Link>
              <button type="button" onClick={() => setShowDemo(true)} className="soft-btn flex items-center justify-center gap-2 rounded-[24px] px-5 py-4 text-sm font-bold">
                <PlayCircle size={18} />
                Watch Demo
              </button>
            </div>
          </GlassCard>
        </div>
      </div>

      <Modal open={showDemo} onClose={() => setShowDemo(false)}>
        <div className="text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
            <PlayCircle size={24} />
          </div>
          <h2 className="font-display text-2xl">GymGenie AI Demo</h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            Register through one-card onboarding, open your premium dashboard, start a workout, view meals, track progress, and chat with your coach.
          </p>
        </div>
      </Modal>
    </div>
  );
}
