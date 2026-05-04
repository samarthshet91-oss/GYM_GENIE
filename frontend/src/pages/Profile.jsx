import { LogOut, Mail, MapPin, RotateCcw, Target, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function resetLocalData() {
    localStorage.removeItem("gymgenie_theme");
    localStorage.removeItem("gymgenie_guide_seen");
    window.location.reload();
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-300">Personal Space</p>
          <h1 className="mt-1 font-display text-[30px] leading-none">Profile</h1>
        </div>
        <ThemeToggle />
      </div>

      <GlassCard className="p-5" hover={false}>
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950 neon-ring">
            <UserRound size={34} />
          </div>
          <div>
            <h2 className="font-display text-3xl">{user?.name || "GymGenie User"}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Mail size={14} />{user?.email}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-[20px] bg-white/5 p-4">
            <p className="text-muted">Goal</p>
            <p className="mt-2 font-bold">{user?.goal || "Not set"}</p>
          </div>
          <div className="rounded-[20px] bg-white/5 p-4">
            <p className="text-muted">Level</p>
            <p className="mt-2 font-bold">{user?.fitness_level || "Not set"}</p>
          </div>
          <div className="rounded-[20px] bg-white/5 p-4">
            <p className="text-muted">Workout place</p>
            <p className="mt-2 font-bold">{user?.workout_place || "Not set"}</p>
          </div>
          <div className="rounded-[20px] bg-white/5 p-4">
            <p className="text-muted">Diet</p>
            <p className="mt-2 font-bold">{user?.diet_type || "Not set"}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="mt-4 p-5" hover={false}>
        <div className="flex items-center gap-3">
          <Target size={18} className="text-cyan-300" />
          <div>
            <p className="font-bold">Training identity</p>
            <p className="mt-1 text-sm text-muted">{user?.fitness_level || "Adaptive"} athlete focused on {user?.goal || "steady progress"}.</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <MapPin size={18} className="text-emerald-300" />
          <p className="text-sm text-muted">Workout place: <span className="font-bold text-[var(--text)]">{user?.workout_place || "Not set"}</span></p>
        </div>
      </GlassCard>

      <button type="button" onClick={resetLocalData} className="glass-card mt-4 flex w-full items-center justify-center gap-2 rounded-[22px] px-5 py-4 font-bold">
        <RotateCcw size={18} />
        Reset local UI data
      </button>
      <button
        type="button"
        onClick={() => {
          logout();
          navigate("/landing");
        }}
        className="neon-button mt-3 flex w-full items-center justify-center gap-2 rounded-[22px] px-5 py-4 font-extrabold"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}
