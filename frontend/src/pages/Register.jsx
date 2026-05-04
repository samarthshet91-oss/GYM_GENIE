import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import { useAuth } from "../context/AuthContext";
import { DIETS, GOALS, LEVELS, PLACES } from "../utils/constants";

const steps = [
  { key: "name", label: "What should GymGenie call you?", type: "text" },
  { key: "age", label: "Age", type: "number" },
  { key: "height", label: "Height in cm", type: "number" },
  { key: "weight", label: "Weight in kg", type: "number" },
  { key: "goal", label: "Main goal", type: "select", options: GOALS },
  { key: "workout_place", label: "Workout place", type: "select", options: PLACES },
  { key: "diet_type", label: "Diet style", type: "select", options: DIETS },
  { key: "fitness_level", label: "Fitness level", type: "select", options: LEVELS },
  { key: "email", label: "Email", type: "email" },
  { key: "password", label: "Password", type: "password" }
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goal: GOALS[0],
    workout_place: PLACES[0],
    diet_type: DIETS[0],
    fitness_level: LEVELS[0],
    email: "",
    password: ""
  });

  const currentStep = steps[stepIndex];
  const progress = `${((stepIndex + 1) / steps.length) * 100}%`;

  async function goNext() {
    setError("");

    if (!form[currentStep.key]) {
      setError("Please complete this step.");
      return;
    }

    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-bg min-h-screen px-4 py-6">
      <div className="phone-frame">
      <div className="page-wrap px-0 pt-2">
        <Link to="/landing" className="soft-btn mb-5 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold">
          <ArrowLeft size={17} />
          Back
        </Link>
        <div className="mb-5 h-3 overflow-hidden rounded-full bg-white/5">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-lime-300" animate={{ width: progress }} />
        </div>

        <GlassCard className="min-h-[500px] overflow-hidden p-6" hover={false}>
          <AnimatePresence mode="wait">
            <motion.div key={currentStep.key} initial={{ opacity: 0, x: 28, scale: 0.98 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: -28, scale: 0.98 }} transition={{ duration: 0.26 }}>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-300">
                Step {stepIndex + 1} of {steps.length}
              </p>
              <h1 className="mt-5 font-display text-[30px] leading-tight">{currentStep.label}</h1>
              <p className="mt-2 text-sm text-muted">Build your premium training profile one card at a time.</p>

              {currentStep.type === "select" ? (
                <div className="mt-8 grid gap-3">
                  {currentStep.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setForm({ ...form, [currentStep.key]: option })}
                      className={`rounded-[22px] px-4 py-4 text-left font-bold transition ${
                        form[currentStep.key] === option ? "neon-button" : "soft-btn"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  autoFocus
                  type={currentStep.type}
                  value={form[currentStep.key]}
                  onChange={(event) => setForm({ ...form, [currentStep.key]: event.target.value })}
                  className="input-shell mt-10 w-full rounded-[26px] px-5 py-5 text-lg outline-none"
                  placeholder={currentStep.label}
                />
              )}

              {error ? <p className="mt-5 text-sm text-rose-300">{error}</p> : null}
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
            className="glass-card flex items-center justify-center gap-2 rounded-[22px] px-4 py-4 font-bold disabled:opacity-30"
            disabled={stepIndex === 0}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            className="neon-button flex items-center justify-center gap-2 rounded-[22px] px-4 py-4 font-extrabold"
            disabled={loading}
          >
            {loading ? "Starting..." : stepIndex === steps.length - 1 ? "Start App" : "Next"}
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
