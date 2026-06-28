import { useState, useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Heart, ChevronRight, Instagram,
  Users, Trophy, Image, BarChart2, Settings,
  Share2, Menu, Star, Target, Zap, Shield,
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

// ── ACHIEVEMENTS ────────────────────────────────────────────
const DEFAULT_ACHIEVEMENTS = [
  { label: 'WELL-LIKED',      icon: '💜', color: '#EC4899', points: 1000 },
  { label: 'BATTLE-HARDENED', icon: '⭐', color: '#FFD700', points: 500  },
  { label: 'WEAPON MASTER',   icon: '❌', color: '#EF4444', points: 200  },
  { label: 'HEADSHOT MASTER', icon: '💀', color: '#3B82F6', points: 300  },
  { label: 'CHICKEN EXPERT',  icon: '🏛️', color: '#10B981', points: 100  },
  { label: 'SYNC LEGEND',     icon: '🎯', color: '#A855F7', points: 50   },
];

// ── UTILS ───────────────────────────────────────────────────
function calcAnniversary(since: string) {
  if (!since) return null;
  const diff = Date.now() - new Date(since).getTime();
  if (diff < 0) return null;
  const totalDays = Math.floor(diff / 86400000);
  return {
    years:     Math.floor(totalDays / 365),
    months:    Math.floor((totalDays % 365) / 30),
    days:      totalDays % 30,
    hours:     Math.floor((diff % 86400000) / 3600000),
    totalDays,
  };
}

function formatTimer(c: NonNullable<ReturnType<typeof calcAnniversary>>) {
  const parts = [];
  if (c.years  > 0) parts.push(`${c.years}Y`);
  if (c.months > 0) parts.push(`${c.months}M`);
  if (c.days   > 0) parts.push(`${c.days}D`);
  return parts.join(' ') || '< 1D';
}

// ── PARTNER SECTION ─────────────────────────────────────────
const PartnerSection = memo(function PartnerSection({ partner }: { partner: PartnerData }) {
  const [counter, setCounter] = useState(() => calcAnniversary(partner?.playingTogetherSince));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!partner?.playingTogetherSince) return;
    timerRef.current = setInterval(
      () => setCounter(calcAnniversary(partner.playingTogetherSince)), 60000
    );
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [partner?.playingTogetherSince]);

  if (!partner) return null;

  const kd = partner?.kd ?? 0;

  return (
    <div className="mx-3 mt-3 rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: 'rgba(10,12,24,0.97)',
        border: '1px solid rgba(244,63,94,0.35)',
        boxShadow: '0 0 30px rgba(244,63,94,0.08)',
      }}>
      {/* header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 fill-[#F43F5E] text-[#F43F5E]" />
          <span className="text-sm font-black tracking-widest uppercase"
            style={{ color: '#F43F5E', textShadow: '0 0 10px rgba(244,63,94,0.5)' }}>
            Gaming Partner
          </span>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-black"
          style={{ background: 'rgba(255,215,0,0.15)', border: '1px solid rgba(255,215,0,0.35)', color: '#FFD700' }}>
          👑 Elite Partner
        </span>
      </div>

      {/* body */}
      <div className="flex items-center gap-3">
        {/* avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden"
            style={{
              border: '2.5px solid #F43F5E',
              boxShadow: '0 0 20px rgba(244,63,94,0.6), 0 0 40px rgba(244,63,94,0.2)',
            }}>
            {partner.photo
              ? <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center font-black text-2xl text-white"
                  style={{ background: 'linear-gradient(135deg,#1a0010,#0d0008)' }}>
                  {partner.name?.[0] ?? '?'}
                </div>
            }
          </div>
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0c18]"
            style={{ background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.9)' }} />
        </div>

        {/* name + uid */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-black text-white">{partner.name || '—'}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">UID: {partner.uid || '—'}</p>
          <span className="mt-1.5 inline-block text-[9px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: '#F43F5E' }}>
            Lover
          </span>
        </div>

        {/* 3 stat boxes */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          {/* KD */}
          <div className="px-3 py-1.5 rounded-xl text-center"
            style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)' }}>
            <p className="text-sm font-black" style={{ color: '#F43F5E' }}>
              <Heart className="w-3 h-3 inline mr-0.5 fill-[#F43F5E]" />{formatKd(kd)}+
            </p>
            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">KD</p>
          </div>
          {/* Synergy */}
          <div className="px-3 py-1.5 rounded-xl text-center"
            style={{ background: 'rgba(0,240,255,0.07)', border: '1px solid rgba(0,240,255,0.2)' }}>
            <p className="text-sm font-black text-[#00F0FF]">🔗 {partner.synergy ?? 0}+</p>
            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Synergy</p>
          </div>
          {/* Playing Together */}
          <div className="px-3 py-1.5 rounded-xl text-center"
            style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}>
            <p className="text-[11px] font-black text-[#A855F7]">
              {counter ? formatTimer(counter) : '—'}
            </p>
            <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider">Together</p>
          </div>
        </div>
      </div>
    </div>
  );
});

