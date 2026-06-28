import { motion } from "framer-motion";
import { Users, Trophy, ImageIcon, BarChart2 } from "lucide-react";

interface QuickAction {
  label: string;
  sub: string;
  icon: React.ReactNode;
  gradient: string;
  borderColor: string;
  glowColor: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onFriends: () => void;
  onLeaderboard: () => void;
  onGallery: () => void;
  onStats: () => void;
}

export default function QuickActions({
  onFriends,
  onLeaderboard,
  onGallery,
  onStats,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      label: "Friends",
      sub: "Vault",
      icon: <Users size={22} />,
      gradient: "linear-gradient(135deg, rgba(0,240,255,0.15), rgba(0,102,255,0.08))",
      borderColor: "rgba(0,240,255,0.25)",
      glowColor: "rgba(0,240,255,0.2)",
      onClick: onFriends,
    },
    {
      label: "Leader",
      sub: "Board",
      icon: <Trophy size={22} />,
      gradient: "linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,140,0,0.08))",
      borderColor: "rgba(255,215,0,0.25)",
      glowColor: "rgba(255,215,0,0.2)",
      onClick: onLeaderboard,
    },
    {
      label: "Gallery",
      sub: "Photos",
      icon: <ImageIcon size={22} />,
      gradient: "linear-gradient(135deg, rgba(236,72,153,0.15), rgba(167,139,250,0.08))",
      borderColor: "rgba(236,72,153,0.25)",
      glowColor: "rgba(236,72,153,0.2)",
      onClick: onGallery,
    },
    {
      label: "Stats",
      sub: "Analytics",
      icon: <BarChart2 size={22} />,
      gradient: "linear-gradient(135deg, rgba(52,211,153,0.15), rgba(5,150,105,0.08))",
      borderColor: "rgba(52,211,153,0.25)",
      glowColor: "rgba(52,211,153,0.2)",
      onClick: onStats,
    },
  ];

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "linear-gradient(180deg, #34D399, #00F0FF)" }}
        />
        <span
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: "#34D399" }}
        >
          Quick Actions
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i }}
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className="relative flex flex-col items-center gap-2 rounded-2xl py-4 px-2 overflow-hidden"
            style={{
              background: action.gradient,
              border: `1px solid ${action.borderColor}`,
            }}
          >
            {/* Glow spot */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full blur-xl opacity-60"
              style={{ background: action.glowColor }}
            />

            {/* Icon circle */}
            <div
              className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                background: action.glowColor,
                border: `1px solid ${action.borderColor}`,
                color: "white",
              }}
            >
              {action.icon}
            </div>

            {/* Labels */}
            <div className="relative z-10 text-center">
              <div className="text-white font-black text-xs leading-tight">{action.label}</div>
              <div className="text-[9px] text-gray-400 leading-tight">{action.sub}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
