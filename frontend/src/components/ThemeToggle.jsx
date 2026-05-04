import { Moon, SunMedium } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useAuth();

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="glass-card grid h-12 w-12 place-items-center rounded-2xl"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <SunMedium size={18} /> : <Moon size={18} />}
    </button>
  );
}
