import { Edit3, LogOut, Mail, MapPin, Save, Target, UserRound, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import SecondaryHeader from "../components/SecondaryHeader";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../context/AuthContext";
import { diets, goals, levels, places } from "../utils/options";
import { apiRequest } from "../services/api";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;
const emptyProfile = {
  goal: "",
  fitness_level: "",
  workout_place: "",
  diet_type: ""
};

function safeText(value, fallback = "Not set") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return value;
  return fallback;
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`,
    "Content-Type": "application/json",
    ...extra
  };
}

function ProfileSelect({ label, name, value, options, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">{label}</span>
      <select name={name} value={value} onChange={onChange} className="input-shell mt-2 w-full appearance-none rounded-[18px] px-4 py-3 text-sm font-bold outline-none">
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState(emptyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!user?.email) return undefined;

    let isMounted = true;

   async function fetchUserRow() {

    console.log(
      "FETCH URL:",
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(user.email)}&select=*`
    );

    const response = await fetch(
      `${supabaseUrl}/rest/v1/users?email=eq.${encodeURIComponent(user.email)}&select=*`,
      {
        headers: supabaseHeaders()
      }
    );

    console.log("FETCH STATUS:", response.status);

    const rows = await response.json();

    console.log("FETCH DATA:", rows);

    return rows?.[0] || null;
}

    async function createUserRow() {
      const baseRow = {
  id: user.id,
  name: user.name || "GymGenie User",
  email: user.email || "",
  goal: "",
  fitness_level: "",
  workout_place: "",
  diet_type: "",
};

      const createResponse = await fetch(`${supabaseUrl}/rest/v1/users`, {
        method: "POST",
        headers: supabaseHeaders({ Prefer: "return=representation" }),
        body: JSON.stringify(baseRow)
      });

      if (createResponse.ok) {
        const createdRows = await createResponse.json();
        return createdRows?.[0] || baseRow;
      }

      throw new Error("Unable to create profile");
    }

    async function loadProfile() {
      console.log("AUTH USER:", user);

      try {
        const data = await apiRequest("/api/user/profile");
        const nextProfile = data.user;

        if (isMounted) {
          setProfile(nextProfile);
          setForm({
            goal: safeText(nextProfile.goal, ""),
            fitness_level: safeText(nextProfile.fitness_level, ""),
            workout_place: safeText(nextProfile.workout_place, ""),
            diet_type: safeText(nextProfile.diet_type, "")
          });
          setStatus("");
        }
      } catch {
        if (isMounted) {
          setProfile(null);
          setForm(emptyProfile);
          setStatus("Profile sync is temporarily unavailable.");
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [user?.email]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function cancelEdit() {
    setForm({
      goal: safeText(profile?.goal, ""),
      fitness_level: safeText(profile?.fitness_level, ""),
      workout_place: safeText(profile?.workout_place, ""),
      diet_type: safeText(profile?.diet_type, "")
    });
    setIsEditing(false);
  }

  async function saveProfile() {
    if (!user?.email) return;

    const nextProfile = {
      ...profile,
      id: user.id,
      email: safeText(user.email, profile?.email || ""),
      goal: form.goal,
      fitness_level: form.fitness_level,
      workout_place: form.workout_place,
      diet_type: form.diet_type
    };

    setIsSaving(true);
    setProfile(nextProfile);
    setIsEditing(false);

    try {
      const response = await apiRequest("/api/user/profile", {
        method: "PATCH",
        body: JSON.stringify({
          email: nextProfile.email,
          goal: nextProfile.goal,
          fitness_level: nextProfile.fitness_level,
          workout_place: nextProfile.workout_place,
          diet_type: nextProfile.diet_type
        })
      });

      if (!response.ok) throw new Error("Unable to save profile");

      const rows = await response.json();
      setProfile(rows?.[0] || nextProfile);
      setStatus("Profile saved.");
    } catch {
      setStatus("Profile saved locally for this view, but Supabase update failed.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute -left-24 top-20 h-56 w-56 rounded-full bg-cyan-300/14 blur-[100px]" />
      <SecondaryHeader title="Profile" icon={UserRound} />
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-300">Personal Space</p>
          <h1 className="mt-1 font-display text-[30px] leading-none">Profile</h1>
        </div>
        <ThemeToggle />
      </div>

      <GlassCard className="relative overflow-hidden rounded-[34px] p-5" hover={false}>
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-300/20 blur-[86px]" />
        <div className="relative flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-gradient-to-br from-cyan-300 to-emerald-300 text-slate-950 neon-ring">
            <UserRound size={34} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-3xl">{safeText(profile?.name, "GymGenie User")}</h2>
            <p className="mt-2 flex items-center gap-2 text-sm text-muted"><Mail size={14} />{safeText(user?.email, "No email")}</p>
          </div>
        </div>

        {isEditing ? (
          <div className="relative mt-5 grid gap-4">
            <ProfileSelect label="Goal" name="goal" value={form.goal} options={goals} onChange={handleChange} />
            <ProfileSelect label="Fitness level" name="fitness_level" value={form.fitness_level} options={levels} onChange={handleChange} />
            <ProfileSelect label="Workout place" name="workout_place" value={form.workout_place} options={places} onChange={handleChange} />
            <ProfileSelect label="Diet type" name="diet_type" value={form.diet_type} options={diets} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={cancelEdit} className="soft-btn inline-flex items-center justify-center gap-2 rounded-[20px] px-4 py-3 font-bold">
                <X size={16} />
                Cancel
              </button>
              <button type="button" onClick={saveProfile} disabled={isSaving} className="neon-button inline-flex items-center justify-center gap-2 rounded-[20px] px-4 py-3 font-extrabold disabled:opacity-70">
                <Save size={16} />
                {isSaving ? "Saving" : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="relative mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-[20px] bg-white/5 p-4">
                <p className="text-muted">Goal</p>
                <p className="mt-2 font-bold">{safeText(profile?.goal)}</p>
              </div>
              <div className="rounded-[20px] bg-white/5 p-4">
                <p className="text-muted">Level</p>
                <p className="mt-2 font-bold">{safeText(profile?.fitness_level)}</p>
              </div>
              <div className="rounded-[20px] bg-white/5 p-4">
                <p className="text-muted">Workout place</p>
                <p className="mt-2 font-bold">{safeText(profile?.workout_place)}</p>
              </div>
              <div className="rounded-[20px] bg-white/5 p-4">
                <p className="text-muted">Diet</p>
                <p className="mt-2 font-bold">{safeText(profile?.diet_type)}</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsEditing(true)} className="soft-btn relative mt-5 flex w-full items-center justify-center gap-2 rounded-[22px] px-5 py-4 font-bold">
              <Edit3 size={17} />
              Edit Profile
            </button>
          </>
        )}
        {status ? <p className="relative mt-4 text-center text-xs font-semibold text-muted">{status}</p> : null}
      </GlassCard>

      <GlassCard className="mt-4 rounded-[30px] p-5" hover={false}>
        <div className="flex items-center gap-3">
          <Target size={18} className="text-cyan-300" />
          <div>
            <p className="font-bold">Training identity</p>
            <p className="mt-1 text-sm text-muted">{safeText(profile?.fitness_level, "Adaptive")} athlete focused on {safeText(profile?.goal, "steady progress")}.</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <MapPin size={18} className="text-emerald-300" />
          <p className="text-sm text-muted">Workout place: <span className="font-bold text-[var(--text)]">{safeText(profile?.workout_place)}</span></p>
        </div>
      </GlassCard>

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
