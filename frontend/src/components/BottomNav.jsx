import { Bot, ChartNoAxesCombined, Dumbbell, Salad, UserRound } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import BrandMark from "./BrandMark";
import aiOrb from "../assets/ai-orb.png";

const sideItems = [
  { to: "/workout", label: "Workout", icon: Dumbbell },
  { to: "/progress", label: "Progress", icon: ChartNoAxesCombined },
  { to: "/diet", label: "Diet", icon: Salad },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function BottomNav() {
  const location = useLocation();
  const coachActive = location.pathname === "/coach";

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] max-w-[404px] -translate-x-1/2 px-1">
      <nav className="relative grid grid-cols-[1fr_1fr_78px_1fr_1fr] items-end rounded-full border border-cyan-300/20 bg-slate-950/60 px-2 pb-2 pt-3 shadow-[0_0_42px_rgba(34,211,238,.20),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl light:bg-white/78 light:shadow-[0_18px_42px_rgba(15,23,42,.12)]">
        {sideItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-1 rounded-full px-1 py-2 text-[10px] font-bold transition duration-300 ${
                  isActive
                    ? "bg-cyan-300/12 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,.28)] light:bg-cyan-50 light:text-cyan-700"
                    : "text-slate-300 light:text-slate-600"
                }`
              }
            >
              <Icon size={18} strokeWidth={2.35} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
        <NavLink
  to="/coach"
  aria-label="AI Coach"
  className="relative -mt-10 grid justify-items-center text-[10px] font-extrabold text-emerald-100"
>
  <span
    className={`relative grid h-[86px] w-[86px] place-items-center rounded-full transition-all duration-300 ${
      coachActive
        ? "scale-105 shadow-[0_8px_25px_rgba(0,0,0,0,45)]border border-emerald-400/20"
        : "shadow-[0_4px_12px_rgba(0,0,0,0,35))] border border-white/10"
    }`}
  >
    {/* Glow background */}
    <span className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 via-emerald-400/20 to-lime-300/20 blur-xl" />

    {/* Circular AI Orb */}
    <div className="overflow-hidden rounded-full">
      <img
        src={aiOrb}
        alt="GymGenie AI"
        className="
          h-[70px] w-[70px]
          rounded-full
          object-cover
          transition-all duration-300
          hover:scale-110
        "
      />
    </div>
  </span>
</NavLink>

        {sideItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-1 rounded-full px-1 py-2 text-[10px] font-bold transition duration-300 ${
                  isActive
                    ? "bg-cyan-300/12 text-cyan-200 shadow-[0_0_24px_rgba(34,211,238,.28)] light:bg-cyan-50 light:text-cyan-700"
                    : "text-slate-300 light:text-slate-600"
                }`
              }
            >
              <Icon size={18} strokeWidth={2.35} />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
