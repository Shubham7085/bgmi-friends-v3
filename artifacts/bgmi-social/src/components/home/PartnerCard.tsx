import { motion } from "framer-motion";
import { Heart, Swords, Zap, Star } from "lucide-react";

interface PartnerCardProps {
  partner: {
    ign: string;
    realName: string;
    avatarUrl: string;
    isOnline: boolean;
    kd: number;
    synergy: number;
    tier: string;
  };
}

export default function PartnerCard({ partner }: PartnerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ y: -2 }}
      className="relative mx-4 rounded-2xl overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(0,240,255,0.06) 100%)",
        border: "1px solid rgba(139,92,246,0.3)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(139,92,246,0.8), rgba(0,240,255,0.6), transparent)",
        }}
      />

      {/* Glow bg */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(139,92,246,0.4) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              <Heart size={14} className="text-pink-400 fill-pink-400" />
            </motion.div>
            <span
              className="text-xs font-black uppercase tracking-widest"
              style={{ color: "#A78BFA" }}
            >
              Gaming Partner
            </span>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border"
            style={{
              borderColor: "rgba(0,240,255,0.3)",
              background: "rgba(0,240,255,0.08)",
              color: "#00F0FF",
            }}
          >
            <Star size={8} className="fill-cyan-400" />
            Elite Partner
          </div>
        </div>

        {/* Partner info */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -inset-1 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(236,72,153,0.8), rgba(139,92,246,0.8), rgba(236,72,153,0.8))",
              }}
            />
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-pink-400/40 z-10">
              {partner.avatarUrl ? (
                <img
                  src={partner.avatarUrl}
                  alt={partner.ign}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xl font-black"
                  style={{
                    background: "linear-gradient(135deg, #2d1b4e, #070B14)",
                    color: "#A78BFA",
                  }}
                >
                  {partner.ign.charAt(0)}
                </div>
              )}
            </div>
            {partner.isOnline && (
              <div className="absolute bottom-0 right-0 z-20">
                <motion.div
                  animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-green-400"
                />
                <div className="w-3 h-3 rounded-full bg-green-400 border-2 border-[#070B14] relative z-10" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-black text-white text-base truncate">{partner.ign}</h3>
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0"
                style={{
                  background: "rgba(236,72,153,0.15)",
                  border: "1px solid rgba(236,72,153,0.4)",
                  color: "#F472B6",
                }}
              >
                <Heart size={7} className="fill-pink-400" /> Lover
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">{partner.realName}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
                  <Swords size={8} /> KD
                </div>
                <div
                  className="text-sm font-black"
                  style={{ color: "#00F0FF" }}
                >
                  {partner.kd.toFixed(2)}
                </div>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="text-center">
                <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-0.5">
                  <Zap size={8} /> Synergy
                </div>
                <div
                  className="text-sm font-black"
                  style={{ color: "#FFD700" }}
                >
                  {partner.synergy}%
                </div>
              </div>
              <div className="w-px h-6 bg-gray-700" />
              <div className="text-center">
                <div className="text-[10px] text-gray-500 mb-0.5">Tier</div>
                <div
                  className="text-sm font-black"
                  style={{ color: "#A78BFA" }}
                >
                  {partner.tier}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Synergy bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
            <span>Couple Synergy</span>
            <span style={{ color: "#FFD700" }}>{partner.synergy}%</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${partner.synergy}%` }}
              transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #EC4899, #A78BFA, #00F0FF)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(236,72,153,0.5), transparent)",
        }}
      />
    </motion.div>
  );
}
