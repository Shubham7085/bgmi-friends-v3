import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";

interface Friend {
  id: string;
  ign: string;
  avatarUrl: string;
  tier: string;
  synergy: number;
  isOnline: boolean;
  relationship: string;
}

interface FeaturedFriendsProps {
  friends: Friend[];
  onViewAll: () => void;
  onFriendClick: (id: string) => void;
}

const tierColors: Record<string, string> = {
  Conqueror: "#FFD700",
  Ace: "#A78BFA",
  Diamond: "#00F0FF",
  Platinum: "#34D399",
  Gold: "#FBBF24",
  Silver: "#9CA3AF",
  Bronze: "#B45309",
};

export default function FeaturedFriends({
  friends,
  onViewAll,
  onFriendClick,
}: FeaturedFriendsProps) {
  if (!friends.length) return null;

  return (
    <div className="px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "linear-gradient(180deg, #00F0FF, #0066FF)" }}
          />
          <span
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: "#00F0FF" }}
          >
            Featured Friends
          </span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-bold"
          style={{ color: "#8B5CF6" }}
        >
          All Friends <ChevronRight size={12} />
        </motion.button>
      </div>

      {/* Horizontal scroll */}
      <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
        <div className="flex gap-3 pb-1" style={{ width: "max-content" }}>
          {friends.slice(0, 8).map((friend, i) => {
            const tierColor = tierColors[friend.tier] ?? "#00F0FF";
            return (
              <motion.button
                key={friend.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.07 * i }}
                whileHover={{ y: -4, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onFriendClick(friend.id)}
                className="flex flex-col items-center gap-2 rounded-2xl p-3 flex-shrink-0"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  width: 90,
                }}
              >
                {/* Avatar */}
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0"
                    style={{ borderColor: `${tierColor}66` }}
                  >
                    {friend.avatarUrl ? (
                      <img
                        src={friend.avatarUrl}
                        alt={friend.ign}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-sm font-black"
                        style={{
                          background: "linear-gradient(135deg, #1a0533, #070B14)",
                          color: tierColor,
                        }}
                      >
                        {friend.ign.charAt(0)}
                      </div>
                    )}
                  </div>
                  {friend.isOnline && (
                    <div className="absolute bottom-0 right-0">
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                        className="absolute inset-0 rounded-full bg-green-400"
                      />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-[#070B14] relative z-10" />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="text-center">
                  <div
                    className="text-[11px] font-bold text-white truncate max-w-[70px]"
                  >
                    {friend.ign}
                  </div>
                  <div
                    className="text-[9px] font-semibold"
                    style={{ color: tierColor }}
                  >
                    {friend.tier}
                  </div>
                </div>

                {/* Synergy */}
                <div
                  className="flex items-center gap-0.5 text-[9px] font-bold"
                  style={{ color: "#FFD700" }}
                >
                  <Zap size={8} className="fill-yellow-400" />
                  {friend.synergy}%
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
