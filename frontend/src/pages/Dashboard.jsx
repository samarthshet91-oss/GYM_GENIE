import { motion } from "framer-motion";
import { Activity, ArrowUpRight, Bell, Bot, Dumbbell, Flame, Salad, ShieldCheck, Sparkles, Target, Trophy, UserRound, Weight, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import GlassCard from "../components/GlassCard";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";
import { DASHBOARD_QUICK_ACTIONS } from "../utils/constants";
import cuteGenie from "../assets/cute-genie.png";
import faviconDark from "../assets/favicon-dark.png";
import cardio from "../assets/workouts/cardio.png";
import fullBody from "../assets/workouts/full-body.png";
import leg from "../assets/workouts/leg-day.png";
import upperBody from "../assets/workouts/upper-body.png";
import yoga from "../assets/workouts/yoga.png";

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

const actionIcons = [Dumbbell, Salad, Bot, Target, Activity];

const workoutImages = {
  "Upper Body Strength": upperBody,
  "Leg Day": leg,
  "Cardio Burn": cardio,
  "Yoga Flow": yoga,
  "Full Body": fullBody
};


function safeText(value, fallback = "--") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return fallback;
}

function safeNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  if (value && typeof value === "object") {
    return safeNumber(value.value ?? value.total ?? value.target ?? value.current, fallback);
  }
  return fallback;
}

