import { CheckCircle2, Pause, Play, RotateCcw, SkipForward, Timer, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const defaultExercises = ["Mobility Warmup", "Bodyweight Squats", "Push Ups", "Alternating Lunges", "Plank Hold", "Cooldown"];

export default function Workout() {
  const { user } = useAuth();
  const [workout, setWorkout] = useState("Loading workout...");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [seconds, setSeconds] = useState(45);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    apiRequest("/api/workout/generate", {
      method: "POST",
      body: JSON.stringify({
        goal: user?.goal,
        level: user?.fitness_level,
        time: 30,
        place: user?.workout_place
      })
    })
      .then((data) => setWorkout(data.workout))
      .catch(() => setWorkout("Warmup, move with control, stay consistent, and finish with recovery work."));
  }, [user]);

  useEffect(() => {
    if (!isRunning || isPaused || finished) return undefined;

    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current > 1) return current - 1;
        if (exerciseIndex >= defaultExercises.length - 1) {
          completeWorkout();
          return 0;
        }
        setExerciseIndex((currentIndex) => currentIndex + 1);
        return 45;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [exerciseIndex, finished, isPaused, isRunning]);

  async function completeWorkout() {
    setFinished(true);
    setIsRunning(false);
    try {
      await apiRequest("/api/progress/update", {
        method: "POST",
        body: JSON.stringify({ workoutCompleted: true })
      });
    } catch {
      return;
    }
  }

  function resetSession() {
    setFinished(false);
    setExerciseIndex(0);
    setSeconds(45);
    setIsPaused(false);
    setIsRunning(false);
  }

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm font-bold text-cyan-300">Workout Mode</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">{user?.goal || "Full Body"} Flow</h1>
        <p className="mt-2 text-sm text-muted">Premium session controls built for one-handed training.</p>
      </div>

      {!isRunning && !finished ? (
        <>
          <GlassCard className="relative overflow-hidden p-5" hover={false}>
            <div className="absolute right-[-35px] top-[-35px] h-36 w-36 rounded-full bg-emerald-300/20 blur-[80px]" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Overview</p>
                <h2 className="mt-3 font-display text-2xl">Today's training plan</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{workout}</p>
              </div>
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/5 text-cyan-300">
                <Timer size={22} />
              </div>
            </div>
          </GlassCard>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {["32 min", user?.fitness_level || "Level", user?.workout_place || "Place"].map((item) => (
              <GlassCard key={item} className="p-4 text-center" hover={false}>
                <p className="text-sm font-extrabold">{item}</p>
              </GlassCard>
            ))}
          </div>
          <button type="button" onClick={() => setIsRunning(true)} className="neon-button mt-4 w-full rounded-[24px] px-4 py-4 text-sm font-extrabold">
            Start Session
          </button>
        </>
      ) : (
        <GlassCard className="mt-5 p-6 text-center" hover={false}>
          {finished ? (
            <>
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
                <Trophy size={34} />
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-[0.28em] text-emerald-300">Complete</p>
              <h2 className="mt-3 font-display text-4xl">Workout done</h2>
              <p className="mt-3 text-sm leading-6 text-muted">Session logged. Recovery mode unlocked.</p>
              <button type="button" onClick={resetSession} className="soft-btn mt-6 inline-flex items-center gap-2 rounded-[22px] px-5 py-3 font-bold">
                <RotateCcw size={17} />
                Reset
              </button>
            </>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Exercise {exerciseIndex + 1} / {defaultExercises.length}
              </p>
              <h2 className="mt-4 font-display text-[34px] leading-tight">{defaultExercises[exerciseIndex]}</h2>
              <div className="mx-auto mt-8 grid h-44 w-44 place-items-center rounded-full border border-cyan-300/30 bg-white/5 text-6xl font-extrabold neon-ring">
                {seconds}
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${((exerciseIndex + 1) / defaultExercises.length) * 100}%` }} />
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <button type="button" onClick={() => setIsPaused(!isPaused)} className="soft-btn rounded-[22px] px-3 py-4">
                  {isPaused ? <Play className="mx-auto" size={19} /> : <Pause className="mx-auto" size={19} />}
                </button>
                <button type="button" onClick={() => setExerciseIndex(Math.min(exerciseIndex + 1, defaultExercises.length - 1))} className="soft-btn rounded-[22px] px-3 py-4">
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
