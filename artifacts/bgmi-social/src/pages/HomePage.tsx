import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import HeroSection from "../components/home/HeroSection";
import PartnerCard from "../components/home/PartnerCard";
import StatsSection from "../components/home/StatsSection";
import Achievements from "../components/home/Achievements";
import GalleryPreview from "../components/home/GalleryPreview";
import QuickActions from "../components/home/QuickActions";
import BottomNavigation from "../components/home/BottomNavigation";
import FeaturedFriends from "../components/home/FeaturedFriends";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FriendProfile {
  id: string;
  ign: string;
  realName: string;
  avatarUrl: string;
  tier: string;
  synergy: number;
  isOnline: boolean;
  relationship: string;
}

interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  friendIgn?: string;
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────────
// Replace these with your real Firebase fetches / auth data.

const DEMO_PROFILE = {
  ign: "PhantomX",
  realName: "Arjun Sharma",
  bgmiId: "5234761892",
  country: "India 🇮🇳",
  tier: "Conqueror",
  stars: 7,
  level: 68,
  avatarUrl: "",
  backgroundUrl: "",
  isVerified: true,
  isElite: true,
  isConqueror: true,
  isMythic: true,
  isOnline: true,
};

const DEMO_PARTNER = {
  ign: "StellaRose",
  realName: "Priya Iyer",
  avatarUrl: "",
  isOnline: true,
  kd: 3.8,
  synergy: 96,
  tier: "Ace",
};

const DEMO_STATS = {
  totalFriends: 24,
  totalSynergy: 1840,
  avgSynergy: 76,
  highestSynergy: 96,
  collection: 24,
  popularity: 89,
  memories: 142,
};

const DEMO_FRIENDS: FriendProfile[] = [
  { id: "1", ign: "NightHawk", realName: "Rahul", avatarUrl: "", tier: "Ace", synergy: 88, isOnline: true, relationship: "Squad" },
  { id: "2", ign: "BladeRunner", realName: "Dev", avatarUrl: "", tier: "Diamond", synergy: 82, isOnline: false, relationship: "Duo" },
  { id: "3", ign: "ViperX", realName: "Karan", avatarUrl: "", tier: "Conqueror", synergy: 91, isOnline: true, relationship: "Best Friend" },
  { id: "4", ign: "Panda99", realName: "Amit", avatarUrl: "", tier: "Platinum", synergy: 74, isOnline: false, relationship: "Friend" },
  { id: "5", ign: "IcyBreeze", realName: "Simran", avatarUrl: "", tier: "Ace", synergy: 85, isOnline: true, relationship: "Squad" },
];

const DEMO_GALLERY: GalleryImage[] = [
  { id: "1", url: "https://picsum.photos/seed/bgmi1/300/400", caption: "Chicken Dinner 🍗", friendIgn: "NightHawk" },
  { id: "2", url: "https://picsum.photos/seed/bgmi2/300/400", caption: "Final Zone Clutch", friendIgn: "ViperX" },
  { id: "3", url: "https://picsum.photos/seed/bgmi3/300/400", caption: "Squad Wipe ⚡", friendIgn: "BladeRunner" },
];

const DEMO_UNLOCKED = ["conqueror", "ace_killer", "loyal_partner", "sharpshooter"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("home");

  // ── Navigation handlers ────────────────────────────────────────────────────
  const goFriends      = () => { setActiveTab("friends");      navigate("/friends"); };
  const goLeaderboard  = () => { setActiveTab("leaderboard");  navigate("/leaderboard"); };
  const goGallery      = () => { setActiveTab("gallery");      navigate("/gallery"); };
  const goStats        = () => navigate("/stats");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const routes: Record<string, string> = {
      home:        "/",
      friends:     "/friends",
      leaderboard: "/leaderboard",
      gallery:     "/gallery",
      settings:    "/settings",
    };
    if (routes[tab]) navigate(routes[tab]);
  };

  // ── Replace demo data with real Firebase data below ────────────────────────
  const profile  = DEMO_PROFILE;
  const partner  = DEMO_PARTNER;
  const stats    = DEMO_STATS;
  const friends  = DEMO_FRIENDS;
  const gallery  = DEMO_GALLERY;
  const unlocked = DEMO_UNLOCKED;

  return (
    <div
      className="min-h-screen w-full relative"
      style={{
        background: "#070B14",
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        overscrollBehavior: "none",
      }}
    >
      {/* ── Ambient background glow ────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,240,255,0.05) 0%, transparent 50%)",
        }}
      />

      {/* ── Scrollable content ─────────────────────────────────────────────── */}
      <AnimatePresence>
        <motion.div
          key="homepage"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="relative z-10 pb-32"
        >
          {/* 1. Hero */}
          <HeroSection profile={profile} />

          {/* 2. Gaming Partner */}
          <div className="mt-4">
            <PartnerCard partner={partner} />
          </div>

          {/* 3. Quick Actions */}
          <div className="mt-5">
            <QuickActions
              onFriends={goFriends}
              onLeaderboard={goLeaderboard}
              onGallery={goGallery}
              onStats={goStats}
            />
          </div>

          {/* 4. Quick Stats */}
          <div className="mt-6">
            <StatsSection stats={stats} />
          </div>

          {/* 5. Featured Friends */}
          <div className="mt-6">
            <FeaturedFriends
              friends={friends}
              onViewAll={goFriends}
              onFriendClick={(id) => navigate(`/friends/${id}`)}
            />
          </div>

          {/* 6. Achievements */}
          <div className="mt-6">
            <Achievements unlockedIds={unlocked} />
          </div>

          {/* 7. Gallery Preview */}
          <div className="mt-6">
            <GalleryPreview
              images={gallery}
              onViewAll={goGallery}
              totalCount={stats.memories}
            />
          </div>

          {/* ── Section: Profile Details (inline — lightweight) ─────────────── */}
          <div className="mt-6 mx-4">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: "linear-gradient(180deg, #A78BFA, #8B5CF6)" }}
              />
              <span
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: "#A78BFA" }}
              >
                Profile Details
              </span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="rounded-2xl p-4 grid grid-cols-2 gap-4"
              style={{
                background: "rgba(139,92,246,0.06)",
                border: "1px solid rgba(139,92,246,0.18)",
              }}
            >
              {[
                { label: "IGN",      value: profile.ign },
                { label: "Real Name",value: profile.realName },
                { label: "BGMI ID",  value: profile.bgmiId },
                { label: "Country",  value: profile.country },
                { label: "Tier",     value: profile.tier },
                { label: "Level",    value: `LVL ${profile.level}` },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-sm font-bold text-white truncate">
                    {item.value}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Bottom Navigation ──────────────────────────────────────────────── */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
          }
