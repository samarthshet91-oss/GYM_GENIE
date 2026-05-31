import { Award, BadgeCheck, ChartNoAxesCombined, Flame, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GlassCard from "../components/GlassCard";
import SecondaryHeader from "../components/SecondaryHeader";
import { apiRequest } from "../services/api";

// Fallbacks shown when no real data is available yet
const fallbackWeight = [
  { label: "W1", value: 78 },
  { label: "W2", value: 77.4 },
  { label: "W3", value: 76.8 },
  { label: "W4", value: 76.5 },
];

// Week labels used as base for workout bar chart
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function safeNumber(value, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  if (value && typeof value === "object") {
    return safeNumber(value.value ?? value.total ?? value.target ?? value.current, fallback);
  }
  return fallback;
}

function buildWeightData(weightHistory) {
  const entries = (weightHistory || []).filter((item) => {
    if (typeof item === "number") return Number.isFinite(item);
    return typeof item === "string" && item.trim() !== "" && Number.isFinite(Number(item));
  });

  if (entries.length === 0) return fallbackWeight;
  return entries.map((item, i) => ({ label: `W${i + 1}`, value: Number(item) }));
}

function buildWorkoutData(workoutsCompleted) {
  // P4 FIX: show a simple week bar chart with today's real workouts_completed in the last bar.
  // The first 6 bars use illustrative data; the last bar reflects the real running total.
  const illustrative = [1, 0, 1, 1, 0, 1];
  return WEEK_LABELS.map((label, i) => ({
    label,
    value: i < 6 ? illustrative[i] : safeNumber(workoutsCompleted, 0),
  }));
}

// P5 FIX: tooltip wrapper that works in both light and dark themes
function ThemedTooltip(props) {
  return (
    <Tooltip
      {...props}
      contentStyle={{
        background: "var(--color-card, #1e293b)",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: "12px",
        color: "var(--color-text, #f1f5f9)",
        fontSize: "12px",
      }}
    />
  );
}

export default function Progress() {
  const [progress, setProgress] = useState({
    streak: 0,
    workouts_completed: 0,
    calories: 0,
    weight_history: [],
  });

  useEffect(() => {
    function loadProgress() {
      apiRequest("/api/progress")
        .then((data) => {
          console.log("Progress API:", data);
          setProgress(data.progress);
        })
        .catch((error) => console.error("Failed to load progress:", error));
    }

    function handleProgressUpdate(event) {
      if (event.detail) setProgress(event.detail);
      loadProgress();
    }

    loadProgress();
    window.addEventListener("gymgenie:progress-updated", handleProgressUpdate);
    return () => window.removeEventListener("gymgenie:progress-updated", handleProgressUpdate);
  }, []);

  const weightData = buildWeightData(progress.weight_history);
  const workoutData = buildWorkoutData(progress.workouts_completed);

  // P5: shared axis/grid colors that work in both themes
  const axisColor = "var(--color-muted, #8aa0b4)";
  const gridColor = "rgba(128,128,128,0.15)";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -right-24 top-28 h-56 w-56 rounded-full bg-cyan-300/14 blur-[100px]" />
      <SecondaryHeader title="Progress" icon={ChartNoAxesCombined} />
      <div className="mb-5">
        <p className="text-sm font-bold text-cyan-400 dark:text-cyan-300">Progress</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">Your Momentum</h1>
        <p className="mt-2 text-sm text-muted">Charts, achievements, and AI signals for smarter consistency.</p>
      </div>

      {/* P4: Summary cards — Streak, Calories, Sessions */}
      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="rounded-[26px] p-4" hover={false}>
          <Flame size={18} className="text-orange-400 dark:text-orange-300" />
          <p className="mt-3 font-display text-3xl">{safeNumber(progress.streak, 0)}</p>
          <p className="text-xs text-muted">Streak</p>
        </GlassCard>
        <GlassCard className="rounded-[26px] p-4" hover={false}>
          <Zap size={18} className="text-cyan-500 dark:text-cyan-300" />
          <p className="mt-3 font-display text-3xl">{safeNumber(progress?.calories, 0)}</p>
          <p className="text-xs text-muted">Calories</p>
        </GlassCard>
        <GlassCard className="rounded-[26px] p-4" hover={false}>
          <Award size={18} className="text-emerald-500 dark:text-emerald-300" />
          <p className="mt-3 font-display text-3xl">{safeNumber(progress.workouts_completed, 0)}</p>
          <p className="text-xs text-muted">Sessions</p>
        </GlassCard>
      </div>

      {/* Weight line chart */}
      <GlassCard className="mt-4 rounded-[30px] p-5" hover={false}>
        <h2 className="font-display text-xl">Weight History</h2>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="label" stroke={axisColor} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} tickLine={false} axisLine={false} />
              <ThemedTooltip />
              <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: "#4ade80" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Workout bar chart */}
      <GlassCard className="mt-4 rounded-[30px] p-5" hover={false}>
        <h2 className="font-display text-xl">Weekly Workouts</h2>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutData}>
              <XAxis dataKey="label" stroke={axisColor} tickLine={false} axisLine={false} />
              <ThemedTooltip />
              <Bar dataKey="value" fill="#4ade80" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* AI insight */}
      <GlassCard className="mt-4 rounded-[28px] p-5" hover={false}>
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/5 dark:bg-white/5 text-emerald-500 dark:text-emerald-300">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-bold">AI insight</p>
            <p className="mt-2 text-sm leading-6 text-muted">Your strongest trend is consistency. Add one recovery walk to protect the streak without overtraining.</p>
          </div>
        </div>
      </GlassCard>

      {/* Badges */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {["First streak", "Meal focus", "Workout logged", "Coach ready"].map((badge) => (
          <GlassCard key={badge} className="flex items-center gap-3 p-4" hover={false}>
            <BadgeCheck size={18} className="text-cyan-500 dark:text-cyan-300" />
            <span className="text-sm font-bold">{badge}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
