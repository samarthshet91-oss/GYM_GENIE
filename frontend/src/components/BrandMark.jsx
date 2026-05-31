import faviconDark from "../assets/favicon-dark.png";
import faviconLight from "../assets/favicon-light.png";
import logoDark from "../assets/logo-dark.png";
import logoLight from "../assets/logo-light.png";
import { useAuth } from "../context/AuthContext";

export default function BrandMark({ small = false, logo = false, className = "" }) {
  const { theme } = useAuth();
  const isLight = theme === "light";
  const src = logo ? (isLight ? logoLight : logoDark) : (isLight ? faviconLight : faviconDark);
  const size = small ? "h-10 w-10 rounded-2xl" : logo ? "h-24 w-24 rounded-[2rem]" : "h-16 w-16 rounded-[1.75rem]";

  return (
    <img
      src={src}
      alt="GymGenie AI"
      className={`${size} object-cover ${className}`}
      draggable="false"
    />
  );
}
