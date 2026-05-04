import { Award, BadgeCheck, Flame, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GlassCard from "../components/GlassCard";
import { apiRequest } from "../services/api";

const fallbackWeight = [
  { label: "W1", value: 78 },
  { label: "W2", value: 77.4 },
  { label: "W3", value: 76.8 },
  { label: "W4", value: 76.5 }
];

const fallbackWorkouts = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 0 },
  { label: "Wed", value: 1 },
  { label: "Thu", value: 1 },
  { label: "Fri", value: 0 },
  { label: "Sat", value: 1 }
];

export default function Progress() {
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

  const weightData = progress.weight_history?.length
    ? progress.weight_history.map((item, index) => ({ label: `W${index + 1}`, value: Number(item) }))
    : fallbackWeight;

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm font-bold text-cyan-300">Progress</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">Your Momentum</h1>
        <p className="mt-2 text-sm text-muted">Charts, achievements, and AI signals for smarter consistency.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <GlassCard className="p-4" hover={false}>
          <Flame size={18} className="text-orange-300" />
          <p className="mt-3 font-display text-3xl">{progress.streak || 0}</p>
          <p className="text-xs text-muted">Streak</p>
        </GlassCard>
        <GlassCard className="p-4" hover={false}>
          <Zap size={18} className="text-cyan-300" />
          <p className="mt-3 font-display text-3xl">{progress.calories || 0}</p>
          <p className="text-xs text-muted">Calories</p>
        </GlassCard>
        <GlassCard className="p-4" hover={false}>
          <Award size={18} className="text-emerald-300" />
          <p className="mt-3 font-display text-3xl">{progress.workouts_completed || 0}</p>
          <p className="text-xs text-muted">Sessions</p>
        </GlassCard>
      </div>

      <GlassCard className="mt-4 p-5" hover={false}>
        <h2 className="font-display text-xl">Weight line chart</h2>
        <div className="mt-4 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <CartesianGrid stroke="rgba(255,255,255,.08)" vertical={false} />
              <XAxis dataKey="label" stroke="#8aa0b4" tickLine={false} axisLine={false} />
              <YAxis stroke="#8aa0b4" tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4, fill: "#4ade80" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="mt-4 p-5" hover={false}>
        <h2 className="font-display text-xl">Workout bar chart</h2>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fallbackWorkouts}>
              <XAxis dataKey="label" stroke="#8aa0b4" tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#4ade80" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard className="mt-4 p-5" hover={false}>
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-emerald-300">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-bold">AI insight</p>
            <p className="mt-2 text-sm leading-6 text-muted">Your strongest trend is consistency. Add one recovery walk to protect the streak without overtraining.</p>
          </div>
        </div>
      </GlassCard>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {["First streak", "Meal focus", "Workout logged", "Coach ready"].map((badge) => (
          <GlassCard key={badge} className="flex items-center gap-3 p-4" hover={false}>
            <BadgeCheck size={18} className="text-cyan-300" />
            <span className="text-sm font-bold">{badge}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