function weightEntries(weightHistory) {
  return (weightHistory || []).filter((item) => {
    if (typeof item === "number") return Number.isFinite(item);
    return typeof item === "string" && item.trim() !== "" && Number.isFinite(Number(item));
  });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState({
    streak: 0,
    workouts_completed: 0,
    calories: 0,
    weight_history: []
  });

  useEffect(() => {
    function loadProgress() {
      apiRequest("/api/progress")
        .then((data) => setProgress(data.progress))
        .catch((error) => console.error("Failed to load dashboard progress:", error));
    }

    function handleProgressUpdate(event) {
      if (event.detail) setProgress(event.detail);
      loadProgress();
    }

    loadProgress();
    window.addEventListener("gymgenie:progress-updated", handleProgressUpdate);
    return () => window.removeEventListener("gymgenie:progress-updated", handleProgressUpdate);
  }, []);

  const weights = weightEntries(progress.weight_history);
  const trend = weights.length
    ? weights.map((value, index) => ({ day: `W${index + 1}`, value: safeNumber(value, 0) }))
    : fallbackTrend;

  const streak = safeNumber(progress.streak, 0);
  const workouts = safeNumber(progress.workouts_completed, 0);
  const score = Math.min(98, 72 + streak * 2 + workouts);
  const weight = weights.length ? weights[weights.length - 1] : user?.weight || "--";
  const calories = safeNumber(progress?.calories, 1580);
  const userName = safeText(user?.name, "Athlete");
  const userGoal = safeText(user?.goal, "Strength");
  const userLevel = safeText(user?.fitness_level, "Beginner");
  const workoutPlace = safeText(user?.workout_place, "your place");
  const dietType = safeText(user?.diet_type, "Balanced");
  const workoutTitle = (() => {
    const goal = String(userGoal).toLowerCase();
    if (goal.includes("leg")) return "Leg Day";
    if (goal.includes("cardio") || goal.includes("fat") || goal.includes("burn")) return "Cardio Burn";
    if (goal.includes("yoga") || goal.includes("mobility") || goal.includes("flex")) return "Yoga Flow";
    if (goal.includes("full") || goal.includes("general")) return "Full Body";
    if (goal.includes("strength") || goal.includes("muscle") || goal.includes("upper")) return "Upper Body Strength";
    return "Full Body";
  })();
  const workoutImage = workoutImages[workoutTitle] || workoutImages["Upper Body"];

  const progressCards = [
    { label: "Streak", value: streak, icon: Flame, tint: "text-orange-300" },
    { label: "Workouts", value: workouts, icon: Trophy, tint: "text-emerald-300" },
    { label: "Weight", value: safeText(weight), icon: Weight, tint: "text-cyan-300" },
    { label: "Score", value: score, icon: ShieldCheck, tint: "text-lime-300" }
  ];
  const quickActions = [
    ...DASHBOARD_QUICK_ACTIONS,
    { label: "Health Stats", route: "/progress" }
  ];

  return (
    <div className="relative">
      <motion.div
        className="pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-[105px]"
        animate={{ scale: [1, 1.18, 1], opacity: [0.32, 0.72, 0.32] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute -right-28 top-72 h-64 w-64 rounded-full bg-emerald-300/20 blur-[112px]"
        animate={{ scale: [1.08, 0.9, 1.08], opacity: [0.3, 0.68, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <motion.header
        className="relative z-10 mb-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
  <div className="h-10 w-10 overflow-hidden rounded-[14px] bg-transparent">
    <img
      src={faviconDark}
      alt="GymGenie AI"
      className="h-full w-full object-contain opacity-95"
    />
  </div>

  <div>
    <h2 className="bg-gradient-to-r from-lime-300 via-emerald-400 to-cyan-400 bg-clip-text text-xl font-extrabold text-transparent">
      GymGenie AI
    </h2>

    <p className="text-[11px] text-zinc-400">
      Premium fitness cockpit
    </p>
  </div>
</div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <motion.button whileTap={{ scale: 0.94 }} className="glass-card grid h-11 w-11 place-items-center rounded-2xl" type="button" aria-label="Notifications">
              <Bell size={18} />
            </motion.button>
            <motion.div whileTap={{ scale: 0.94 }}>
              <Link to="/profile" className="glass-card grid h-11 w-11 place-items-center rounded-2xl" aria-label="Profile">
                <UserRound size={18} />
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-[32px] leading-none">Hey {userName} <span aria-hidden="true">👋</span></h1>
            <p className="mt-2 text-sm text-muted">Ready to crush today's goals?</p>
          </div>
          <motion.div
            className="pill flex shrink-0 items-center gap-2 rounded-full border-emerald-300/30 px-3 py-2 text-xs font-extrabold text-emerald-200 light:text-emerald-700"
            animate={{ boxShadow: ["0 0 14px rgba(74,222,128,.10)", "0 0 26px rgba(34,211,238,.22)", "0 0 14px rgba(74,222,128,.10)"] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Flame size={15} />
            {streak} day
          </motion.div>
        </div>
      </motion.header>

      <GlassCard className="relative z-10 overflow-hidden rounded-[36px] p-5 pb-6" hover={false}>
        <motion.div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-300/35 blur-[92px]" animate={{ scale: [1, 1.13, 1] }} transition={{ duration: 5.5, repeat: Infinity }} />
        <motion.div className="absolute -bottom-28 left-12 h-72 w-72 rounded-full bg-emerald-300/28 blur-[104px]" animate={{ scale: [1.12, 0.95, 1.12] }} transition={{ duration: 6, repeat: Infinity }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(255,255,255,.18),transparent_22%),linear-gradient(135deg,rgba(34,211,238,.14),rgba(74,222,128,.10),transparent_68%)]" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300 light:text-emerald-700">Today's Workout</p>
              <h2 className="mt-3 font-display text-[36px] leading-[0.94]">{workoutTitle}</h2>
              <p className="mt-3 max-w-[215px] text-sm leading-6 text-muted">
                {userLevel} flow tuned for {workoutPlace} training.
              </p>
            </div>
            <div className="pill flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-extrabold text-cyan-200 light:text-cyan-700">
              <Zap size={14} />
              32 min
            </div>
          </div>

          <div className="mt-6 grid grid-cols-[1fr_142px] items-end gap-4 max-[380px]:grid-cols-1">
            <div>
              <div className="flex flex-wrap gap-2">
                <span className="pill rounded-full px-3 py-1.5 text-xs font-bold">{userLevel}</span>
                <span className="pill rounded-full px-3 py-1.5 text-xs font-bold">Guided burn</span>
              </div>
              <motion.div whileHover={{ y: -3, scale: 1.025 }} whileTap={{ scale: 0.98 }} className="mt-5 inline-flex">
                <Link to="/workout" className="neon-button inline-flex items-center gap-2 rounded-[24px] px-5 py-4 text-sm font-extrabold">
                  Start Workout
                  <ArrowUpRight size={17} />
                </Link>
              </motion.div>
            </div>

            <div className="relative h-78 overflow-visible">
              <img
                src={workoutImage}
                alt={workoutTitle}
                className="absolute right-[-20px] bottom-[-10px] h-[250px] w-[210px] object-contain scale-800"
                draggable="false"
              />
             
            </div>
          </div>
        </div>
      </GlassCard>

      <section className="relative z-10 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Progress Overview</h2>
          <span className="text-xs font-bold text-cyan-300 light:text-cyan-700">Live</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {progressCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} transition={{ delay: 0.08 + index * 0.05 }}>
                <GlassCard className="overflow-hidden rounded-[26px] p-4" hover={false}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Icon size={18} className={item.tint} />
                      <p className="mt-3 font-display text-[27px] leading-none">{safeText(item.value)}</p>
                      <p className="mt-1 text-xs font-bold text-muted">{item.label}</p>
                    </div>
                    <div className="h-12 w-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trend}>
                          <defs>
                            <linearGradient id={`miniGlow-${item.label}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.45} />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="value" stroke="#22d3ee" fill={`url(#miniGlow-${item.label})`} strokeWidth={2} dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </section>

      <GlassCard className="relative z-10 mt-4 p-4" hover={false}>
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300 light:text-cyan-700">Progress chart</p>
            <h2 className="mt-1 font-display text-xl">Weekly momentum</h2>
          </div>
          <Zap size={19} className="text-emerald-300 light:text-emerald-700" />
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="dashboardGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.6} />
                  <stop offset="55%" stopColor="#4ade80" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  border: "1px solid rgba(34,211,238,.18)",
                  borderRadius: 16,
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  backdropFilter: "blur(18px)"
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#4ade80" fill="url(#dashboardGlow)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="relative z-10 mt-4 overflow-hidden rounded-[32px] p-5" hover={false}>
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/24 blur-[72px]" />
        <div className="absolute -bottom-14 left-10 h-32 w-32 rounded-full bg-emerald-300/16 blur-[64px]" />
        <div className="relative flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300 light:text-emerald-700">AI Insight</p>
            <h2 className="mt-2 font-display text-2xl">Coach signal</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Consistency beats intensity. Finish today's workout and stay hydrated.
            </p>
            <Link to="/coach" className="soft-button mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold text-cyan-200 light:text-cyan-700">
              View Details
              <ArrowUpRight size={14} />
            </Link>
          </div>
          <motion.div animate={{ y: [0, -5, 0], scale: [1, 1.04, 1] }} transition={{ duration: 4, repeat: Infinity }} className="shrink-0">
            <img
              src={cuteGenie}
              alt="GymGenie mascot"
              className="h-51 w-44 object-contain drop-shadow-[0_0_35px_rgba(34,211,238,.34)]"
              draggable="false"
            />
          </motion.div>
        </div>
      </GlassCard>

      <section className="relative z-10 mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Today's Diet</h2>
          <span className="text-xs font-bold text-emerald-300 light:text-emerald-700">{calories} calories</span>
        </div>
        <div className="grid gap-3">
          {meals.map((meal) => {
            const percent = Math.min(100, Math.round((meal.kcal / 720) * 100));
            return (
              <GlassCard key={meal.title} className="flex items-center justify-between gap-4 rounded-[26px] p-4" hover={false}>
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-emerald-300 light:bg-emerald-50 light:text-emerald-700">
                    <Salad size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold">{meal.title}</p>
                    <p className="mt-1 text-xs text-muted">{dietType} plan</p>
                  </div>
                </div>
                <div
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[11px] font-extrabold text-cyan-100 shadow-[0_0_22px_rgba(74,222,128,.14)] light:text-slate-900"
                  style={{ background: `conic-gradient(#4ade80 ${percent}%, rgba(255,255,255,.08) 0)` }}
                >
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-950/85 light:bg-white/90">
                    {meal.kcal}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mt-5">
        <h2 className="mb-3 font-display text-xl">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, index) => {
            const Icon = actionIcons[index] || Sparkles;
            return (
              <motion.div key={action.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: 0.98 }} transition={{ delay: 0.12 + index * 0.05 }}>
                <Link
                  to={action.route}
                  className={`relative flex h-full min-h-[82px] overflow-hidden rounded-[26px] p-4 text-sm font-extrabold ${
                    index === 0 ? "neon-button" : "glass-card"
                  }`}
                >
                  <span className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-cyan-300/20 blur-2xl" />
                  <span className="relative flex flex-col justify-between">
                    <span className={`grid h-10 w-10 place-items-center rounded-2xl ${index === 0 ? "bg-slate-950/10" : "bg-white/5 text-cyan-300 light:bg-cyan-50 light:text-cyan-700"}`}>
                      <Icon size={19} />
                    </span>
                    <span>{safeText(action.label, "Action")}</span>
                  </span>
                  <ArrowUpRight className={`absolute right-4 top-4 ${index === 0 ? "text-slate-950" : "text-emerald-300 light:text-emerald-700"}`} size={16} />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
