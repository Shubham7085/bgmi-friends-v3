import { motion } from "framer-motion";
import {
  Shield,
  Star,
  BadgeCheck,
  Zap,
  Crown,
  Gem,
  MapPin,
  Hash,
} from "lucide-react";

interface HeroSectionProps {
  profile: {
    ign: string;
    realName: string;
    bgmiId: string;
    country: string;
    tier: string;
    stars: number;
    level: number;
    avatarUrl: string;
    backgroundUrl?: string;
    isVerified: boolean;
    isElite: boolean;
    isConqueror: boolean;
    isMythic: boolean;
    isOnline: boolean;
  };
}

const TierBadge = ({ tier }: { tier: string }) => {
  const tierColors: Record<string, string> = {
    Conqueror: "from-yellow-400 to-orange-500",
    Ace: "from-purple-400 to-pink-500",
    Diamond: "from-cyan-400 to-blue-500",
    Platinum: "from-teal-400 to-cyan-500",
    Gold: "from-yellow-300 to-yellow-500",
    Silver: "from-gray-300 to-gray-500",
    Bronze: "from-orange-700 to-yellow-700",
  };
  const gradient = tierColors[tier] ?? "from-cyan-400 to-purple-500";
  return (
    <span
      className={`bg-gradient-to-r ${gradient} text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest`}
    >
      {tier}
    </span>
  );
};

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-b-3xl" style={{ minHeight: "42vh" }}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: profile.backgroundUrl
            ? `url(${profile.backgroundUrl})`
            : "linear-gradient(135deg, #0d1b2a 0%, #1a0533 50%, #070B14 100%)",
        }}
      />
      {/* Layered overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#070B14]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-transparent to-transparent" />

      {/* Animated grid lines */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow orbs */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-4 w-32 h-32 rounded-full blur-3xl"
        style={{ background: "rgba(139,92,246,0.4)" }}
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-8 right-4 w-24 h-24 rounded-full blur-3xl"
        style={{ background: "rgba(0,240,255,0.3)" }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-8 pb-6 px-4">
        {/* Level badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-3"
        >
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold"
            style={{
              borderColor: "rgba(255,215,0,0.5)",
              background: "rgba(255,215,0,0.1)",
              color: "#FFD700",
            }}
          >
            <Zap size={10} />
            LVL {profile.level}
          </div>
        </motion.div>

        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="relative mb-4"
        >
          {/* Animated golden ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-1.5 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #FFD700, #FF8C00, #FFD700, transparent, #FFD700)",
              padding: "2px",
            }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-3 rounded-full opacity-40"
            style={{
              background:
                "conic-gradient(from 180deg, rgba(0,240,255,0.8), transparent, rgba(139,92,246,0.8), transparent)",
            }}
          />

          {/* Avatar image */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400/60 z-10">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.ign}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-3xl font-black"
                style={{
                  background: "linear-gradient(135deg, #1a0533, #070B14)",
                  color: "#00F0FF",
                }}
              >
                {profile.ign.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Online pulse */}
          {profile.isOnline && (
            <div className="absolute bottom-1 right-1 z-20">
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-green-400"
              />
              <div className="w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#070B14] relative z-10" />
            </div>
          )}
        </motion.div>

        {/* Name & badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          {/* IGN */}
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <h1
              className="text-2xl font-black tracking-wide"
              style={{
                background: "linear-gradient(90deg, #00F0FF, #8B5CF6, #FFD700)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
            >
              {profile.ign}
            </h1>
            {profile.isVerified && (
              <BadgeCheck size={18} className="text-cyan-400 flex-shrink-0" />
            )}
          </div>

          {/* Real name */}
          <p className="text-gray-300 text-sm font-medium mb-2">{profile.realName}</p>

          {/* Meta row */}
          <div className="flex items-center justify-center gap-3 text-xs text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Hash size={10} className="text-cyan-400" />
              {profile.bgmiId}
            </span>
            <span className="w-px h-3 bg-gray-600" />
            <span className="flex items-center gap-1">
              <MapPin size={10} className="text-purple-400" />
              {profile.country}
            </span>
          </div>

          {/* Tier + Stars */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <TierBadge tier={profile.tier} />
            <div className="flex items-center gap-0.5">
              {Array.from({ length: Math.min(profile.stars, 5) }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className="text-yellow-400 fill-yellow-400"
                />
              ))}
              {profile.stars > 5 && (
                <span className="text-yellow-400 text-xs font-bold">+{profile.stars - 5}</span>
              )}
            </div>
          </div>

          {/* Prestige badges */}
          <div className="flex items-center justify-center gap-2">
            {profile.isElite && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  borderColor: "rgba(0,240,255,0.4)",
                  background: "rgba(0,240,255,0.1)",
                  color: "#00F0FF",
                }}
              >
                <Shield size={9} /> Elite
              </motion.div>
            )}
            {profile.isConqueror && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  borderColor: "rgba(255,215,0,0.4)",
                  background: "rgba(255,215,0,0.1)",
                  color: "#FFD700",
                }}
              >
                <Crown size={9} /> Conqueror
              </motion.div>
            )}
            {profile.isMythic && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
                style={{
                  borderColor: "rgba(139,92,246,0.5)",
                  background: "rgba(139,92,246,0.1)",
                  color: "#A78BFA",
                }}
              >
                <Gem size={9} /> Mythic
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
