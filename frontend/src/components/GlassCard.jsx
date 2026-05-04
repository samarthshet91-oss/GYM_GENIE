import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", delay = 0, hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={`glass-card rounded-[28px] ${className}`}
    >
      {children}
    </motion.div>
  );
}
