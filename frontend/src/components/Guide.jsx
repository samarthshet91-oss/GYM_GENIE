import { AnimatePresence, motion } from "framer-motion";
import { Bot, Dumbbell, LayoutDashboard, Salad, TrendingUp } from "lucide-react";
import { useState } from "react";
import GlassCard from "./GlassCard";

const steps = [
  { icon: LayoutDashboard, title: "Dashboard", text: "Your daily plan, streak, diet snapshot, progress, and AI insight live here." },
  { icon: Dumbbell, title: "Workout button", text: "Start guided sessions with a timer, exercise controls, and automatic completion logging." },
  { icon: Salad, title: "Diet section", text: "Use meal cards, calories, and AI diet notes to stay fueled without overthinking." },
  { icon: TrendingUp, title: "Progress", text: "Track weight, workouts, calories, achievements, and your consistency score." },
  { icon: Bot, title: "AI Coach", text: "Ask quick questions when you need training, food, recovery, or motivation help." }
];

export default function Guide() {
  const [seen, setSeen] = useState(() => localStorage.getItem("gymgenie_guide_seen") === "yes");
  const [step, setStep] = useState(0);

  if (seen) return null;

  const finish = () => {
    localStorage.setItem("gymgenie_guide_seen", "yes");
    setSeen(true);
  };

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-40 grid place-items-end bg-black/60 p-4 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-5" hover={false}>
        <AnimatePresence mode="wait">
          <motion.div key={current.title} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[.28em] text-cyan-300">Quick tour</p>
              <span className="pill rounded-full px-3 py-1 text-xs font-bold">{step + 1}/{steps.length}</span>
            </div>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
              <Icon size={22} />
            </div>
            <h3 className="mt-4 font-display text-2xl">{current.title}</h3>
            <p className="mt-3 text-sm leading-6 text-muted">{current.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex gap-3">
          <button onClick={finish} className="soft-btn flex-1 rounded-2xl py-3 font-bold">Skip</button>
          <button onClick={() => step === steps.length - 1 ? finish() : setStep(step + 1)} className="neon-btn flex-1 rounded-2xl py-3 font-extrabold">
            {step === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
