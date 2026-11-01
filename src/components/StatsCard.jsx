import { memo } from "react";
import { motion } from "framer-motion";

const StatsCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  color = "indigo",
  delay = 0 
}) => {
  const colorClasses = {
    indigo: {
      bg: "bg-indigo-500/20",
      text: "text-indigo-500",
      border: "border-indigo-500/30",
      glow: "from-indigo-500/10 to-purple-500/10",
    },
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-500",
      border: "border-blue-500/30",
      glow: "from-blue-500/10 to-cyan-500/10",
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-500",
      border: "border-green-500/30",
      glow: "from-green-500/10 to-emerald-500/10",
    },
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-500",
      border: "border-purple-500/30",
      glow: "from-purple-500/10 to-pink-500/10",
    },
    pink: {
      bg: "bg-pink-500/20",
      text: "text-pink-500",
      border: "border-pink-500/30",
      glow: "from-pink-500/10 to-rose-500/10",
    },
  };

  const colors = colorClasses[color] || colorClasses.indigo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={`relative bg-white dark:bg-white/5 rounded-2xl p-6 border border-gray-200 dark:border-white/10 overflow-hidden group transition-all`}
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colors.bg}`}>
            <Icon className={`w-6 h-6 ${colors.text}`} />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {label}
          </div>
          {subValue && (
            <div className={`text-xs ${colors.text} font-medium pt-1`}>
              {subValue}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

export default StatsCard;