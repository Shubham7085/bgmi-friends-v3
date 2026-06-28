import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Heart, ChevronRight, Instagram,
  Users, Trophy, Image, BarChart2, Settings, Share2, Menu,
  CheckCircle2, Star, Crosshair, Skull, Award, Zap,
} from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery, getSettings } from '../data/firebaseService';
import type { PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

// ── NAV ────────────────────────────────────────────────────
const NAV_TABS = [
  { label: 'Home',        emoji: '🏠', path: '/' },
  { label: 'Friends',     emoji: '👥', path: '/friends' },
  { label: 'Leaderboard', emoji: '🏆', path: '/leaderboard' },
  { label: 'Gallery',     emoji: '🖼️', path: '/gallery' },
  { label: 'Admin',       emoji: '⚙️', path: '/admin' },
];

// ── BADGE MAP ───────────────────────────────────────────────
const BADGE_MAP: Record<string, { label: string; icon: string; color: string; border: string; bg: string }> = {
  verified: { label: 'Verified Player', icon: '✔', color: '#3B82F6', border: 'rgba(59,130,246,0.4)',  bg: 'rgba(59,130,246,0.12)' },
  elite:    { label: 'Elite Player',    icon: '👑', color: '#FFD700', border: 'rgba(255,215,0,0.4)',   bg: 'rgba(255,215,0,0.12)'  },
  partner:  { label: 'Partner',         icon: '❤️', color: '#F43F5E', border: 'rgba(244,63,94,0.4)',   bg: 'rgba(244,63,94,0.12)'  },
  popular:  { label: 'Popular Player',  icon: '⭐', color: '#A855F7', border: 'rgba(168,85,247,0.4)',  bg: 'rgba(168,85,247,0.12)' },
};

// ── ACHIEVEMENTS DATA ───────────────────────────────────────
const ACHIEVEMENTS = [
  { label: 'WELL-LIKED',      icon: '💜', color: '#EC4899', points: 1000 },
  { label: 'BATTLE-HARDENED', icon: '⚔️', color: '#FFD700', points: 500  },
  { label: 'WEAPON MASTER',   icon: '🔫', color: '#EF4444', points: 200  },
  { label: 'HEADSHOT MASTER', icon: '💀', color: '#3B82F6', points: 300  },
  { label: 'CHICKEN EXPERT',  icon: '🍗', color: '#10B981', points: 100  },
  { label: 'SYNC LEGEND',     icon: '⭐', color: '#A855F7', points: 50   },
];

// ── UTILS ───────────────────────────────────────────────────
function calcAnniversary(since: string) {
  if (!since) return null;
  const diff = Date.now() - new Date(since).getTime();
  if (diff < 0) return null;
  const totalDays = Math.floor(diff / 86400000);
  return {
    years:  Math.floor(totalDays / 365),
    months: Math.floor((totalDays % 365) / 30),
    days:   totalDays % 30,
    hours:  Math.floor((diff % 86400000) / 3600000),
    totalDays,
  };
}

// ── PARTNER SECTION ─────────────────────────────────────────
const PartnerSection = memo(function PartnerSection({ partner }: { partner: PartnerData }) {
  const [counter, setCounter] = useState(() => calcAnniversary(partner?.playingTogetherSince));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!partner?.playingTogetherSince) return;
    timerRef.current = setInterval(() => setCounter(calcAnniversary(partner.playingTogetherSince)), 60000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [partner?.playingTogetherSince]);

  if (!partner) return null;

  const kd = partner?.kd ?? 0;
  const kdColor = getKdColor(kd);

  return (
    <motion.div
      className="mx-4 mt-3 rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(13,15,28,0.95)',
        border: '1px solid rgba(244,63,94,0.3)',
        boxShadow: '0 0 30px rgba(244,63,94,0.07)',
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-[#F43F5E] text-[#F43F5E]" />
          <span className="text-xs font-black text-[#F43F5E] tracking-widest uppercase">Partner</span>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-black"
          style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.3)', color: '#FFD700' }}>
          👑 Elite Partner
        </span>
      </div>

      {/* body */}
      <div className="flex items-center gap-3">
        {/* avatar with pink ring */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden"
            style={{ border: '2.5px solid #F43F5E', boxShadow: '0 0 16px rgba(244,63,94,0.5), 0 0 32px rgba(244,63,94,0.2)' }}>
            {partner.photo
              ? <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center font-black text-xl text-white"
                  style={{ background: 'linear-gradient(135deg,#3a0015,#1a000a)' }}>
                  {partner.name?.[0] ?? '?'}
                </div>
            }
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0d0f1c]"
            style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.8)' }} />
        </div>

        {/* name + uid + lover */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-white truncate">{partner.name || '—'}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">UID: {partner.uid || '—'}</p>
          <span className="mt-1 inline-block text-[9px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E' }}>
            Lover
          </span>
        </div>

        {/* KD + SYN boxes */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="px-3 py-2 rounded-xl text-center"
            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
            <p className="text-sm font-black" style={{ color: '#F43F5E' }}>{formatKd(kd)}+</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase">KD</p>
          </div>
          <div className="px-3 py-2 rounded-xl text-center"
            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
            <p className="text-sm font-black" style={{ color: '#F43F5E' }}>{partner.synergy ?? 0}+</p>
            <p className="text-[8px] text-slate-400 font-bold uppercase">SYN</p>
          </div>
        </div>
      </div>

      {/* timer */}
      {counter && partner.playingTogetherSince && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[9px] text-center text-slate-500 mb-2 uppercase tracking-wider">
            Playing Together Since {partner.playingTogetherSince}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {[['YRS', counter.years], ['MON', counter.months], ['DAYS', counter.days], ['HRS', counter.hours]].map(([l, v]) => (
              <div key={String(l)} className="py-2 rounded-xl text-center"
                style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)' }}>
                <p className="text-sm font-black text-[#F43F5E]">{v}</p>
                <p className="text-[7px] text-slate-500 uppercase tracking-wider">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-center text-[#F43F5E]/60 mt-2 font-bold">{counter.totalDays}+ days together ❤️</p>
        </div>
      )}
    </motion.div>
  );
});

// ── ACHIEVEMENT HEXAGON ─────────────────────────────────────
function AchievementBadge({ ach }: { ach: typeof ACHIEVEMENTS[0] }) {
  return (
    <div className="flex flex-col items-center flex-shrink-0 w-16">
      <div className="relative w-14 h-14 flex items-center justify-center"
        style={{
          clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          background: `linear-gradient(135deg,${ach.color}22,${ach.color}44)`,
          border: `1px solid ${ach.color}60`,
          boxShadow: `0 0 12px ${ach.color}30`,
        }}>
        <span className="text-xl">{ach.icon}</span>
      </div>
      <p className="text-[7px] text-slate-300 font-black text-center mt-1 leading-tight">{ach.label}</p>
      <p className="text-[8px] font-black mt-0.5" style={{ color: ach.color }}>{ach.points}</p>
    </div>
  );
}

// ── FRIEND CARD ─────────────────────────────────────────────
const FriendCard = memo(function FriendCard({ friend }: { friend: any }) {
  const kd = friend?.kd ?? 0;
  const kdColor = getKdColor(kd);
  return (
    <div className="flex flex-col items-center flex-shrink-0 w-20">
      <div className="w-14 h-14 rounded-full overflow-hidden"
        style={{ border: `2px solid ${kdColor}60`, boxShadow: `0 0 12px ${kdColor}30` }}>
        <img
          src={friend.photo || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200'}
          alt={friend.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-[10px] font-black text-slate-200 mt-1.5 truncate w-full text-center">{friend.name || '—'}</p>
      <p className="text-[9px] font-bold" style={{ color: kdColor }}>{formatKd(kd)}+ KD</p>
    </div>
  );
});

// ── MAIN ────────────────────────────────────────────────────
export default function HomePage() {
  const [profile,  setProfile]  = useState<any>(null);
  const [social,   setSocial]   = useState<any>(null);
  const [friends,  setFriends]  = useState<any[]>([]);
  const [gallery,  setGallery]  = useState<any[]>([]);
  const [, setSettings] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [p, s, f, g, st] = await Promise.all([
          getProfile(), getSocialLinks(), getFriends(), getGallery(), getSettings(),
        ]);
        setProfile(p); setSocial(s); setFriends(f); setGallery(g); setSettings(st);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#070B14' }}>
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ border: '3px solid rgba(0,240,255,0.1)', borderTopColor: '#00F0FF' }} />
      <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(0,240,255,0.5)' }}>Loading Vault...</p>
    </div>
  );

  const kd      = profile?.kd ?? 5.24;
  const kdColor = getKdColor(kd);
  const badges: string[] = profile?.badges ?? [];

  const stats = {
    totalFriends:   friends.length || 1,
    totalSynergy:   friends.reduce((s: number, f: any) => s + (f.synergy || 0), 0) || 4499,
    highestSynergy: friends.length ? Math.max(...friends.map((f: any) => f.synergy || 0)) : 4499,
    avgSynergy:     friends.length ? Math.round(friends.reduce((s: number, f: any) => s + (f.synergy || 0), 0) / friends.length) : 4499,
    totalMemories:  friends.reduce((s: number, f: any) => s + (f.memories?.length || 0), 0),
    collectionAvg:  friends.length ? Math.round(friends.reduce((s: number, f: any) => s + (f.collectionLevel || 0), 0) / friends.length) : 6469,
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden pb-24" style={{ background: '#070B14' }}>

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(7,11,20,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-base">🛡️</span>
          <span className="text-sm font-black tracking-[0.15em]" style={{ color: '#00F0FF' }}>BGMI VAULT</span>
        </div>
        <button className="p-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Share2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg,#0a1628 0%,#070B14 100%)' }}>
        {/* bg image overlay */}
        {profile?.heroBackground && (
          <div className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${profile.heroBackground})` }} />
        )}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,11,20,0.4),rgba(7,11,20,0.85) 80%,#070B14)' }} />

        <div className="relative z-10 px-4 pt-5 pb-6">
          <div className="flex items-start gap-4">

            {/* ── AVATAR with golden frame ── */}
            <div className="relative flex-shrink-0">
              {/* golden glow ring */}
              <div className="absolute -inset-1 rounded-2xl"
                style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00,#FFD700)', padding: '2px', borderRadius: '18px', boxShadow: '0 0 20px rgba(255,215,0,0.5), 0 0 40px rgba(255,140,0,0.3)' }} />
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden z-10" style={{ margin: '2px' }}>
                <img
                  src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* crown above */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-base z-20">👑</div>
              {/* online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#070B14] z-20"
                style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.8)' }} />
            </div>

            {/* ── NAME + BADGES ── */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-wide text-white leading-none">{profile?.ign || 'D3xSHUBHAM'}</h1>
                {badges.includes('verified') && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: '#2563EB', boxShadow: '0 0 8px rgba(37,99,235,0.7)' }}>
                    <span className="text-[9px] text-white font-black">✔</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 font-medium">{profile?.realName || 'SHUBHAM KUMAR NAGVANSHI'}</p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-lg"
                  style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.3)', color: '#00F0FF' }}>
                  ID: {profile?.bgmiId || '5305051851'}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />{profile?.country || 'INDIA'}
                </span>
              </div>

              {/* badges row */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {badges.map((badge: string) => {
                  const b = BADGE_MAP[badge];
                  if (!b) return null;
                  return (
                    <span key={badge} className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                      style={{ color: b.color, background: b.bg, border: `1px solid ${b.border}` }}>
                      {b.icon} {b.label}
                    </span>
                  );
                })}
                {/* always show mythic + conqueror */}
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                  style={{ color: '#FF6B6B', background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.3)' }}>
                  👗 Mythic Fashion
                </span>
              </div>
            </div>

            {/* ── TIER BADGE (right) ── */}
            <div className="flex-shrink-0 flex flex-col items-center pt-1">
              <div className="text-3xl">🪖</div>
              <p className="text-[9px] font-black text-center mt-1 uppercase leading-tight"
                style={{ color: '#FFD700', textShadow: '0 0 8px rgba(255,215,0,0.6)' }}>
                {profile?.tier || 'ACE\nDOMINATOR'}
              </p>
              <div className="flex items-center gap-0.5 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] font-black text-yellow-400">{profile?.tierStars || 22}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── PARTNER ── */}
      <PartnerSection partner={profile?.partner} />

      {/* ── VAULT STATS 3-col ── */}
      <div className="px-4 mt-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: '👥', label: 'FRIENDS',       value: `${stats.totalFriends}+`,   color: '#00F0FF' },
            { icon: '❤️',  label: 'TOTAL SYNERGY', value: `${stats.totalSynergy}+`,   color: '#F43F5E' },
            { icon: '🏅', label: 'AVG SYNERGY',   value: `${stats.avgSynergy}+`,     color: '#FFD700' },
            { icon: '💠', label: 'COLL. AVG',     value: `${stats.collectionAvg}+`,  color: '#A855F7' },
            { icon: '🖼️',  label: 'MEMORIES',      value: `${stats.totalMemories}+`,  color: '#4ECDC4' },
            { icon: '🏆', label: 'HIGHEST SYN',   value: `${stats.highestSynergy}+`, color: '#00E5FF' },
          ].map((s) => (
            <div key={s.label}
              className="rounded-xl p-3"
              style={{ background: 'rgba(13,15,28,0.9)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">{s.icon}</span>
                <p className="text-[7px] text-slate-500 uppercase tracking-wider font-bold">{s.label}</p>
              </div>
              <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

{/* ── PROFILE DETAILS ── */}
      <div className="mx-4 mt-3 rounded-2xl p-4"
        style={{ background: 'rgba(13,15,28,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">⚔️</span>
          <p className="text-xs font-black text-white uppercase tracking-widest">Profile Details</p>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          {[
            { label: 'COLLECTION LEVEL',  value: `${profile?.collectionLevel || 71}+`,           color: '#A855F7' },
            { label: 'ACCOUNT LEVEL',     value: `${profile?.accountLevel || 91}+`,              color: '#00F0FF' },
            { label: 'POPULARITY',        value: `${profile?.popularity || '2267874'}+`,         color: '#FFD700' },
            { label: 'LIKES',             value: `${profile?.likes || '26868'}+`,                color: '#F43F5E' },
            { label: 'MATCHES',           value: `${profile?.matches || 0}+`,                    color: '#00E5FF' },
            { label: 'ACHIEVEMENT POINTS',value: `${profile?.achievementPoints || 0}+`,          color: '#4ECDC4' },
            { label: 'CURRENT TIER',      value: profile?.tier || 'Ace Dominator',               color: '#FF9F43' },
            { label: 'HIGHEST TIER',      value: profile?.highestTier || 'Ace Dominator',        color: '#FF9F43' },
            { label: 'PLAYING SINCE',     value: profile?.playingSince || '8 YEARS',             color: '#10B981' },
            { label: 'STATE',             value: profile?.state || 'BIHAR',                      color: '#6366F1' },
            { label: 'COUNTRY',           value: profile?.country || 'INDIA',                    color: '#F59E0B' },
            { label: 'KD RATIO',          value: formatKd(kd),                                   color: kdColor   },
          ].map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{item.label}</p>
              <p className="text-[12px] font-black mt-0.5 truncate" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <div className="mx-4 mt-3 rounded-2xl p-4"
        style={{ background: 'rgba(13,15,28,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-white uppercase tracking-widest">Achievements</p>
          <button className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: '#00F0FF' }}>
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {ACHIEVEMENTS.map((ach) => (
            <AchievementBadge key={ach.label} ach={ach} />
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS + FEATURED FRIENDS (side by side) ── */}
      <div className="px-4 mt-3 grid grid-cols-2 gap-3">

        {/* Quick Actions */}
        <div className="rounded-2xl p-3"
          style={{ background: 'rgba(13,15,28,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2.5">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'All Friends', icon: Users,    path: '/friends',     color: '#00F0FF' },
              { label: 'Top 10',      icon: Trophy,   path: '/leaderboard', color: '#FFD700' },
              { label: 'Gallery',     icon: Image,    path: '/gallery',     color: '#FF6B6B' },
              { label: 'Statistics',  icon: BarChart2,path: '/statistics',  color: '#A855F7' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="rounded-xl p-2 flex flex-col items-start gap-1.5 active:scale-95 transition-transform"
                style={{ background: `${action.color}0C`, border: `1px solid ${action.color}22` }}
              >
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
                <p className="text-[9px] font-black text-slate-300 leading-tight">{action.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Friends */}
        <div className="rounded-2xl p-3"
          style={{ background: 'rgba(13,15,28,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Featured</p>
            <button onClick={() => navigate('/friends')} className="text-[9px] font-bold" style={{ color: '#00F0FF' }}>View All</button>
          </div>
          <div className="flex flex-col gap-2.5">
            {friends.slice(0, 2).map((friend: any, idx: number) => {
              const fkd = friend?.kd ?? 0;
              const fColor = getKdColor(fkd);
              return (
                <div key={friend.id ?? idx} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: `2px solid ${fColor}50` }}>
                    <img src={friend.photo || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200'}
                      alt={friend.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-slate-200 truncate">{friend.name || '—'}</p>
                    <p className="text-[9px] font-bold" style={{ color: fColor }}>{formatKd(fkd)}+ KD</p>
                  </div>
                </div>
              );
            })}
            {/* View All button */}
            <button onClick={() => navigate('/friends')}
              className="w-full rounded-xl py-2 flex items-center justify-center mt-1"
              style={{ background: 'rgba(0,240,255,0.07)', border: '1px dashed rgba(0,240,255,0.25)' }}>
              <span className="text-[9px] font-black" style={{ color: '#00F0FF' }}>+ View All</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── GALLERY PREVIEW ── */}
      {gallery.length > 0 && (
        <div className="mx-4 mt-3 rounded-2xl p-4"
          style={{ background: 'rgba(13,15,28,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-white uppercase tracking-widest">Gallery</p>
            <button onClick={() => navigate('/gallery')} className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: '#00F0FF' }}>
              Open Gallery <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {gallery.slice(0, 6).map((img: any, i: number) => (
              <div key={img.id ?? i} onClick={() => navigate('/gallery')}
                className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
                <img src={img.url ?? img.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CONNECT ── */}
      <div className="mx-4 mt-3 rounded-2xl p-4"
        style={{ background: 'rgba(13,15,28,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-3">Connect</p>
        <a
          href={social?.instagram || 'https://instagram.com/shubhamnagvanshi84823'}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(90deg,rgba(244,63,94,0.15),rgba(168,85,247,0.15))', border: '1px solid rgba(244,63,94,0.3)', color: '#F472B6' }}
        >
          <Instagram className="w-4 h-4" /> Instagram
        </a>
      </div>

      <div className="h-4" />

      {/* ── BOTTOM NAV ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50"
        style={{ background: 'rgba(7,11,20,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-around py-2 px-2">
          {NAV_TABS.map((tab) => {
            const active = tab.path === '/';
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-90"
                style={{ background: active ? 'rgba(0,240,255,0.08)' : 'transparent' }}
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-wide"
                  style={{ color: active ? '#00F0FF' : 'rgba(100,116,139,0.8)' }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
                      }
