import { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Heart, Award, Target, ChevronRight, Instagram,
  Swords, Star, Users, Trophy, Image, BarChart2, LogOut,
  Shield, Zap, Crown, Flame, Eye, Settings
} from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery, getSettings } from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, GalleryImage, SiteSettings, PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

// ==================== CONSTANTS ====================
const quickActions = [
  { label: 'All Friends', icon: Users, path: '/friends', color: '#00F0FF', bg: 'rgba(0,240,255,0.08)', border: 'rgba(0,240,255,0.2)' },
  { label: 'Top 10', icon: Trophy, path: '/leaderboard', color: '#FFD700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)' },
  { label: 'Gallery', icon: Image, path: '/gallery', color: '#FF6B6B', bg: 'rgba(255,107,107,0.08)', border: 'rgba(255,107,107,0.2)' },
  { label: 'Statistics', icon: BarChart2, path: '/statistics', color: '#A855F7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.2)' },
];

const BADGE_MAP: Record<string, { label: string; icon: string; color: string; glow: string }> = {
  verified: { label: 'Verified', icon: '✔', color: '#3B82F6', glow: 'rgba(59,130,246,0.3)' },
  elite: { label: 'Elite', icon: '👑', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  partner: { label: 'Partner', icon: '❤️', color: '#F43F5E', glow: 'rgba(244,63,94,0.3)' },
  popular: { label: 'Popular', icon: '⭐', color: '#A855F7', glow: 'rgba(168,85,247,0.3)' },
};

function calcAnniversary(since: string) {
  if (!since) return null;
  const start = new Date(since);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  if (diff < 0) return null;
  const totalDays = Math.floor(diff / 86400000);
  const years = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days = totalDays % 30;
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  return { years, months, days, hours, mins, totalDays };
}

// ==================== PARTNER SECTION ====================
const PartnerSection = memo(function PartnerSection({ partner }: { partner: PartnerData }) {
  const [counter, setCounter] = useState(() => calcAnniversary(partner?.playingTogetherSince));
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!partner?.playingTogetherSince) return;
    intervalRef.current = setInterval(() => {
      setCounter(calcAnniversary(partner.playingTogetherSince));
    }, 60000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [partner?.playingTogetherSince]);

  const kd = partner?.kd ?? 0;
  const kdColor = getKdColor(kd);

  if (!partner) return null;

  return (
    <motion.div
      className="px-4 mt-4"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <div
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.07) 0%, rgba(168,85,247,0.05) 50%, rgba(7,11,20,0.98) 100%)',
          border: '1px solid rgba(244,63,94,0.28)',
          boxShadow: '0 0 24px rgba(244,63,94,0.08), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-10 -right-10 w-36 h-36 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15), transparent 70%)', filter: 'blur(20px)' }}
        />

        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-[#F43F5E] text-[#F43F5E]" />
            <span className="text-[10px] font-black text-[#F43F5E] tracking-widest uppercase">Gaming Partner</span>
          </div>
          <span
            className="text-[9px] px-2 py-0.5 rounded-full font-black"
            style={{ background: 'rgba(255,215,0,0.12)', border: '1px solid rgba(255,215,0,0.25)', color: '#FFD700' }}
          >
            👑 Elite Partner
          </span>
        </div>

        {/* Partner info */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="w-14 h-14 rounded-xl overflow-hidden"
              style={{ border: '1.5px solid rgba(244,63,94,0.4)', boxShadow: '0 0 12px rgba(244,63,94,0.2)' }}
            >
              {partner?.photo ? (
                <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#1a0a10] flex items-center justify-center text-white font-black text-lg">
                  {partner?.name?.[0] || '?'}
                </div>
              )}
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#070B14]"
              style={{ background: '#22c55e', boxShadow: '0 0 6px rgba(34,197,94,0.6)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-black text-white tracking-wide truncate">{partner?.name || '—'}</h4>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">UID: {partner?.uid || '---'}</p>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              <span
                className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#F43F5E' }}
              >
                ❤️ Lover
              </span>
              <span
                className="text-[8px] px-1.5 py-0.5 rounded-full font-black"
                style={{ background: `${kdColor}14`, border: `1px solid ${kdColor}30`, color: kdColor }}
              >
                {getKdDot(kd)} {formatKd(kd)} KD
              </span>
              <span
                className="text-[8px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', color: '#A855F7' }}
              >
                ⚡ {partner?.synergy || '0'}+ SYN
              </span>
            </div>
          </div>
        </div>

        {/* Timer */}
        {counter && partner?.playingTogetherSince && (
          <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-[9px] text-center text-slate-500 mb-2 uppercase tracking-wider">
              Playing Together Since {partner.playingTogetherSince}
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: 'YRS', value: counter.years },
                { label: 'MON', value: counter.months },
                { label: 'DAYS', value: counter.days },
                { label: 'HRS', value: counter.hours },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="py-1.5 rounded-xl text-center"
                  style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.12)' }}
                >
                  <p className="text-sm font-black text-[#F43F5E]">{value}</p>
                  <p className="text-[7px] text-slate-500 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-center text-[#F43F5E]/70 mt-2 font-bold">
              {counter.totalDays}+ days together ❤️
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
});

// ==================== SECTION HEADER ====================
function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #00F0FF, #A855F7)' }} />
        <p className="text-[10px] font-black text-white uppercase tracking-[0.15em]">{title}</p>
      </div>
      {action && (
        <button onClick={onAction} className="text-[10px] font-bold text-[#00F0FF]/70 hover:text-[#00F0FF] transition-colors">
          {action}
        </button>
      )}
    </div>
  );
}

