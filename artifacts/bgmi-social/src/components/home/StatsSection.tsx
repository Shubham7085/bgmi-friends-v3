import { motion } from "framer-motion";
import { Users, Zap, TrendingUp, Trophy, BookImage, Star, Camera } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
  glowColor: string;
  sub?: string;
}

interface StatsSectionProps {
  stats: {
    totalFriends: number;
    totalSynergy: number;
    avgSynergy: number;
    highestSynergy: number;
    collection: number;
    popularity: number;
    memories: number;
  };
}

const StatCard = ({
  stat,
  index,
}: {
  stat: Stat;
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
    whileHover={{ y: -3, scale: 1.03 }}
    className="relative rounded-2xl overflow-hidden p-4 flex flex-col gap-2"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      backdropFilter: "blur(12px)",
    }}
  >
    {/* Glow accent top-left */}
    <div
      className="absolute top-0 left-0 w-16 h-16 rounded-full blur-2xl opacity-30"
      style={{ background: stat.glowColor }}
    />

    {/* Icon */}
    <div
      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${stat.gradient})` }}
    >
      {stat.icon}
    </div>

    {/* Value */}
    <div
      className="text-xl font-black"
      style={{
        background: `linear-gradient(135deg, ${stat.gradient})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {stat.value}
    </div>

    {/* Label */}
    <div className="text-gray-400 text-[11px] font-semibold leading-tight">
      {stat.label}
    </div>
    {stat.sub && (
      <div className="text-[10px] text-gray-600">{stat.sub}</div>
    )}
  </motion.div>
);

export default function StatsSection({ stats }: StatsSectionProps) {
  const statItems: Stat[] = [
    {
      label: "Friends",
      value: stats.totalFriends,
      icon: <Users size={16} className="text-white" />,
      gradient: "#00F0FF, #0066FF",
      glowColor: "#00F0FF",
      sub: "in vault",
    },
    {
      label: "Total Synergy",
      value: `${stats.totalSynergy}%`,
      icon: <Zap size={16} className="text-white" />,
      gradient: "#FFD700, #FF8C00",
      glowColor: "#FFD700",
    },
    {
      label: "Avg Synergy",
      value: `${stats.avgSynergy}%`,
      icon: <TrendingUp size={16} className="text-white" />,
      gradient: "#A78BFA, #7C3AED",
      glowColor: "#8B5CF6",
    },
    {
      label: "Best Synergy",
      value: `${stats.highestSynergy}%`,
      icon: <Trophy size={16} className="text-white" />,
      gradient: "#F472B6, #EC4899",
      glowColor: "#EC4899",
    },
    {
      label: "Collection",
      value: stats.collection,
      icon: <BookImage size={16} className="text-white" />,
      gradient: "#34D399, #059669",
      glowColor: "#34D399",
      sub: "profiles",
    },
    {
      label: "Popularity",
      value: `${stats.popularity}%`,
      icon: <Star size={16} className="text-white" />,
      gradient: "#FB923C, #EF4444",
      glowColor: "#FB923C",
    },
    {
      label: "Memories",
      value: stats.memories,
      icon: <Camera size={16} className="text-white" />,
      gradient: "#00F0FF, #8B5CF6",
      glowColor: "#00F0FF",
      sub: "photos",
    },
  ];

  return (
    <div className="px-4">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "linear-gradient(180deg, #00F0FF, #8B5CF6)" }}
        />
        <span
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: "#00F0FF" }}
        >
          Quick Stats
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </div>
  );
}
