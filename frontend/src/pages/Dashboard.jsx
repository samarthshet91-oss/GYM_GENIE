import { motion } from "framer-motion";
import { ArrowUpRight, Bell, Bot, Dumbbell, Flame, Salad, ShieldCheck, Sparkles, Target, Trophy, UserRound, Weight, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import BrandMark from "../components/BrandMark";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { DASHBOARD_QUICK_ACTIONS } from "../utils/constants";

const fallbackTrend = [
  { day: "M", value: 32 },
  { day: "T", value: 40 },
  { day: "W", value: 34 },
  { day: "T", value: 54 },
  { day: "F", value: 48 },
  { day: "S", value: 62 },
  { day: "S", value: 68 }
];

const meals = [
  { title: "Breakfast", kcal: 420 },
  { title: "Lunch", kcal: 620 },
  { title: "Dinner", kcal: 540 }
];

const actionIcons = [Dumbbell, Salad, Bot, Target];

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    streak: 0,
    workouts_completed: 0,
    calories: 0,
    weight_history: []
  });

  useEffect(() => {
    apiRequest("/api/progress")
      .then((data) => setProgress(data.progress))
      .catch(() => {});
  }, []);

  const trend = progress.weight_history?.length
    ? progress.weight_history.map((value, index) => ({ day: `W${index + 1}`, value: Number(value) }))
    : fallbackTrend;

  const score = Math.min(98, 72 + Number(progress.streak || 0) * 2 + Number(progress.workouts_completed || 0));
  const weight = progress.weight_history?.length ? progress.weight_history[progress.weight_history.length - 1] : user?.weight || "--";

  return (
    <div>
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandMark small />
          <div>
            <p className="text-sm font-extrabold">GymGenie AI</p>
            <p className="text-xs text-muted">Premium fitness cockpit</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="glass-card grid h-11 w-11 place-items-center rounded-2xl" type="button" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <Link to="/profile" className="glass-card grid h-11 w-11 place-items-center rounded-2xl" aria-label="Profile">
            <UserRound size={18} />
          </Link>
        </div>
      </header>

      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] leading-none">Hey {user?.name || "Athlete"} 👋</h1>
          <p className="mt-2 text-sm text-muted">Ready to crush today's goals?</p>
        </div>
        <div className="pill flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-extrabold text-emerald-200">
          <Flame size={15} />
          {progress.streak || 0} day
        </div>
      </div>

      <GlassCard className="relative overflow-hidden p-5" hover={false}>
        <div className="absolute right-[-30px] top-[-34px] h-40 w-40 rounded-full bg-cyan-300/20 blur-[80px]" />
        <div className="absolute bottom-[-55px] right-6 h-36 w-36 rounded-full bg-emerald-300/20 blur-[70px]" />
        <div className="relative flex gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Today's Workout</p>
            <h2 className="mt-3 font-display text-[29px] leading-tight">{user?.goal || "Strength"} Session</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="pill rounded-full px-3 py-1.5 text-xs font-bold">32 min</span>
              <span className="pill rounded-full px-3 py-1.5 text-xs font-bold">{user?.fitness_level || "Beginner"}</span>
            </div>
            <Link to="/workout" className="neon-button mt-5 inline-flex items-center gap-2 rounded-[20px] px-4 py-3 text-xs font-extrabold">
              Start Workout
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="relative grid h-36 w-28 shrink-0 place-items-center rounded-[30px] bg-white/5">
            <div className="absolute h-28 w-28 rounded-full orb-visual" />
            <Dumbbell className="relative text-slate-950 drop-shadow" size={34} strokeWidth={2.6} />
          </div>
        </div>
      </GlassCard>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Progress Overview</h2>
          <span className="text-xs font-bold text-cyan-300">Live</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Streak", value: progress.streak || 0, icon: Flame },
            { label: "Workouts", value: progress.workouts_completed || 0, icon: Trophy },
            { label: "Weight", value: weight, icon: Weight },
            { label: "Score", value: score, icon: ShieldCheck }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <GlassCard key={item.label} className="p-3" hover={false}>
                <Icon size={16} className="text-cyan-300" />
                <p className="mt-3 font-display text-[22px] leading-none">{item.value}</p>
                <p className="mt-1 truncate text-[10px] font-bold text-muted">{item.label}</p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <GlassCard className="mt-4 p-4" hover={false}>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">Mini chart</p>
            <h2 className="mt-1 font-display text-xl">Weekly momentum</h2>
          </div>
          <Zap size={19} className="text-emerald-300" />
        </div>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="dashboardGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#4ade80" fill="url(#dashboardGlow)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="mt-4 overflow-hidden p-5" hover={false}>
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-[24px] bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
            <Bot size={28} />
          </div>
          <div>
            <p className="font-display text-xl">AI Insight</p>
            <p className="mt-1 text-sm leading-6 text-muted">
              Keep today's workout controlled and finish with protein. Consistency beats intensity spikes.
            </p>
          </div>
        </div>
      </GlassCard>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Today's Diet</h2>
          <span className="text-xs font-bold text-emerald-300">{typeof progress?.calories === "number" ? progress.calories : 1580} calories</span>
        </div>
        <div className="grid gap-3">
          {meals.map((meal) => (
            <GlassCard key={meal.title} className="flex items-center justify-between p-4" hover={false}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-emerald-300">
                  <Salad size={18} />
                </div>
                <div>
                  <p className="font-bold">{meal.title}</p>
                  <p className="text-xs text-muted">{user?.diet_type || "Balanced"} plan</p>
                </div>
              </div>
              <p className="text-sm font-extrabold text-cyan-300">{meal.kcal}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 font-display text-xl">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {DASHBOARD_QUICK_ACTIONS.map((action, index) => {
            const Icon = actionIcons[index] || Sparkles;
            console.log("progress:", progress);
            return (
              <motion.div key={action.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + index * 0.05 }}>
                <Link to={action.route} className={`flex h-full items-center gap-3 rounded-[24px] p-4 text-sm font-extrabold ${index === 0 ? "neon-button" : "glass-card"}`}>
                  <Icon size={18} />
                  <span>{action.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
