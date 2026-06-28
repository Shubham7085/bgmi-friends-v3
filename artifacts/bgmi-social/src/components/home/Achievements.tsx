import { motion } from "framer-motion";
import { Crown, Swords, Heart, Target, Shield, Zap, Star, Award } from "lucide-react";

interface Achievement {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  glow: string;
  unlocked: boolean;
  description: string;
}

interface AchievementsProps {
  unlockedIds?: string[];
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "conqueror",
    label: "Conqueror",
    icon: <Crown size={20} />,
    color: "#FFD700",
    glow: "rgba(255,215,0,0.5)",
    unlocked: true,
    description: "Reached Conqueror tier",
  },
  {
    id: "ace_killer",
    label: "Ace Killer",
    icon: <Swords size={20} />,
    color: "#00F0FF",
    glow: "rgba(0,240,255,0.5)",
    unlocked: true,
    description: "100+ squad kills",
  },
  {
    id: "loyal_partner",
    label: "Loyal",
    icon: <Heart size={20} />,
    color: "#EC4899",
    glow: "rgba(236,72,153,0.5)",
    unlocked: true,
    description: "1 year with partner",
  },
  {
    id: "sharpshooter",
    label: "Sharpshooter",
    icon: <Target size={20} />,
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.5)",
    unlocked: true,
    description: "60%+ headshot rate",
  },
  {
    id: "guardian",
    label: "Guardian",
    icon: <Shield size={20} />,
    color: "#34D399",
    glow: "rgba(52,211,153,0.4)",
    unlocked: false,
    description: "Protected team 50x",
  },
  {
    id: "electric",
    label: "Electric",
    icon: <Zap size={20} />,
    color: "#FB923C",
    glow: "rgba(251,146,60,0.4)",
    unlocked: false,
    description: "Win 10 in a row",
  },
  {
    id: "legend",
    label: "Legend",
    icon: <Star size={20} />,
    color: "#FFD700",
    glow: "rgba(255,215,0,0.4)",
    unlocked: false,
    description: "200 chicken dinners",
  },
  {
    id: "elite_squad",
    label: "Elite Squad",
    icon: <Award size={20} />,
    color: "#00F0FF",
    glow: "rgba(0,240,255,0.4)",
    unlocked: false,
    description: "All squad max synergy",
  },
];

const HexBadge = ({
  achievement,
  index,
}: {
  achievement: Achievement;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.08 * index, type: "spring", stiffness: 200 }}
    whileHover={achievement.unlocked ? { scale: 1.12, y: -4 } : {}}
    className="flex flex-col items-center gap-2"
  >
    {/* Hexagonal badge via CSS clip-path */}
    <div className="relative" style={{ width: 56, height: 62 }}>
      {/* Glow behind */}
      {achievement.unlocked && (
        <motion.div
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.3 }}
          className="absolute inset-0 blur-md rounded-full"
          style={{ background: achievement.glow, transform: "scale(1.3)" }}
        />
      )}

      {/* Hex shape */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: 56,
          height: 62,
          clipPath:
            "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: achievement.unlocked
            ? `linear-gradient(135deg, ${achievement.color}22, ${achievement.color}44)`
            : "rgba(255,255,255,0.03)",
          border: "none",
        }}
      >
        {/* Inner hex for border effect */}
        <div
          style={{
            position: "absolute",
            inset: 2,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: achievement.unlocked
              ? `linear-gradient(135deg, rgba(7,11,20,0.9), rgba(7,11,20,0.7))`
              : "rgba(7,11,20,0.95)",
          }}
        />
        {/* Border overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath:
              "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            background: achievement.unlocked
              ? `linear-gradient(135deg, ${achievement.color}88, transparent, ${achievement.color}44)`
              : "rgba(255,255,255,0.05)",
          }}
        />
        <div
          className="relative z-10"
          style={{
            color: achievement.unlocked ? achievement.color : "rgba(255,255,255,0.15)",
          }}
        >
          {achievement.icon}
        </div>
      </div>

      {/* Lock indicator */}
      {!achievement.unlocked && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          🔒
        </div>
      )}
    </div>

    <span
      className="text-[10px] font-bold text-center leading-tight max-w-[56px]"
      style={{ color: achievement.unlocked ? achievement.color : "rgba(255,255,255,0.2)" }}
    >
      {achievement.label}
    </span>
  </motion.div>
);

export default function Achievements({ unlockedIds }: AchievementsProps) {
  const achievements = unlockedIds
    ? ALL_ACHIEVEMENTS.map((a) => ({ ...a, unlocked: unlockedIds.includes(a.id) }))
    : ALL_ACHIEVEMENTS;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(180deg, #FFD700, #FF8C00)" }}
          />
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: "#FFD700" }}
          >
            Achievements
          </span>
        </div>
        <span className="text-xs font-bold text-gray-500">
          <span style={{ color: "#FFD700" }}>{unlockedCount}</span>/{achievements.length}
        </span>
      </div>

      {/* Card */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "rgba(255,215,0,0.03)",
          border: "1px solid rgba(255,215,0,0.1)",
        }}
      >
        <div className="grid grid-cols-4 gap-4 justify-items-center">
          {achievements.map((a, i) => (
            <HexBadge key={a.id} achievement={a} index={i} />
          ))}
        </div>

        {/* Progress bar */}
        <div className="mt-5">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
            <span>Completion</span>
            <span style={{ color: "#FFD700" }}>
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(unlockedCount / achievements.length) * 100}%`,
              }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #FFD700, #FF8C00)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