// ── HEXAGON BADGE ───────────────────────────────────────────
function HexBadge({ ach }: { ach: typeof DEFAULT_ACHIEVEMENTS[0] }) {
  return (
    <div className="flex flex-col items-center flex-shrink-0 w-[72px]">
      <div
        className="w-14 h-14 flex items-center justify-center relative"
        style={{
          clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          background: `linear-gradient(135deg, rgba(10,12,24,1), ${ach.color}33)`,
          boxShadow: `0 0 14px ${ach.color}40`,
          border: `2px solid ${ach.color}60`,
        }}
      >
        <span className="text-xl">{ach.icon}</span>
      </div>
      <p className="text-[7px] text-slate-300 font-black text-center mt-1.5 leading-tight uppercase">{ach.label}</p>
      <p className="text-[9px] font-black mt-0.5" style={{ color: ach.color }}>{ach.points}</p>
    </div>
  );
}

// ── STAT ROW CARD ────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl p-3 flex items-center gap-2.5"
      style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-sm font-black" style={{ color }}>{value}</p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ────────────────────────────────────────────────
export default function HomePage() {
  const [profile,  setProfile]  = useState<any>(null);
  const [social,   setSocial]   = useState<any>(null);
  const [friends,  setFriends]  = useState<any[]>([]);
  const [gallery,  setGallery]  = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const [p, s, f, g, st] = await Promise.all([
          getProfile(), getSocialLinks(), getFriends(), getGallery(), getSettings(),
        ]);
        setProfile(p); setSocial(s); setFriends(f); setGallery(g); setSiteSettings(st);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3" style={{ background: '#070B14' }}>
      <div className="w-10 h-10 rounded-full animate-spin"
        style={{ border: '3px solid rgba(0,240,255,0.1)', borderTopColor: '#00F0FF' }} />
      <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: 'rgba(0,240,255,0.5)' }}>
        Loading Vault...
      </p>
    </div>
  );

  const kd      = profile?.kd ?? 5.24;
  const kdColor = getKdColor(kd);
  const badges: string[] = profile?.badges ?? [];
  const achievements = profile?.achievements ?? DEFAULT_ACHIEVEMENTS;

  const stats = {
    totalFriends:   friends.length || 1,
    totalSynergy:   friends.reduce((s: number, f: any) => s + (f.synergy || 0), 0) || 4499,
    highestSynergy: friends.length ? Math.max(...friends.map((f: any) => f.synergy || 0)) : 4499,
    avgSynergy:     friends.length
      ? Math.round(friends.reduce((s: number, f: any) => s + (f.synergy || 0), 0) / friends.length)
      : 4499,
    totalMemories:  friends.reduce((s: number, f: any) => s + (f.memories?.length || 0), 0),
    collectionAvg:  friends.length
      ? Math.round(friends.reduce((s: number, f: any) => s + (f.collectionLevel || 0), 0) / friends.length)
      : 6469,
  };

  return (
    <div className="min-h-screen text-white font-sans overflow-x-hidden pb-24"
      style={{ background: '#070B14' }}>

      {/* ── TOP BAR ── */}
      <div className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{
          background: 'rgba(7,11,20,0.96)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Menu className="w-4 h-4 text-slate-400" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🛡️</span>
          <span className="text-sm font-black tracking-[0.15em]" style={{ color: '#00F0FF' }}>BGMI VAULT</span>
        </div>
        <button className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Share2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* ── HERO SECTION ── */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        {/* background */}
        <div className="absolute inset-0"
          style={{
            backgroundImage: profile?.heroBackground
              ? `url(${profile.heroBackground})`
              : 'linear-gradient(135deg,#0a1628 0%,#0d1a35 50%,#070B14 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
        {/* dark overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg,rgba(7,11,20,0.5) 0%,rgba(7,11,20,0.75) 70%,#070B14 100%)' }} />

        <div className="relative z-10 px-3 pt-4 pb-6 flex items-start gap-3">

          {/* ── AVATAR CARD (gaming card style) ── */}
          <div className="relative flex-shrink-0">
            {/* golden outer glow frame */}
            <div className="relative w-[110px]"
              style={{
                filter: 'drop-shadow(0 0 16px rgba(255,180,0,0.5))',
              }}>
              {/* golden border frame */}
              <div className="rounded-xl overflow-hidden"
                style={{
                  border: '2px solid #C8820A',
                  boxShadow: '0 0 0 1px rgba(255,215,0,0.3), inset 0 0 20px rgba(255,140,0,0.1)',
                  background: 'linear-gradient(135deg,#1a1200,#0d0800)',
                }}>
                {/* ONLINE badge */}
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 rounded-md"
                  style={{ background: 'rgba(34,197,94,0.85)', backdropFilter: 'blur(4px)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="text-[8px] font-black text-white uppercase tracking-wider">Online</span>
                </div>

                {/* avatar image */}
                <div className="w-full h-[120px] overflow-hidden">
                  <img
                    src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300'}
                    alt="Avatar"
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* IGN + level bar */}
                <div className="px-2 py-1.5 text-center"
                  style={{ background: 'linear-gradient(180deg,rgba(10,8,0,0.9),rgba(20,15,0,0.95))' }}>
                  <p className="text-[10px] font-black text-[#FFD700] tracking-wider truncate">
                    {profile?.ign || 'D3xSHUBHAM'}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,215,0,0.15)' }}>
                      <div className="h-full rounded-full" style={{ width: '80%', background: 'linear-gradient(90deg,#FFD700,#FF8C00)' }} />
                    </div>
                    <span className="text-[9px] font-black text-[#FF8C00]">{profile?.level || 80}</span>
                  </div>
                </div>
              </div>

              {/* corner decorations */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#FFD700] rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#FFD700] rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#FFD700] rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#FFD700] rounded-br-lg" />
            </div>
          </div>

          {/* ── NAME + BADGES ── */}
          <div className="flex-1 min-w-0 pt-2">
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-black text-white leading-none tracking-wide">
                {profile?.ign || 'D3xSHUBHAM'}
              </h1>
              {badges.includes('verified') && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: '#2563EB', boxShadow: '0 0 8px rgba(37,99,235,0.8)' }}>
                  <span className="text-[9px] text-white font-black">✔</span>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5 font-medium">{profile?.realName || 'SHUBHAM KUMAR NAGVANSHI'}</p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-lg"
                style={{ background: 'rgba(0,240,255,0.12)', border: '1px solid rgba(0,240,255,0.3)', color: '#00F0FF' }}>
                ID: {profile?.bgmiId || '5305051851'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile?.country || 'INDIA'}
              </span>
            </div>

            {/* badge pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {badges.includes('verified') && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                  style={{ color: '#3B82F6', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.35)' }}>
                  ✔ Verified Player
                </span>
              )}
              {badges.includes('elite') && (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                  style={{ color: '#FFD700', background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.35)' }}>
                  👑 Elite Player
                </span>
              )}
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                style={{ color: '#00F0FF', background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.3)' }}>
                🎯 Conqueror
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                style={{ color: '#A855F7', background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.3)' }}>
                💎 Mythic Fashion
              </span>
            </div>
          </div>

          {/* ── TIER (right) ── */}
          <div className="flex-shrink-0 flex flex-col items-center pt-2">
            <div className="text-4xl">🪖</div>
            <p className="text-[9px] font-black text-center mt-1 uppercase leading-tight"
              style={{ color: '#FFD700', textShadow: '0 0 10px rgba(255,215,0,0.7)' }}>
              {(profile?.tier || 'ACE DOMINATOR').replace(' ', '\n')}
            </p>
            <div className="flex items-center gap-1 mt-1.5">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[11px] font-black text-yellow-400">{profile?.tierStars || 22}</span>
            </div>
          </div>
        </div>
      </div>

{/* ── 4-STAT BAR ── */}
      <div className="mx-3 mt-0 rounded-2xl"
        style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="grid grid-cols-4 divide-x divide-white/5">
          {[
            { icon: '🎯', label: 'K/D RATIO',   value: formatKd(kd),                      color: '#00F0FF' },
            { icon: '🏆', label: 'WIN RATE',     value: `${profile?.winRate || '63.2'}%`,  color: '#FFD700' },
            { icon: '🎪', label: 'HEADSHOT %',   value: `${profile?.headshot || '19.8'}%`, color: '#F43F5E' },
            { icon: '💥', label: 'AVG DAMAGE',   value: profile?.avgDamage || '842.6',     color: '#A855F7' },
          ].map((s) => (
            <div key={s.label} className="py-3 px-2 text-center">
              <p className="text-base">{s.icon}</p>
              <p className="text-[7px] text-slate-500 uppercase tracking-wider font-bold mt-0.5">{s.label}</p>
              <p className="text-sm font-black mt-0.5" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── PARTNER ── */}
      <PartnerSection partner={profile?.partner} />

      {/* ── 3-COL STATS ── */}
      <div className="px-3 mt-3 grid grid-cols-3 gap-2">
        <StatCard icon="👥" label="FRIENDS"       value={`${stats.totalFriends}+`}   color="#00F0FF" />
        <StatCard icon="❤️"  label="TOTAL SYNERGY" value={`${stats.totalSynergy}+`}   color="#F43F5E" />
        <StatCard icon="🏅" label="AVG SYNERGY"   value={`${stats.avgSynergy}+`}     color="#FFD700" />
      </div>
      <div className="px-3 mt-2 grid grid-cols-4 gap-2">
        <StatCard icon="💠" label="COLL. LVL"     value={`${profile?.collectionLevel || 71}+`} color="#A855F7" />
        <StatCard icon="🔥" label="POPULARITY"    value={`${profile?.popularity || '226874'}+`} color="#FF6B6B" />
        <StatCard icon="🖼️"  label="MEMORIES"      value={`${stats.totalMemories}+`}  color="#4ECDC4" />
        <StatCard icon="🏆" label="HIGHEST SYN"   value={`${stats.highestSynergy}+`} color="#00E5FF" />
      </div>

      {/* ── PROFILE DETAILS ── */}
      <div className="mx-3 mt-3 rounded-2xl p-4"
        style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(168,85,247,0.25)' }}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-base">⚔️</span>
          <p className="text-xs font-black text-white uppercase tracking-widest">Profile Details</p>
        </div>
        <div className="grid grid-cols-4 gap-y-3">
          {[
            { label: 'COLLECTION LEVEL',   value: `${profile?.collectionLevel || 71}+`,    color: '#fff' },
            { label: 'ACCOUNT LEVEL',      value: `${profile?.accountLevel || 91}+`,       color: '#fff' },
            { label: 'CURRENT TIER',       value: profile?.tier || 'Ace Dominator',        color: '#FFD700' },
            { label: 'STATE',              value: profile?.state || 'BIHAR',               color: '#fff' },
            { label: 'POPULARITY',         value: `${profile?.popularity || '2267874'}+`,  color: '#fff' },
            { label: 'LIKES',              value: `${profile?.likes || '26868'}+`,         color: '#fff' },
            { label: 'HIGHEST TIER',       value: profile?.highestTier || 'Ace Dominator', color: '#FFD700' },
            { label: 'COUNTRY',            value: profile?.country || 'INDIA',             color: '#fff' },
            { label: 'MATCHES',            value: `${profile?.matches || 0}+`,             color: '#fff' },
            { label: 'ACHIEVEMENT POINTS', value: `${profile?.achievementPoints || 0}+`,   color: '#fff' },
            { label: 'PLAYING SINCE',      value: profile?.playingSince || '8 YEARS',      color: '#fff' },
            { label: '',                   value: '',                                       color: '#fff' },
          ].map((item, i) => (
            <div key={i} className="min-w-0">
              {item.label && <>
                <p className="text-[7px] text-slate-500 uppercase tracking-wider font-bold leading-tight">{item.label}</p>
                <p className="text-[11px] font-black mt-0.5 truncate" style={{ color: item.color }}>{item.value}</p>
              </>}
            </div>
          ))}
        </div>
      </div>

      {/* ── ACHIEVEMENTS ── */}
      <div className="mx-3 mt-3 rounded-2xl p-4"
        style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-white uppercase tracking-widest">Achievements</p>
          <button className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: '#00F0FF' }}>
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {(achievements.length > 0 ? achievements : DEFAULT_ACHIEVEMENTS).map((ach: any, i: number) => (
            <HexBadge key={ach.label ?? i} ach={ach} />
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS + FEATURED FRIENDS (side by side) ── */}
      <div className="px-3 mt-3 grid grid-cols-2 gap-3">

        {/* Quick Actions */}
        <div className="rounded-2xl p-3"
          style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black text-white uppercase tracking-widest mb-2.5">Quick Actions</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'All Friends', icon: Users,    path: '/friends',     color: '#00F0FF' },
              { label: 'Top 10',      icon: Trophy,   path: '/leaderboard', color: '#FFD700' },
              { label: 'Gallery',     icon: Image,    path: '/gallery',     color: '#FF6B6B' },
              { label: 'Statistics',  icon: BarChart2,path: '/statistics',  color: '#A855F7' },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl active:scale-95 transition-transform"
                style={{ background: `${action.color}0C`, border: `1px solid ${action.color}20` }}
              >
                <action.icon className="w-4 h-4 flex-shrink-0" style={{ color: action.color }} />
                <span className="text-[11px] font-black text-slate-200 flex-1 text-left">{action.label}</span>
                <ChevronRight className="w-3 h-3 flex-shrink-0" style={{ color: action.color }} />
              </button>
            ))}
          </div>
        </div>

        {/* Featured Friends */}
        <div className="rounded-2xl p-3"
          style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Featured Friends</p>
            <button onClick={() => navigate('/friends')} className="text-[9px] font-bold" style={{ color: '#00F0FF' }}>
              View All
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {/* friend list */}
            {friends.slice(0, 2).map((friend: any, idx: number) => {
              const fkd = friend?.kd ?? 0;
              const fColor = getKdColor(fkd);
              return (
                <div key={friend.id ?? idx} className="flex items-center gap-2">
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden"
                      style={{ border: `2px solid ${fColor}60`, boxShadow: `0 0 10px ${fColor}30` }}>
                      <img
                        src={friend.photo || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200'}
                        alt={friend.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-[#0a0c18]"
                      style={{ background: friend.online ? '#22c55e' : '#475569' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-200 truncate">{friend.name || '—'}</p>
                    <p className="text-[9px] font-bold" style={{ color: fColor }}>{formatKd(fkd)}+ KD</p>
                  </div>
                </div>
              );
            })}

            {/* View All circle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/friends')}
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                style={{ border: '2px dashed rgba(0,240,255,0.3)', background: 'rgba(0,240,255,0.05)' }}
              >
                <span className="text-lg text-[#00F0FF]">+</span>
              </button>
              <button onClick={() => navigate('/friends')}
                className="text-[10px] font-black" style={{ color: '#00F0FF' }}>
                View All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── GALLERY PREVIEW ── */}
      {gallery.length > 0 && (
        <div className="mx-3 mt-3 rounded-2xl p-3"
          style={{ background: 'rgba(10,12,24,0.97)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-white uppercase tracking-widest">Gallery Preview</p>
            <button onClick={() => navigate('/gallery')}
              className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: '#00F0FF' }}>
              Open Gallery <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {gallery.slice(0, 6).map((img: any, i: number) => (
              <div
                key={img.id ?? i}
                onClick={() => navigate('/gallery')}
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
      )}

      <div className="h-4" />

      {/* ── BOTTOM NAV ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(7,11,20,0.97)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
        <div className="flex items-center justify-around py-2 px-1">
          {NAV_TABS.map((tab) => {
            const active = tab.path === '/';
            return (
              <button
                key={tab.label}
                onClick={() => navigate(tab.path)}
                className="flex flex-col items-center justify-center gap-0.5 py-1.5 px-3 rounded-xl transition-all active:scale-90"
                style={{ background: active ? 'rgba(0,240,255,0.08)' : 'transparent' }}
              >
                <span className="text-lg leading-none">{tab.emoji}</span>
                <span className="text-[9px] font-black uppercase tracking-wide"
                  style={{ color: active ? '#00F0FF' : 'rgba(100,116,139,0.7)' }}>
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
