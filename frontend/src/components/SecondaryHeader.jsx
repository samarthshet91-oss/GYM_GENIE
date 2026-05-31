import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SecondaryHeader({ title, icon: Icon = Sparkles }) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="sticky top-0 z-30 -mx-1 mb-5 rounded-[28px] border border-cyan-300/15 bg-slate-950/58 px-2 py-2 shadow-[0_16px_46px_rgba(0,0,0,.22),inset_0_1px_0_rgba(255,255,255,.08)] backdrop-blur-2xl light:bg-white/78 light:shadow-[0_14px_34px_rgba(15,23,42,.08)]"
    >
      <div className="grid grid-cols-[44px_1fr_44px] items-center gap-2">
        <motion.button
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          type="button"
          onClick={() => navigate("/dashboard")}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-cyan-200 transition light:border-cyan-900/10 light:bg-cyan-50 light:text-cyan-700"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={19} strokeWidth={2.5} />
        </motion.button>

        <h1 className="truncate text-center font-display text-lg font-bold leading-none">{title}</h1>

        <motion.div
          whileHover={{ y: -1, scale: 1.03 }}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-300/20 bg-gradient-to-br from-cyan-300/16 to-emerald-300/16 text-emerald-200 shadow-[0_0_24px_rgba(74,222,128,.16)] light:text-emerald-700"
        >
          <Icon size={18} strokeWidth={2.4} />
        </motion.div>
      </div>
    </motion.header>
  );
}
