import { Bot, ChartNoAxesCombined, Home, Salad, UserRound, Zap } from "lucide-react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/dashboard", label: "Dash", icon: Home },
  { to: "/workout", label: "Workout", icon: Zap },
  { to: "/diet", label: "Diet", icon: Salad },
  { to: "/progress", label: "Progress", icon: ChartNoAxesCombined },
  { to: "/coach", label: "Coach", icon: Bot },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export default function BottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[calc(100%-24px)] max-w-[406px] -translate-x-1/2 px-1">
      <nav className="glass-card grid grid-cols-6 rounded-[30px] border-cyan-300/20 p-1.5 shadow-[0_0_35px_rgba(34,211,238,.14)]">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `relative flex min-w-0 flex-col items-center gap-1 rounded-[22px] px-1 py-2 text-[9px] font-bold transition ${
                  isActive
                    ? "bg-gradient-to-br from-cyan-300 via-emerald-300 to-lime-300 text-slate-950 shadow-[0_0_22px_rgba(74,222,128,.35)]"
                    : "text-slate-300 light:text-slate-600"
                }`
              }
            >
              <Icon size={17} strokeWidth={2.4} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
