import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Heart, ChevronRight, Instagram,
  Users, Trophy, Image, BarChart2, Settings,
} from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery, getSettings } from '../data/firebaseService';
import type { PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

// ── CONSTANTS ──────────────────────────────────────────────
const quickActions = [
  { label: 'All Friends',  icon: Users,    path: '/friends',     color: '#00F0FF' },
  { label: 'Top 10',       icon: Trophy,   path: '/leaderboard', color: '#FFD700' },
  { label: 'Gallery',      icon: Image,    path: '/gallery',     color: '#FF6B6B' },
  { label: 'Statistics',   icon: BarChart2,path: '/statistics',  color: '#A855F7' },
];

const BADGE_MAP: Record<string, { label: string; icon: string; color: string }> = {
  verified: { label: 'Verified',  icon: '✔',  color: '#3B82F6' },
  elite:    { label: 'Elite',     icon: '👑', color: '#FFD700' },
  partner:  { label: 'Partner',   icon: '❤️', color: '#F43F5E' },
  popular:  { label: 'Popular',   icon: '⭐', color: '#A855F7' },
};

const NAV_TABS = [
  { label: 'Home',        emoji: '🏠', path: '/' },
  { label: 'Friends',     emoji: '👥', path: '/friends' },
  { label: 'Leaderboard', emoji: '🏆', path: '/leaderboard' },
  { label: 'Gallery',     emoji: '🖼️', path: '/gallery' },
  { label: 'Admin',       emoji: '⚙️', path: '/admin' },
];

// ── UTILS ──────────────────────────────────────────────────
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

// ── SECTION HEADER ─────────────────────────────────────────
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-[3px] h-4 rounded-full" style={{ background: 'linear-gradient(180deg,#00F0FF,#A855F7)' }} />
        <span className="text-[11px] font-black text-white uppercase tracking-[0.12em]">{title}</span>
      </div>
      {action && (
        <button onClick={onAction} className="text-[10px] font-bold" style={{ color: '#00F0FF' }}>{action} →</button>
      )}
    </div>
  );
}

// ── PARTNER SECTION ────────────────────────────────────────
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
      className="px-4 mt-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      <div
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg,rgba(244,63,94,0.09),rgba(168,85,247,0.06),rgba(10,14,26,0.98))',
          border: '1px solid rgba(244,63,94,0.3)',
          boxShadow: '0 4px 24px rgba(244,63,94,0.08)',
        }}
      >
        {/* bg glow */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(244,63,94,0.18),transparent 70%)', filter: 'blur(18px)' }} />

        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#F43F5E] text-[#F43F5E]" />
            <span className="text-[10px] font-black text-[#F43F5E] tracking-widest uppercase">Gaming Partner</span>
          </div>
          <span className="text-[9px] px-2 py-0.5 rounded-full font-black"
            style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.28)', color: '#FFD700' }}>
            👑 Elite Partner
          </span>
        </div>

        {/* info row */}
        <div className="flex items-center gap-3">
          {/* avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl overflow-hidden"
              style={{ border: '2px solid rgba(244,63,94,0.45)', boxShadow: '0 0 14px rgba(244,63,94,0.25)' }}>
              {partner.photo
                ? <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-white font-black text-xl"
                    style={{ background: 'linear-gradient(135deg,#1a0510,#2a0820)' }}>
                    {partner.name?.[0] ?? '?'}
                  </div>
              }
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#070B14]"
              style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
          </div>

          {/* details */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-white truncate">{partner.name || '—'}</p>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">UID: {partner.uid || '—'}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', color: '#F43F5E' }}>❤️ Lover</span>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full font-black"
                style={{ background: `${kdColor}18`, border: `1px solid ${kdColor}35`, color: kdColor }}>
                {getKdDot(kd)} {formatKd(kd)} KD
              </span>
              <span className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.25)', color: '#A855F7' }}>
                ⚡ {partner.synergy ?? 0}+ SYN
              </span>
            </div>
          </div>
        </div>

        {/* timer */}
        {counter && partner.playingTogetherSince && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] text-center text-slate-500 mb-2 uppercase tracking-wider">
              Together since {partner.playingTogetherSince}
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
            <p className="text-[9px] text-center text-[#F43F5E]/70 mt-2 font-bold">{counter.totalDays}+ days together ❤️</p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ── FRIEND CARD ────────────────────────────────────────────
