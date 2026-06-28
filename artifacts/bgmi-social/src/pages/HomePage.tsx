import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Award, Target, ChevronRight, Instagram, Youtube, Facebook, MessageCircle, Swords, Star, Wifi, WifiOff, Users, Trophy, Image, BarChart2, LogOut, Menu } from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery, getSettings } from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, GalleryImage, SiteSettings, PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

// Quick Actions Icons setup matching layout
const quickActions = [
  { label: 'All Friends', icon: Users, path: '/friends', color: '#00F0FF' },
  { label: 'Top 10', icon: Trophy, path: '/leaderboard', color: '#FFD700' },
  { label: 'Gallery', icon: Image, path: '/gallery', color: '#FF6B6B' },
  { label: 'Statistics', icon: BarChart2, path: '/statistics', color: '#4ECDC4' },
];

const BADGE_MAP: Record<string, { label: string; icon: string; color: string; glow: string }> = {
  verified: { label: 'Verified Player', icon: '✔', color: '#3B82F6', glow: 'rgba(59,130,246,0.3)' },
  elite: { label: 'Elite Player', icon: '👑', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  partner: { label: 'Partner', icon: '❤️', color: '#F43F5E', glow: 'rgba(244,63,94,0.3)' },
  popular: { label: 'Popular Player', icon: '⭐', color: '#A855F7', glow: 'rgba(168,85,247,0.3)' },
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
function PartnerSection({ partner }: { partner: PartnerData }) {
  const [counter, setCounter] = useState(() => calcAnniversary(partner?.playingTogetherSince));
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!partner?.playingTogetherSince) return;
    intervalRef.current = setInterval(() => {
      setCounter(calcAnniversary(partner.playingTogetherSince));
    }, 60000);
    return () => clearInterval(intervalRef.current);
  }, [partner?.playingTogetherSince]);

  const kd = partner?.kd ?? 0;
  const kdColor = getKdColor(kd);

  return (
    <motion.div 
      className="px-5 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div 
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(168,85,247,0.08), rgba(7,11,20,0.95))',
          border: '1px solid rgba(244,63,94,0.35)',
          boxShadow: '0 0 30px rgba(244,63,94,0.12), 0 0 60px rgba(168,85,247,0.06)',
        }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none" style={{ background: 'radial-gradient(circle, #F43F5E, transparent)' }} />
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#F43F5E]">
            <Heart className="w-4 h-4 fill-[#F43F5E]" /> Partner
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold border bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30 text-[#FFD700]">
            👑 Elite Partner
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 relative border-[#F43F5E]/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            {partner?.photo ? (
              <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold">{partner?.name?.[0] || '?'}</div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#070B14]" />
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">{partner?.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {partner?.uid || '---'}</p>
            <div className="flex gap-1.5 mt-1.5 flex-wrap">
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 font-medium">Lover</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1" style={{ background: `${kdColor}15`, border: `1px solid ${kdColor}30`, color: kdColor }}>
                {getKdDot(kd)} {formatKd(kd)} KD
              </span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
                ❤️ {partner?.synergy || '0'}+ SYN
              </span>
            </div>
          </div>
        </div>

        {counter && partner?.playingTogetherSince && (
          <div className="mt-4 pt-3 border-t border-white/5">
            <p className="text-[10px] text-center text-slate-400 mb-2">Playing Together Since {partner.playingTogetherSince}</p>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'Years', value: counter.years },
                { label: 'Months', value: counter.months },
                { label: 'Days', value: counter.days },
                { label: 'Hours', value: counter.hours },
              ].map(({ label, value }) => (
                <div key={label} className="p-1 rounded-xl border border-rose-500/10 bg-rose-500/[0.04]">
                  <p className="text-xs font-bold text-rose-400">{value}</p>
                  <p className="text-[8px] text-slate-500 uppercase">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-center text-rose-400/80 mt-2 font-medium">{counter.totalDays}+ days together ❤️</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ==================== MAIN HOMEPAGE ====================
export default function HomePage() {
  const [profile, setProfile] = useState<any>(null);
  const [social, setSocial] = useState<any>(null);
  const [friends, setFriends] = useState<any[]>([]);
  const [, setGallery] = useState<any[]>([]);
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
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kd = profile?.kd ?? 5.24;
  const kdColor = getKdColor(kd);
  const badges = profile?.badges ?? [];

  const stats = {
    totalFriends: friends.length || 1,
    totalSynergy: friends.reduce((s, f) => s + (f.synergy || 0), 0) || 4499,
    highestSynergy: friends.length > 0 ? Math.max(...friends.map(f => f.synergy || 0)) : 4499,
    avgSynergy: friends.length > 0 ? Math.round(friends.reduce((s, f) => s + (f.synergy || 0), 0) / friends.length) : 4499,
    totalMemories: friends.reduce((s, f) => s + (f.memories?.length || 0), 0) || 0,
    collectionAvg: friends.length > 0 ? Math.round(friends.reduce((s, f) => s + (f.collectionLevel || 0), 0) / friends.length) : 6469,
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white font-sans overflow-x-hidden pb-24">
      
      {/* Top Floating App Bar */}
      <div className="w-full px-4 py-3 flex items-center justify-between border-b border-white/5 bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-50">
        <button className="text-slate-400 p-1"><Menu className="w-5 h-5" /></button>
        <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-[#00F0FF]">
          🛡️ BGMI VAULT
        </div>
        <button className="text-slate-400 p-1"><LogOut className="w-4 h-4" /></button>
      </div>

      {/* Hero Profile Banner Header */}
      <div className="w-full relative h-48 md:h-56 flex items-end p-5 overflow-hidden border-b border-white/5">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: profile?.heroBackground
              ? `url(${profile.heroBackground})`
              : 'linear-gradient(135deg, #0D1321, #070B14)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/40 to-transparent" />
        
        <motion.div 
          className="flex items-end gap-4 relative z-10 w-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/40 relative shadow-[0_0_20px_rgba(0,240,255,0.2)]">
            <img src={profile?.profilePhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964"} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-[#070B14]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-black tracking-wide text-white">{profile?.ign || 'D3xSHUBHAM'}</h2>
            <p className="text-xs text-slate-400 font-medium">{profile?.realName || 'SHUBHAM KUMAR NAGVANSHI'}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[10px] bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 font-mono px-2 py-0.5 rounded-md">
                ID: {profile?.bgmiId || '5305091851'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                📍 {profile?.country || 'INDIA'}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Badges Dispatch Row */}
      {badges.length > 0 && (
        <div className="px-5 mt-3 flex flex-wrap gap-1.5">
          {badges.map((badge: string) => {
            const b = BADGE_MAP[badge];
            if (!b) return null;
            return (
              <span key={badge} className="text-[9px] px-2 py-0.5 rounded-full border font-bold" style={{ color: b.color, borderColor: `${b.color}30`, background: `${b.color}10` }}>
                {b.icon} {b.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Partner Wrapper Hook */}
      <PartnerSection partner={profile?.partner} />

      {/* Premium Vault Achievements */}
<motion.div
  className="px-5 mt-5"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
  <div className="rounded-2xl border border-cyan-500/20 bg-[#0d121f]/60 backdrop-blur-md p-4">

    <h2 className="text-cyan-400 text-sm font-bold tracking-[3px] uppercase mb-4">
      🏆 Vault Achievements
    </h2>

    <div className="grid grid-cols-2 gap-3">

      {[
        {
          title: "Conqueror",
          icon: "🏆",
          color: "#FFD700",
        },
        {
          title: "Mythic Fashion",
          icon: "👑",
          color: "#FF4FD8",
        },
        {
          title: "Dominator",
          icon: "🔥",
          color: "#FF6B00",
        },
        {
          title: "Elite Collector",
          icon: "💎",
          color: "#00F0FF",
        },
        {
          title: "OG Player",
          icon: "⭐",
          color: "#9B5CFF",
        },
        {
          title: "Event Champion",
          icon: "⚔️",
          color: "#00FF88",
        },
<div
  key={badge.title}
  className="rounded-xl p-3 border transition-all duration-300 hover:scale-105"
  style={{
    borderColor: `${badge.color}40`,
    background: `${badge.color}10`,
  }}
>
  <div
    className="text-xl mb-2"
    style={{ color: badge.color }}
  >
    {badge.icon}
  </div>

  <p
    className="text-xs font-bold"
    style={{ color: badge.color }}
  >
    {badge.title}
  </p>
</div>
      {/* Profile Details Block Card Layout */}
      <div className="px-5 mt-5">
        <div className="rounded-2xl p-4 bg-[#0d121f]/40 border border-white/5 space-y-4">
          <div className="text-xs font-black text-[#00F0FF] tracking-wider uppercase flex items-center gap-1.5 border-b border-white/5 pb-2">
            ⚔️ Profile Details
          </div>
          
          <div className="grid grid-cols-2 gap-y-3.5 gap-x-4">
            {[
              { label: 'Collection Level', value: `${profile?.collectionLevel || '71'}+`, color: '#B829DD' },
              { label: 'Account Level', value: `${profile?.accountLevel || '91'}+`, color: '#00F0FF' },
              { label: 'Popularity', value: `${profile?.popularity || '2267874'}+`, color: '#FFD700' },
              { label: 'Likes', value: `${profile?.likes || '26868'}+`, color: '#F43F5E' },
              { label: 'Matches', value: `${profile?.matches || '0'}+`, color: '#00E5FF' },
              { label: 'Achieve. Points', value: `${profile?.achievementPoints || '0'}+`, color: '#4ECDC4' },
              { label: 'Current Tier', value: profile?.tier || 'Ace Dominator', color: '#FF9F43' },
              { label: 'Highest Tier', value: profile?.highestTier || 'Ace Dominator', color: '#FF5252' },
              { label: 'Playing Since', value: profile?.playingSince || '8 YEARS', color: '#10B981' },
              { label: 'State', value: profile?.state || 'BIHAR', color: '#6366F1' },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider truncate">{item.label}</p>
                <p className="text-xs font-black mt-0.5 text-slate-200 truncate">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Connect Box */}
      <div className="px-5 mt-4">
        <div className="rounded-2xl p-4 bg-[#0d121f]/40 border border-white/5">
          <p className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider mb-2.5">Connect</p>
          <a 
            href={social?.instagram || "https://instagram.com/shubhamnagvanshi84823"} 
            target="_blank" 
            rel="noreferrer"
            className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-pink-600/10 to-rose-600/10 border border-pink-500/20 flex items-center justify-center gap-2 text-xs font-bold text-pink-400"
          >
            <Instagram className="w-4 h-4" /> Instagram
          </a>
        </div>
      </div>

      {/* Quick Actions Router Matrix */}
      <div className="px-5 mt-5">
        <p className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider mb-2.5">Quick Actions</p>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button 
              key={action.label}
              onClick={() => navigate(action.path)}
              className="p-3 rounded-xl bg-[#0d121f]/40 border border-white/5 text-left flex flex-col justify-between h-20 relative overflow-hidden group active:scale-95 transition-transform"
            >
              <action.icon className="w-5 h-5" style={{ color: action.color }} />
              <p className="text-xs font-bold text-slate-300 mt-2">{action.label}</p>
              <ChevronRight className="w-3.5 h-3.5 absolute right-3 bottom-3 text-slate-500 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>

      {/* Featured Friends Horizontal Module */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-2.5">
          <p className="text-[10px] font-bold text-[#00F0FF] uppercase tracking-wider">Featured Friends</p>
          <button onClick={() => navigate('/friends')} className="text-[10px] text-slate-400 font-bold">View All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {friends.slice(0, 4).map((friend: any, index) => (
            <div key={index} className="flex-shrink-0 w-24 p-2 rounded-xl bg-[#0d121f]/40 border border-white/5 text-center">
              <div className="w-12 h-12 rounded-lg overflow-hidden mx-auto border border-white/10">
                <img src={friend.photo || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974"} alt="friend" className="w-full h-full object-cover" />
              </div>
              <p className="text-[10px] font-bold text-slate-300 mt-1.5 truncate">{friend.name || 'Jitu'}</p>
              <p className="text-[8px] text-green-400 font-mono mt-0.5">{friend.kd || '0.00'}+ KD</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav App Bar Frame Matrix */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#070b14]/90 backdrop-blur-lg border-t border-white/5 flex items-center justify-around z-50 px-2">
        {[
          { label: 'Home', active: true, click: () => navigate('/') },
          { label: 'Friends', click: () => navigate('/friends') },
          { label: 'Leaderboard', click: () => navigate('/leaderboard') },
          { label: 'Gallery', click: () => navigate('/gallery') },
          { label: 'Admin', click: () => navigate('/admin') },
        ].map((tab) => (
          <button 
            key={tab.label}
            onClick={tab.click}
            className={`flex flex-col items-center justify-center p-1 text-[10px] font-bold ${tab.active ? 'text-[#00F0FF]' : 'text-slate-500'}`}
          >
            <span className="text-base mb-0.5">{tab.label === 'Home' ? '🏠' : tab.label === 'Friends' ? '👥' : tab.label === 'Leaderboard' ? '🏆' : tab.label === 'Gallery' ? '🖼️' : '⚙️'}</span>
            {tab.label}
          </button>
        ))}
      </div>

    </div>
  );
         }
          
