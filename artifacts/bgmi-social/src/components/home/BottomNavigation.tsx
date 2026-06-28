import { motion } from "framer-motion";
import { Home, Users, Trophy, ImageIcon, Settings } from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  key: string;
}

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: <Home size={20} />, key: "home" },
  { label: "Friends", icon: <Users size={20} />, key: "friends" },
  { label: "Ranks", icon: <Trophy size={20} />, key: "leaderboard" },
  { label: "Gallery", icon: <ImageIcon size={20} />, key: "gallery" },
  { label: "Settings", icon: <Settings size={20} />, key: "settings" },
];

export default function BottomNavigation({
  activeTab,
  onTabChange,
}: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-safe">
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24, delay: 0.3 }}
        className="mx-4 mb-4 rounded-3xl overflow-hidden"
        style={{
          background: "rgba(7,11,20,0.85)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,240,255,0.06) inset",
          width: "calc(100vw - 2rem)",
          maxWidth: 480,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(0,240,255,0.4), rgba(139,92,246,0.4), transparent)",
          }}
        />

        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.key;
            return (
              <motion.button
                key={item.key}
                whileTap={{ scale: 0.88 }}
                onClick={() => onTabChange(item.key)}
                className="flex flex-col items-center gap-1 relative px-3 py-2 rounded-2xl min-w-[52px]"
                style={{
                  background: isActive
                    ? "rgba(0,240,255,0.08)"
                    : "transparent",
                  border: isActive
                    ? "1px solid rgba(0,240,255,0.2)"
                    : "1px solid transparent",
                }}
              >
                {/* Active glow */}
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        "radial-gradient(ellipse at center, rgba(0,240,255,0.12) 0%, transparent 70%)",
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={isActive ? { y: -1 } : { y: 0 }}
                  style={{
                    color: isActive ? "#00F0FF" : "rgba(255,255,255,0.35)",
                  }}
                >
                  {item.icon}
                </motion.div>

                {/* Label */}
                <span
                  className="text-[9px] font-bold transition-colors leading-none"
                  style={{
                    color: isActive ? "#00F0FF" : "rgba(255,255,255,0.25)",
                  }}
                >
                  {item.label}
                </span>

                {/* Active dot */}
                {isActive && (
                  <motion.div
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: "#00F0FF" }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