// ==================== STAT PILL ====================
function StatPill({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      className="flex-1 py-2 px-2 rounded-xl text-center"
      style={{ background: `${color}0A`, border: `1px solid ${color}20` }}
    >
      <p className="text-[8px] text-slate-500 uppercase tracking-wider font-bold">{label}</p>
      <p className="text-sm font-black mt-0.5" style={{ color }}>{value}</p>
    </div>
  );
}

// ==================== FRIEND CARD ====================
const FriendCard = memo(function FriendCard({ friend }: { friend: any }) {
  const kd = friend?.kd ?? 0;
  const kdColor = getKdColor(kd);
  return (
    <div
      className="flex-shrink-0 w-[88px] rounded-2xl p-2.5 text-center relative overflow-hidden"
      style={{
        background: 'rgba(13,18,31,0.8)',
        border: '1px solid rgba(255,255,255,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl overflow-hidden mx-auto relative"
        style={{ border: `1.5px solid ${kdColor}40`, boxShadow: `0 0 10px ${kdColor}20` }}
      >
        <img
          src={friend.photo || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200'}
          alt={friend.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div
          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-[#070B14]"
          style={{ background: friend.online ? '#22c55e' : '#6b7280' }}
        />
      </div>
      <p className="text-[9px] font-black text-slate-200 mt-1.5 truncate">{friend.name || '—'}</p>
      <p className="text-[8px] font-bold mt-0.5" style={{ color: kdColor }}>{formatKd(kd)} KD</p>
    </div>
  );
});

// ==================== GALLERY PREVIEW ====================
const GalleryPreview = memo(function GalleryPreview({ images, onOpen }: { images: any[]; onOpen: () => void }) {
  const preview = images.slice(0, 6);
  if (preview.length === 0) return null;
  return (
    <div className="px-4 mt-5">
      <SectionHeader title="Gallery Preview" action="Open Gallery" onAction={onOpen} />
      <div className="grid grid-cols-3 gap-1.5">
        {preview.map((img: any, i: number) => (
          <motion.div
            key={img.id || i}
            className="aspect-square rounded-xl overflow-hidden relative cursor-pointer group"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={onOpen}
          >
            <img src={img.url || img.src} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// ==================== BOTTOM NAV ====================
const navTabs = [
  { label: 'Home', emoji: '🏠', path: '/' },
  { label: 'Friends', emoji: '👥', path: '/friends' },
  { label: 'Ranks', emoji: '🏆', path: '/leaderboard' },
  { label: 'Gallery', emoji: '🖼️', path: '/gallery' },
  { label: 'Admin', emoji: '⚙️', path: '/admin' },
];

// ==================== MAIN HOMEPAGE ====================
export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [social, setSocial] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const [p, s, f, g, st] = await Promise.all([
          getProfile(), getSocialLinks(), getFriends(), getGallery(), getSettings(),
        ]);
        setProfile(p);
        setSocial(s);
        setFriends(f);
        setGallery(g);
        setSettings(st);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center gap-4">
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{ border: '3px solid rgba(0,240,255,0.15)', borderTopColor: '#00F0FF' }}
        />
        <p className="text-[10px] text-[#00F0FF]/60 font-black uppercase tracking-widest">Loading Vault...</p>
      </div>
    );
  }

  const kd = profile?.kd ?? 5.24;
  const kdColor = getKdColor(kd);
  const badges: string[] = profile?.badges ?? [];

  const stats = {
    totalFriends: friends.length || 1,
    totalSynergy: friends.reduce((s: number, f: any) => s + (f.synergy || 0), 0) || 4499,
    highestSynergy: friends.length > 0 ? Math.max(...friends.map((f: any) => f.synergy || 0)) : 4499,
    avgSynergy: friends.length > 0 ? Math.round(friends.reduce((s: number, f: any) => s + (f.synergy || 0), 0) / friends.length) : 4499,
    totalMemories: friends.reduce((s: number, f: any) => s + (f.memories?.length || 0), 0) || 0,
    collectionAvg: friends.length > 0 ? Math.round(friends.reduce((s: number, f: any) => s + (f.collectionLevel || 0), 0) / friends.length) : 6469,
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans overflow-x-hidden pb-28">

      {/* ── TOP BAR ── */}
      <div
        className="w-full px-4 py-3 flex items-center justify-between sticky top-0 z-50"
        style={{
          background: 'rgba(7,11,20,0.88)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(0,240,255,0.08)',
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid rgba(0,240,255,0.2)' }}
          >
            🛡️
          </div>
          <span className="text-xs font-black tracking-[0.2em] text-[#00F0FF]">BGMI VAULT</span>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 transition-colors"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* ── HERO BANNER ── */}
      <div className="relative w-full h-52 overflow-hidden">
        {/* Banner background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: profile?.heroBackground
              ? `url(${profile.heroBackground})`
              : 'linear-gradient(135deg, #0D1A2B 0%, #0A0F1E 50%, #070B14 100%)',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(7,11,20,0.3) 0%, rgba(7,11,20,0.6) 60%, #070b14 100%)' }} />

        {/* Animated grid lines for premium feel */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Cyan pulse orb */}
        <div
          className="absolute top-4 right-4 w-24 h-24 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,240,255,0.15), transparent 70%)', filter: 'blur(16px)' }}
        />

        {/* Online status tag */}
        <motion.div
          className="absolute top-4 left-4 flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', backdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[9px] font-black text-green-400 uppercase tracking-wider">Online</span>
        </motion.div>

        {/* Tier badge */}
        {profile?.tier && (
          <motion.div
            className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-black"
            style={{ background: 'rgba(255,159,67,0.12)', border: '1px solid rgba(255,159,67,0.3)', color: '#FF9F43', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            ⚔️ {profile.tier}
          </motion.div>
        )}
      </div>

      {/* ── MAIN PROFILE CARD ── */}
      <div className="px-4 -mt-6 relative z-10">
        <motion.div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(0,240,255,0.06) 0%, rgba(13,18,31,0.95) 40%, rgba(168,85,247,0.04) 100%)',
            border: '1px solid rgba(0,240,255,0.18)',
            boxShadow: '0 0 40px rgba(0,240,255,0.08), 0 0 80px rgba(168,85,247,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Corner decoration */}
          <div
            className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
            style={{ background: 'radial-gradient(circle at top right, rgba(0,240,255,0.08), transparent 70%)' }}
          />

          {/* Avatar + name row */}
          <div className="flex items-start gap-4">
            {/* Avatar with animated border */}
            <div className="relative flex-shrink-0">
              <motion.div
                className="absolute -inset-1 rounded-2xl"
                style={{ background: `conic-gradient(from 0deg, #00F0FF, #A855F7, #FFD700, #00F0FF)`, padding: '1.5px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden relative z-10"
                style={{ border: '2px solid #070B14' }}
              >
                <img
                  src={profile?.profilePhoto || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300'}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Online dot */}
  
