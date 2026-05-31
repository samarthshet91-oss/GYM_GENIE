import { Moon, SunMedium } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useAuth();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      // P5 FIX: use explicit foreground color so icon is visible in both themes
      className="glass-card grid h-12 w-12 place-items-center rounded-2xl text-slate-700 dark:text-slate-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
}