const FriendCard = memo(function FriendCard({ friend }: { friend: any }) {
  const kd = friend?.kd ?? 0;
  const kdColor = getKdColor(kd);
  return (
    <div className="flex-shrink-0 w-[84px] rounded-2xl p-2.5 text-center"
      style={{ background: 'rgba(13,18,31,0.85)', border: '1px solid rgba(255,255,255,0.07)' }}>
      <div className="w-11 h-11 rounded-xl overflow-hidden mx-auto relative"
        style={{ border: `2px solid ${kdColor}50`, boxShadow: `0 0 10px ${kdColor}25` }}>
        <img
          src={friend.photo || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200'}
          alt={friend.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-[#070B14]"
          style={{ background: friend.online ? '#22c55e' : '#475569' }} />
      </div>
      <p className="text-[9px] font-black text-slate-200 mt-1.5 truncate">{friend.name || '—'}</p>
      <p className="text-[8px] font-bold" style={{ color: kdColor }}>{formatKd(kd)} KD</p>
    </div>
  );
});

// ── GALLERY PREVIEW ────────────────────────────────────────
const GalleryPreview = memo(function GalleryPreview({ images, onOpen }: { images: any[]; onOpen: () => void }) {
  const preview = images.slice(0, 6);
  if (!preview.length) return null;
  return (
    <div className="px-4 mt-5">
      <SectionHeader title="Gallery Preview" action="Open Gallery" onAction={onOpen} />
      <div className="grid grid-cols-3 gap-1.5">
        {preview.map((img: any, i: number) => (
          <div
            key={img.id ?? i}
            onClick={onOpen}
            className="aspect-square rounded-xl overflow-hidden cursor-pointer"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <img
              src={img.url ?? img.src}
              alt=""
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
});

// ── MAIN PAGE ──────────────────────────────────────────────
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
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-3">
      <div className="w-11 h-11 rounded-full animate-spin"
        style={{ border: '3px solid rgba(0,240,255,0.12)', borderTopColor: '#00F0FF' }} />
      <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(0,240,255,0.5)' }}>
        Loading Vault...
      </p>
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
    <div className="min-h-screen text-white font-sans overflow-x-hidden pb-28" style={{ background: '#070B14' }}>

      {/* ─── TOP BAR ─────────────────────────────────── */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(7,11,20,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,240,255,0.07)' }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="text-xs font-black tracking-[0.22em]" style={{ color: '#00F0FF' }}>BGMI VAULT</span>
        </div>
        <button onClick={() => navigate('/admin')} className="p-1.5 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Settings className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* ─── HERO BANNER ─────────────────────────────── */}
      <div className="relative w-full h-44 overflow-hidden">
        {/* bg image */}
        <div className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: profile?.heroBackground
              ? `url(${profile.heroBackground})`
              : 'linear-gradient(135deg,#0a1628,#0d1f3c,#070B14)',
          }} />
        {/* strong dark overlay so content is always readable */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,rgba(7,11,20,0.55) 0%,rgba(7,11,20,0.75) 60%,#070B14 100%)' }} />
        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,240,255,1) 1px,transparent 1px)', backgroundSize: '36px 36px' }} />

        {/* online badge */}
        <motion.div className="absolute top-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-black text-green-400 uppercase tracking-wider">Online</span>
        </motion.div>

        {/* tier badge */}
        {profile?.tier && (
          <motion.div className="absolute top-3 right-4 px-2.5 py-1 rounded-full text-[9px] font-black"
            style={{ background: 'rgba(255,159,67,0.15)', border: '1px solid rgba(255,159,67,0.35)', color: '#FF9F43', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            ⚔️ {profile.tier}
          </motion.div>
        )}
      </div>

      {/* ─── MAIN PROFILE CARD ───────────────────────── */}
      <div className="px-4 -mt-8 relative z-10">
        <motion.div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg,rgba(0,240,255,0.05) 0%,rgba(10,14,26,0.97) 50%,rgba(168,85,247,0.04) 100%)',
            border: '1px solid rgba(0,240,255,0.16)',
            boxShadow: '0 0 0 1px rgba(0,240,255,0.04),0 8px 40px rgba(0,0,0,0.6)',
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          {/* corner glow */}
          <div className="absolute top-0 right-0 w-44 h-44 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right,rgba(0,240,255,0.07),transparent 65%)' }} />

          {/* ── Avatar + name ── */}
          <div className="flex items-start gap-4">
            {/* spinning ring avatar */}
            <div className="relative flex-shrink-0 w-20 h-20">
              {/* animated ring */}
              <motion.div
                className="absolute -inset-[2px] rounded-2xl"
                style={{ background: 'conic-gradient(from 0deg,#00F0FF,#A855F7,#FFD700,#00F0FF)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
              {/* inner mask */}
              <div className="absolute inset-[2px] rounded-[14px] z-10 overflow-hidden" style={{ background: '#070B14' }}>
                <img
                  src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* online dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full z-20 border-2 border-[#070B14]"
                style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.7)' }} />
            </div>

            {/* name block */}
            <div className="flex-1 min-w-0 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-[22px] font-black leading-tight tracking-wide"
                  style={{ background: 'linear-gradient(90deg,#fff 30%,#00F0FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {profile?.ign || 'D3xSHUBHAM'}
                </h1>
                {badges.includes('verified') && (
                  <span className="w-[18px] h-[18px] rounded-full flex items-center justify-center text-[8px] font-black flex-shrink-0"
                    style={{ background: '#2563EB', boxShadow: '0 0 8px rgba(37,99,235,0.6)' }}>✔</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{profile?.realName || 'SHUBHAM KUMAR NAGVANSHI'}</p>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[9px] font-black font-mono px-2 py-[3px] rounded-lg"
                  style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.22)', color: '#00F0FF' }}>
                  #{profile?.bgmiId || '5305051851'}
                </span>
                <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {profile?.state || 'Bihar'}, {profile?.country || 'India'}
                </span>
              </div>
            </div>
          </div>

          {/* ── KD bar ── */}
          <div className="mt-4 rounded-2xl p-3 flex items-center gap-4"
            style={{ background: `${kdColor}0C`, border: `1px solid ${kdColor}28` }}>
            <div className="flex-1">
              <p className="text-[8px] text-slate-500 uppercase tracking-[0.14em] font-bold">Kill / Death Ratio</p>
              <p className="text-[28px] font-black leading-none mt-0.5" style={{ color: kdColor }}>{formatKd(kd)}</p>
            </div>
            <div className="w-px h-10 bg-white/5" />
            <div className="flex-1 text-right">
              <p className="text-[8px] text-slate-500 uppercase tracking-[0.14em] font-bold">Playing Since</p>
              <p className="text-sm font-black text-slate-200 mt-0.5">{profile?.playingSince || '8 YEARS'}</p>
            </div>
          </div>
{/* ── Badges ── */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {badges.map((badge: string) => {
              const b = BADGE_MAP[badge];
              if (!b) return null;
              return (
                <span key={badge} className="text-[9px] px-2 py-0.5 rounded-full font-black"
                  style={{ color: b.color, background: `${b.color}14`, border: `1px solid ${b.color}30` }}>
                  {b.icon} {b.label}
                </span>
              );
            })}
            <span className="text-[9px] px-2 py-0.5 rounded-full font-black"
              style={{ color: '#FF6B6B', background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.28)' }}>
              👗 Mythic Fashion
            </span>
            <span className="text-[9px] px-2 py-0.5 rounded-full font-black"
              style={{ color: '#FFD700', background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.28)' }}>
              🏆 Conqueror
            </span>
          </div>

          {/* ── About ── */}
          {profile?.bio && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: '#00F0FF' }}>About Me</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {/* ── Stat pills ── */}
          <div className="flex gap-2 mt-4">
            {[
              { label: 'Collection', value: `${profile?.collectionLevel || 71}+`,  color: '#A855F7' },
              { label: 'Acct Lvl',   value: `${profile?.accountLevel  || 91}+`,    color: '#00F0FF' },
              { label: 'Popularity', value: profile?.popularity ? `${Math.round(Number(profile.popularity)/1000)}K` : '2268K', color: '#FFD700' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex-1 py-2 rounded-xl text-center"
                style={{ background: `${color}0C`, border: `1px solid ${color}22` }}>
                <p className="text-[8px] text-slate-500 uppercase font-bold tracking-wider">{label}</p>
                <p className="text-sm font-black mt-0.5" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>

          {/* ── Instagram ── */}
          <a
            href={social?.instagram || 'https://instagram.com/shubhamnagvanshi84823'}
            target="_blank" rel="noreferrer"
            className="mt-3 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-black active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(90deg,rgba(244,63,94,0.14),rgba(168,85,247,0.14))', border: '1px solid rgba(244,63,94,0.28)', color: '#F472B6' }}
          >
            <Instagram className="w-3.5 h-3.5" /> Follow on Instagram
          </a>
        </motion.div>
      </div>

      {/* ─── PARTNER ─────────────────────────────────── */}
      <PartnerSection partner={profile?.partner} />

      {/* ─── VAULT STATS ─────────────────────────────── */}
      <motion.div className="px-4 mt-5" variants={staggerContainer} initial="hidden" animate="visible">
        <SectionHeader title="Vault Stats" />
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Friends',   value: `${stats.totalFriends}+`,   color: '#00F0FF' },
            { label: 'Total SYN', value: `${stats.totalSynergy}+`,   color: '#FF6B6B' },
            { label: 'Avg SYN',   value: stats.avgSynergy,           color: '#FFD700' },
            { label: 'Coll Avg',  value: stats.collectionAvg,        color: '#A855F7' },
            { label: 'Memories',  value: stats.totalMemories,        color: '#4ECDC4' },
            { label: 'Peak SYN',  value: stats.highestSynergy,       color: '#00E5FF' },
          ].map((s, i) => (
            <motion.div key={s.label} className="py-3 rounded-2xl text-center"
              style={{ background: `${s.color}09`, border: `1px solid ${s.color}1E` }}
              variants={fadeInUp} custom={i}>
              <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{s.label}</p>
              <p className="text-base font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── PROFILE DETAILS ─────────────────────────── */}
      <div className="px-4 mt-5">
        <SectionHeader title="Profile Details" />
        <div className="rounded-2xl p-4" style={{ background: 'rgba(10,14,26,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            {[
              { label: 'Current Tier',   value: profile?.tier             || 'Ace Dominator', color: '#FF9F43' },
              { label: 'Highest Tier',   value: profile?.highestTier      || 'Ace Dominator', color: '#FF5252' },
              { label: 'Collection Lvl', value: `${profile?.collectionLevel || 71}+`,         color: '#A855F7' },
              { label: 'Account Level',  value: `${profile?.accountLevel   || 91}+`,          color: '#00F0FF' },
              { label: 'Popularity',     value: `${profile?.popularity     || '2267874'}+`,   color: '#FFD700' },
              { label: 'Achieve. Pts',   value: `${profile?.achievementPoints || 0}+`,        color: '#4ECDC4' },
              { label: 'Total Matches',  value: `${profile?.matches        || 0}+`,           color: '#00E5FF' },
              { label: 'Playing Since',  value: profile?.playingSince      || '8 YEARS',      color: '#10B981' },
              { label: 'State',          value: profile?.state             || 'BIHAR',        color: '#6366F1' },
              { label: 'Country',        value: profile?.country           || 'INDIA',        color: '#F59E0B' },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="text-[8px] text-slate-600 uppercase tracking-wider font-black">{item.label}</p>
                <p className="text-[11px] font-black mt-0.5 truncate" style={{ color: item.color }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── QUICK ACTIONS ───────────────────────────── */}
      <div className="px-4 mt-5">
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-2 gap-2.5">
          {quickActions.map((action, i) => (
            <motion.button
              key={action.label}
              onClick={() => navigate(action.path)}
              className="rounded-2xl p-4 text-left flex flex-col gap-3 relative overflow-hidden active:scale-95 transition-transform h-[86px]"
              style={{ background: `${action.color}09`, border: `1px solid ${action.color}22` }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              {/* icon */}
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `${action.color}16`, border: `1px solid ${action.color}28` }}>
                <action.icon className="w-4 h-4" style={{ color: action.color }} />
              </div>
              {/* label + arrow */}
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-black text-slate-200">{action.label}</p>
                <ChevronRight className="w-3.5 h-3.5" style={{ color: action.color }} />
              </div>
              {/* corner glow */}
              <div className="absolute -bottom-5 -right-5 w-16 h-16 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle,${action.color}18,transparent 70%)` }} />
            </motion.button>
          ))}
        </div>
      </div>

      {/* ─── FEATURED FRIENDS ────────────────────────── */}
      {friends.length > 0 && (
        <div className="mt-5">
          <div className="px-4">
            <SectionHeader title="Featured Friends" action="View All" onAction={() => navigate('/friends')} />
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 scrollbar-none">
            {friends.slice(0, 8).map((friend: any, idx: number) => (
              <motion.div
                key={friend.id ?? idx}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <FriendCard friend={friend} />
              </motion.div>
            ))}
            {/* View All tile */}
            <button
              onClick={() => navigate('/friends')}
              className="flex-shrink-0 w-[84px] rounded-2xl flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform"
              style={{ background: 'rgba(0,240,255,0.05)', border: '1px dashed rgba(0,240,255,0.22)' }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,240,255,0.1)' }}>
                <ChevronRight className="w-4 h-4 text-[#00F0FF]" />
              </div>
              <p className="text-[8px] font-black text-[#00F0FF]">View All</p>
            </button>
          </div>
        </div>
      )}

      {/* ─── GALLERY PREVIEW ─────────────────────────── */}
      <GalleryPreview images={gallery} onOpen={() => navigate('/gallery')} />

      {/* ─── BOTTOM NAV ──────────────────────────────── */}
      <div
        className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl flex items-center justify-around py-2.5"
        style={{
          background: 'rgba(7,11,20,0.94)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,240,255,0.09)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6),0 0 24px rgba(0,240,255,0.05)',
        }}
      >
        {NAV_TABS.map((tab) => {
          const active = tab.path === '/';
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center justify-center gap-0.5 px-2.5 py-1.5 rounded-xl transition-all active:scale-90"
              style={{
                background: active ? 'rgba(0,240,255,0.1)' : 'transparent',
                border:     active ? '1px solid rgba(0,240,255,0.2)' : '1px solid transparent',
              }}
            >
              <span className="text-[15px] leading-none">{tab.emoji}</span>
              <span className="text-[8px] font-black uppercase tracking-wide"
                style={{ color: active ? '#00F0FF' : 'rgba(148,163,184,0.55)' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
        }
