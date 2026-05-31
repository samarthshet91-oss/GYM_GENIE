import { CheckCircle2, Flame, Home, Salad, Sparkles, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import SecondaryHeader from "../components/SecondaryHeader";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const meals = [
  { label: "Breakfast", key: "breakfast_done" },
  { label: "Lunch",     key: "lunch_done" },
  { label: "Snacks",    key: "snack_done" },
  { label: "Dinner",    key: "dinner_done" }
];

function safeText(value, fallback = "") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function cacheKey(userId) {
  return `gymgenie_daily_diet_${userId || "guest"}_${todayKey()}`;
}

function cleanDietLine(line) {
  return line
    .replace(/^#+\s*/, "")
    .replace(/^\s*[-*]\s*/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function parseDietPlan(text) {
  const parsed = { Breakfast: "", Lunch: "", Snacks: "", Dinner: "", insight: "" };

  String(text || "")
    .split("\n")
    .map(cleanDietLine)
    .filter(Boolean)
    .forEach((line) => {
      const match = line.match(/^(Breakfast|Lunch|Snacks?|Dinner|Daily calorie estimate|Practical substitutions)\s*:\s*(.+)$/i);
      if (!match) return;
      const label = match[1].toLowerCase();
      const value = match[2].trim();
      if (label === "breakfast") parsed.Breakfast = value;
      if (label === "lunch") parsed.Lunch = value;
      if (label === "snack" || label === "snacks") parsed.Snacks = value;
      if (label === "dinner") parsed.Dinner = value;
      if (label === "daily calorie estimate") parsed.insight = value;
      if (label === "practical substitutions" && !parsed.insight) parsed.insight = value;
    });

  return parsed;
}

export default function Diet() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [diet, setDiet] = useState("Loading meal plan...");
  // P2 FIX: checkedMeals keyed by meal label for clear mapping
  const [checkedMeals, setCheckedMeals] = useState({
    Breakfast: false,
    Lunch: false,
    Snacks: false,
    Dinner: false,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest("/api/user/profile");
        setProfile(data.user);
      } catch {
        setProfile(null);
      }
    }
    loadProfile();
  }, []);

  // P2 + P3 FIX: Load today's diet once. Backend now stores it in daily_diet table.
  // Same-day refreshes reuse the stored AI output — no regeneration.
  useEffect(() => {
    if (!user?.id) return;

    async function loadTodayDiet() {
      const savedDiet = localStorage.getItem(cacheKey(user.id));

      // Show cached text immediately while we fetch
      if (savedDiet) setDiet(savedDiet);

      try {
        const data = await apiRequest("/api/diet/today");
        console.log("Daily diet response:", data);
        const row = data.diet || {};
        const generatedDiet = safeText(
          row.diet,
          savedDiet || "Protein-first breakfast, balanced lunch, smart snack, and a lighter dinner."
        );

        setDiet(generatedDiet);
        localStorage.setItem(cacheKey(user.id), generatedDiet);

        // P2 FIX: restore meal completion state from Supabase row after refresh
        setCheckedMeals({
          Breakfast: Boolean(row.breakfast_done),
          Lunch:     Boolean(row.lunch_done),
          Snacks:    Boolean(row.snack_done),
          Dinner:    Boolean(row.dinner_done),
        });
      } catch (error) {
        console.error("Daily diet load failed:", error.data || error);
        setDiet(savedDiet || "Protein-first breakfast, balanced lunch, smart snack, and a lighter dinner.");
      }
    }

    loadTodayDiet();
  }, [user?.id]);

  // P2 FIX: optimistic toggle with rollback on error; reads DB state to confirm
  async function toggleMeal(meal) {
    const nextValue = !checkedMeals[meal.label];
    const previous = { ...checkedMeals };
    setCheckedMeals((prev) => ({ ...prev, [meal.label]: nextValue }));

    try {
      const data = await apiRequest("/api/diet/today", {
        method: "PATCH",
        body: JSON.stringify({ [meal.key]: nextValue })
      });
      console.log("Meal completion saved:", data);
      const row = data.diet || {};
      // Sync with actual DB values
      setCheckedMeals({
        Breakfast: Boolean(row.breakfast_done),
        Lunch:     Boolean(row.lunch_done),
        Snacks:    Boolean(row.snack_done),
        Dinner:    Boolean(row.dinner_done),
      });
    } catch (error) {
      console.error("Failed to save meal completion:", error.data || error);
      setCheckedMeals(previous); // rollback
    }
  }

  const parsedDiet = parseDietPlan(diet);
  const eaten = Object.values(checkedMeals).filter(Boolean).length;
  const calorieGoal = 2200;
  const eatenCalories = eaten * 480;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-24 top-32 h-56 w-56 rounded-full bg-emerald-300/14 blur-[100px]" />
      <SecondaryHeader title="Diet" icon={Salad} />
      <div className="mb-5">
        <p className="text-sm font-bold text-emerald-500 dark:text-emerald-300">Diet Plan</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">Today's Fuel</h1>
        <p className="mt-2 text-sm text-muted">{safeText(profile?.diet_type, "Balanced")} meals tuned for {safeText(profile?.goal, "your goal")}.</p>
      </div>

      {/* Calorie progress card */}
      <GlassCard className="relative overflow-hidden rounded-[32px] p-5" hover={false}>
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-300/20 blur-[72px]" />
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-500 dark:text-cyan-300">Calories</p>
            <h2 className="mt-1 font-display text-3xl">{eatenCalories}/{calorieGoal}</h2>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
            <Flame size={24} />
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-black/10 dark:bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${Math.min(100, (eatenCalories / calorieGoal) * 100)}%` }} />
        </div>
      </GlassCard>

      {/* AI insight card */}
      <GlassCard className="mt-4 rounded-[28px] p-5" hover={false}>
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/5 dark:bg-white/5 text-cyan-500 dark:text-cyan-300">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-bold">AI diet insight</p>
            <p className="mt-2 text-sm leading-6 text-muted">{parsedDiet.insight || "Keep meals simple, protein-forward, and easy to repeat."}</p>
          </div>
        </div>
      </GlassCard>

      {/* Meal cards */}
      <div className="mt-4 grid gap-4">
        {meals.map((meal, index) => (
          <GlassCard key={meal.label} className="rounded-[28px] p-5" hover={false}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-black/5 dark:bg-white/5 text-emerald-600 dark:text-emerald-300">
                  <Utensils size={19} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl">{meal.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{safeText(parsedDiet[meal.label], "Whole-food option with easy protein and carbs.")}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-500 dark:text-emerald-300">{420 + index * 110} kcal</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toggleMeal(meal)}
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${checkedMeals[meal.label] ? "neon-button" : "soft-btn"}`}
                aria-label={`Mark ${meal.label} eaten`}
              >
                <CheckCircle2 size={20} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Hostel mode */}
      <GlassCard className="mt-4 p-5" hover={false}>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/5 dark:bg-white/5 text-cyan-500 dark:text-cyan-300">
            <Home size={18} />
          </div>
          <div>
            <p className="font-bold">Hostel mode suggestions</p>
            <p className="mt-1 text-sm leading-6 text-muted">Keep curd, fruit, eggs or paneer, roasted chana, and quick oats ready for low-friction meals.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
