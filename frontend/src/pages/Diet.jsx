import { CheckCircle2, Flame, Home, Sparkles, Utensils } from "lucide-react";
import { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../services/api";

const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"];

export default function Diet() {
  const { user } = useAuth();
  const [diet, setDiet] = useState("Loading meal plan...");
  const [checkedMeals, setCheckedMeals] = useState({});

  useEffect(() => {
    apiRequest("/api/diet/generate", {
      method: "POST",
      body: JSON.stringify({
        goal: user?.goal,
        calories: 2200,
        dietType: user?.diet_type,
        hostelMode: user?.workout_place === "Hostel"
      })
    })
      .then((data) => setDiet(data.diet))
      .catch(() => setDiet("Protein-first breakfast, balanced lunch, smart snack, and a lighter dinner."));
  }, [user]);

  const lines = diet.split("\n").filter(Boolean);
  const eaten = Object.values(checkedMeals).filter(Boolean).length;
  const calorieGoal = 2200;
  const eatenCalories = eaten * 480;

  return (
    <div>
      <div className="mb-5">
        <p className="text-sm font-bold text-emerald-300">Diet Plan</p>
        <h1 className="mt-1 font-display text-[32px] leading-none">Today's Fuel</h1>
        <p className="mt-2 text-sm text-muted">{user?.diet_type || "Balanced"} meals tuned for {user?.goal || "your goal"}.</p>
      </div>

      <GlassCard className="p-5" hover={false}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-300">Calories</p>
            <h2 className="mt-1 font-display text-3xl">{eatenCalories}/{calorieGoal}</h2>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950">
            <Flame size={24} />
          </div>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/5">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300" style={{ width: `${Math.min(100, (eatenCalories / calorieGoal) * 100)}%` }} />
        </div>
      </GlassCard>

      <GlassCard className="mt-4 p-5" hover={false}>
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-cyan-300">
            <Sparkles size={18} />
          </div>
          <div>
            <p className="font-bold">AI diet insight</p>
            <p className="mt-2 text-sm leading-6 text-muted">{lines[0] || "Keep meals simple, protein-forward, and easy to repeat."}</p>
          </div>
        </div>
      </GlassCard>

      <div className="mt-4 grid gap-4">
        {meals.map((meal, index) => (
          <GlassCard key={meal} className="p-5" hover={false}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/5 text-emerald-300">
                  <Utensils size={19} />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl">{meal}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted">{lines[index + 1] || "Whole-food option with easy protein and carbs."}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">{420 + index * 110} kcal</p>
                </div>
              </div>
              <button type="button" onClick={() => setCheckedMeals({ ...checkedMeals, [meal]: !checkedMeals[meal] })} className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${checkedMeals[meal] ? "neon-button" : "soft-btn"}`} aria-label={`Mark ${meal} eaten`}>
                <CheckCircle2 size={20} />
              </button>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-4 p-5" hover={false}>
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/5 text-cyan-300">
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
