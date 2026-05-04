import { Sparkles } from "lucide-react";

export default function BrandMark({ small = false }) {
  const size = small ? "h-12 w-12 rounded-2xl" : "h-16 w-16 rounded-[1.75rem]";

  return (
    <div
      className={`relative grid ${size} place-items-center overflow-hidden bg-gradient-to-br from-cyan-300 via-emerald-300 to-lime-300 text-slate-950 neon-ring`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,.85),transparent_24%)]" />
      <div className="absolute h-[58%] w-[58%] rounded-full border-[3px] border-slate-950/80" />
      <div className="absolute h-[30%] w-[30%] rounded-full bg-slate-950/90" />
      <Sparkles className="relative -right-3 -top-3" size={small ? 13 : 16} strokeWidth={3} />
    </div>
  );
}
