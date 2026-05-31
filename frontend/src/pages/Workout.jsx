import { CheckCircle2, Dumbbell as DumbbellIcon, Pause, Play, RotateCcw, SkipForward, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import GlassCard from "../components/GlassCard";
import SecondaryHeader from "../components/SecondaryHeader";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const defaultExercises = ["Mobility Warmup", "Bodyweight Squats", "Push Ups", "Alternating Lunges", "Plank Hold", "Cooldown"];
const workoutPlans = {
  "Fat loss": [
    { name: "Jumping Jacks", detail: "3 sets x 40 sec" },
    { name: "Mountain Climbers", detail: "3 sets x 30 sec" },
    { name: "High Knees", detail: "3 sets x 40 sec" },
    { name: "Burpees", detail: "3 sets x 10 reps" },
    { name: "Plank", detail: "45 sec hold" },
  ],
  "Muscle gain": [
    { name: "Push-ups", detail: "4 sets x 12 reps" },
    { name: "Squats", detail: "4 sets x 12 reps" },
    { name: "Dumbbell Rows", detail: "4 sets x 10 reps" },
    { name: "Lunges", detail: "3 sets x 12 reps" },
    { name: "Shoulder Press", detail: "3 sets x 10 reps" },
  ],
  Strength: [
    { name: "Squats", detail: "5 sets x 5 reps" },
    { name: "Push-ups", detail: "4 sets x 10 reps" },
    { name: "Rows", detail: "4 sets x 8 reps" },
    { name: "Lunges", detail: "3 sets x 10 reps" },
    { name: "Plank", detail: "60 sec hold" },
  ],
  Endurance: [
    { name: "Jog in Place", detail: "3 sets x 2 min" },
    { name: "Step-ups", detail: "3 sets x 20 reps" },
    { name: "Bodyweight Squats", detail: "3 sets x 20 reps" },
    { name: "Jump Rope", detail: "3 sets x 1 min" },
    { name: "Side Plank", detail: "30 sec each side" },
  ],
  "Healthy lifestyle": [
    { name: "Mobility Warmup", detail: "5 minutes" },
    { name: "Bodyweight Squats", detail: "3 sets x 12 reps" },
    { name: "Wall Push-ups", detail: "3 sets x 10 reps" },
    { name: "Glute Bridge", detail: "3 sets x 12 reps" },
    { name: "Stretching", detail: "5 minutes" },
  ],
};
const EXERCISE_CALORIES = 50;

function safeText(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

function publishProgressUpdate(progress) {
  window.dispatchEvent(new CustomEvent("gymgenie:progress-updated", { detail: progress }));
}

function cleanAiLine(line) {
  return line
    .replace(/^#+\s*/, "")
    .replace(/^\s*[-*]\s*/, "")
    .replace(/^\s*\d+[.)]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function parseWorkoutCards(text, fallbackCards) {
  const lines = String(text || "")
    .split("\n")
    .map(cleanAiLine)
    .filter(Boolean)
    .filter((line) => !/^(warmup|main exercises|sets and reps|cooldown|safety tips)\s*:?$/i.test(line));

  const cards = lines
    .map((line) => {
      const withoutLabel = line.replace(/^(exercise\s*)?\d+\s*[:.-]\s*/i, "");
      const [namePart, ...detailParts] = withoutLabel.split(/\s[-–:]\s/);
      const name = cleanAiLine(namePart);
      const detail = cleanAiLine(detailParts.join(" - ")) || "Move with control and keep clean form.";
      if (!name || name.length > 48) return null;
      if (/^(warmup|cooldown|safety|tip|main)$/i.test(name)) return null;
      return { name, detail };
    })
    .filter(Boolean)
    .slice(0, 6);

  return cards.length >= 4 ? cards : fallbackCards;
}

// ─── Daily cache helpers ──────────────────────────────────────────────────────
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function workoutCacheKey(userId) {
  return `gymgenie_daily_workout_${userId || "guest"}_${todayKey()}`;
}

export default function Workout() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [finished, setFinished] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [exerciseCards, setExerciseCards] = useState(workoutPlans["Healthy lifestyle"]);

  const sessionExercises = useMemo(() => exerciseCards.map((e) => e.name), [exerciseCards]);
  const completedCount = exerciseCards.filter((e) => completedExercises.includes(e.name)).length;
  const completionPercent = Math.round((completedCount / exerciseCards.length) * 100);

  // Load profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest("/api/user/profile");
        setProfile(data.user);
      } catch (error) {
        console.log(error);
      }
    }
    loadProfile();
  }, []);

  // P1 FIX: Load today's workout from /api/workout/today (GET).
  // Backend generates once and stores in Supabase; same-day refreshes return the cached row.
  // Frontend also caches in localStorage so it's instant on subsequent renders.
  useEffect(() => {
    if (!profile || !user?.id) return;

    const fallbackCards = workoutPlans[profile?.goal] || workoutPlans["Healthy lifestyle"];
    const cacheKey = workoutCacheKey(user.id);
    const cached = localStorage.getItem(cacheKey);

    // Immediately show cached cards while fetching
    if (cached) {
      try {
        const parsed = parseWorkoutCards(cached, fallbackCards);
        setExerciseCards(parsed);
      } catch {
        // ignore parse error, will be overwritten by API response
      }
    }

    async function loadTodayWorkout() {
      try {
        // GET /api/workout/today — returns existing or newly generated workout
        const data = await apiRequest("/api/workout/today");
        console.log("Daily workout response:", data);
        const row = data.workout || {};
        const workoutText = safeText(row.workout, cached || "");

        if (workoutText) {
          const cards = parseWorkoutCards(workoutText, fallbackCards);
          setExerciseCards(cards);
          localStorage.setItem(cacheKey, workoutText);
        } else {
          setExerciseCards(fallbackCards);
        }
      } catch (error) {
        console.error("Daily workout load failed:", error.data || error);
        if (!cached) setExerciseCards(fallbackCards);
      }
    }

    loadTodayWorkout();
  }, [profile, user?.id]);

  // Load completed exercises for today
  useEffect(() => {
    if (!user?.id) return undefined;
    let isMounted = true;

    async function fetchCompletedExercises() {
      try {
        const data = await apiRequest("/api/progress");
        const todayExercises = (data.progress?.completed_exercises_today || [])
          .map((n) => safeText(n))
          .filter((n) => exerciseCards.some((e) => e.name === n));
        if (isMounted) setCompletedExercises(Array.from(new Set(todayExercises)));
      } catch (error) {
        console.error("Failed to load completed exercises:", error);
      }
    }

    fetchCompletedExercises();
    return () => { isMounted = false; };
  }, [user?.id, exerciseCards]);

  // Timer
  useEffect(() => {
    if (!isRunning || isPaused || finished) return undefined;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        if (exerciseIndex >= sessionExercises.length - 1) {
          completeWorkout();
          return 0;
        }
        setExerciseIndex((i) => i + 1);
        return 45;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [exerciseIndex, finished, isPaused, isRunning, sessionExercises]);

  async function completeWorkout() {
    setFinished(true);
    setIsRunning(false);
    const allExercises = exerciseCards.map((e) => e.name);
    setCompletedExercises(allExercises);
    try {
      const data = await apiRequest("/api/progress/update", {
        method: "POST",
        body: JSON.stringify({
          workoutCompleted: true,
          completedExercises: allExercises,
          caloriesBurned: allExercises.filter((n) => !completedExercises.includes(n)).length * EXERCISE_CALORIES
        })
      });
      publishProgressUpdate(data.progress);
    } catch (error) {
      console.error("Failed to save workout completion:", error);
    }
  }

  function resetSession() {
    setFinished(false);
    setExerciseIndex(0);
    setSeconds(45);
    setIsPaused(false);
    setIsRunning(false);
  }

  async function markExerciseDone(exerciseName) {
    if (!user?.id || completedExercises.includes(exerciseName)) return;
    const prev = completedExercises;
    setCompletedExercises((c) => Array.from(new Set([...c, exerciseName])));
    try {
      const data = await apiRequest("/api/progress/update", {
        method: "POST",
        body: JSON.stringify({
          workoutCompleted: true,
          completedExerciseName: exerciseName,
          caloriesBurned: EXERCISE_CALORIES
        })
      });
      publishProgressUpdate(data.progress);
      setCompletedExercises(
        (data.progress?.completed_exercises_today || []).filter((n) => exerciseCards.some((e) => e.name === n))
      );
    } catch (error) {
      console.error("Failed to save completed exercise:", error);
      setCompletedExercises(prev);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -right-24 top-20 h-56 w-56 rounded-full bg-cyan-300/15 blur-[100px]" />
      <SecondaryHeader title="Workout" icon={DumbbellIcon} />
      <div className="mb-5">
        <p className="text-sm font-bold text-cyan-400 dark:text-cyan-300">Workout Mode</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">{safeText(profile?.goal, "Full Body")} Flow</h1>
        <p className="mt-2 text-sm text-muted">Premium session controls built for one-handed training.</p>
      </div>

      {!isRunning && !finished ? (
        <>
          <div className="grid gap-3">
            {exerciseCards.map((exercise, index) => (
              <GlassCard key={exercise.name} className="group rounded-[24px] p-4 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/35" hover={false}>
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[18px] border border-cyan-300/25 bg-gradient-to-br from-cyan-300/18 to-emerald-300/14 text-sm font-black text-cyan-600 dark:text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,.14)]">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-extrabold">{exercise.name}</p>
                    <p className="mt-1 text-xs font-semibold text-muted">{exercise.detail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => markExerciseDone(exercise.name)}
                    disabled={completedExercises.includes(exercise.name)}
                    className={`shrink-0 rounded-full px-3 py-2 text-xs font-extrabold transition ${
                      completedExercises.includes(exercise.name)
                        ? "bg-emerald-300/20 text-emerald-700 dark:text-emerald-200 shadow-[0_0_22px_rgba(16,185,129,.18)]"
                        : "bg-black/5 dark:bg-white/8 text-cyan-700 dark:text-cyan-100 hover:bg-cyan-300/18 hover:text-cyan-900 dark:hover:text-cyan-50"
                    }`}
                  >
                    {completedExercises.includes(exercise.name) ? "Done" : "Mark Done"}
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {["32 min", profile?.fitness_level || "Beginner", profile?.workout_place || "Home"].map((item) => (
              <GlassCard key={item} className="rounded-[24px] p-4 text-center" hover={false}>
                <p className="text-sm font-extrabold">{item}</p>
              </GlassCard>
            ))}
          </div>

          <button type="button" onClick={() => setIsRunning(true)} className="neon-button mt-4 w-full rounded-[26px] px-4 py-5 text-base font-extrabold shadow-[0_18px_45px_rgba(16,185,129,.26)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_rgba(34,211,238,.26)]">
            Start Session
          </button>

          <GlassCard className="mt-4 rounded-[28px] p-5" hover={false}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-400 dark:text-cyan-300">Session Progress</p>
                <h3 className="mt-2 font-display text-2xl">{completedCount}/{exerciseCards.length} exercises completed</h3>
              </div>
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-sm font-black text-emerald-700 dark:text-emerald-200 shadow-[0_0_28px_rgba(16,185,129,.16)]">
                {completionPercent}%
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all duration-500" style={{ width: `${completionPercent}%` }} />
            </div>
          </GlassCard>
        </>
      ) : (
        <GlassCard className="mt-5 rounded-[34px] p-6 text-center" hover={false}>
          {finished ? (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
                <Trophy size={34} />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-emerald-500 dark:text-emerald-300">Complete</p>
              <h2 className="mt-3 font-display text-4xl">Workout done</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Session logged. Recovery mode unlocked.</p>
              <button type="button" onClick={resetSession} className="soft-btn mt-6 inline-flex items-center gap-2 rounded-[22px] px-5 py-3 font-bold">
                <RotateCcw size={17} />
                Reset
              </button>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-400 dark:text-cyan-300">
                Exercise {exerciseIndex + 1} / {sessionExercises.length}
              </p>
              <h2 className="mt-4 font-display text-[34px] leading-tight">{sessionExercises[exerciseIndex] || defaultExercises[exerciseIndex]}</h2>
              <div className="mx-auto mt-8 grid h-44 w-44 place-items-center rounded-full border border-cyan-300/30 bg-black/5 dark:bg-white/5 text-6xl font-extrabold neon-ring">
                {seconds}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${((exerciseIndex + 1) / sessionExercises.length) * 100}%` }} />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setIsPaused(!isPaused)} className="soft-btn rounded-[22px] px-3 py-4">
                  {isPaused ? <Play className="mx-auto" size={19} /> : <Pause className="mx-auto" size={19} />}
                </button>
                <button type="button" onClick={() => setExerciseIndex(Math.min(exerciseIndex + 1, sessionExercises.length - 1))} className="soft-btn rounded-[22px] px-3 py-4">
                  <SkipForward className="mx-auto" size={19} />
                </button>
                <button type="button" onClick={completeWorkout} className="neon-button rounded-[22px] px-3 py-4">
                  <CheckCircle2 className="mx-auto" size={19} />
                </button>
              </div>
            </>
          )}
        </GlassCard>
      )}
    </div>
  );
}
