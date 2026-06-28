import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Award, Target, ChevronRight, Instagram, Youtube, Facebook, MessageCircle, Swords, Star, Wifi, WifiOff, Shield, Zap } from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery, getSettings } from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, GalleryImage, SiteSettings, PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

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

// ==================== PARTNER SECTION (REDESIGNED PREMIUM & CLEAN) ====================
function PartnerSection({ partner }: { partner: any }) {
  const [counter, setCounter] = useState(() => calcAnniversary(partner?.playingTogetherSince));
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (!partner?.playingTogetherSince) return;
    intervalRef.current = setInterval(() => {
      setCounter(calcAnniversary(partner.playingTogetherSince));
    }, 60000);
    return () => clearInterval(intervalRef.current);
  }, [partner?.playingTogetherSince]);

  if (!partner || !partner.name) return null;

  const kd = partner.kd ?? 0;
  const kdColor = getKdColor(kd);

  return (
    <motion.div 
      className="px-5 mt-4 opacity-85 hover:opacity-100 transition-opacity"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div 
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(0,210,255,0.05), rgba(157,78,221,0.05), rgba(7,11,20,0.95))',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 0 20px rgba(0,210,255,0.05)',
        }}
      >
        <div className="text-center mb-2">
          <span className="text-[9px] text-[#00F0FF] font-black tracking-widest bg-[#00F0FF]/10 px-3 py-0.5 rounded-full border border-[#00F0FF]/20">
            CLAN PARTNER MATCH
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 relative">
            {partner.photo ? (
              <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white font-bold">
                {partner.name?.[0] || '?'}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-200 truncate">{partner.name}</h4>
            <p className="text-[10px] text-slate-400 font-mono">ID: {partner.uid || '---'}</p>
          </div>

          <div className="text-right">
            <span 
              className="text-[10px] font-bold px-2 py-0.5 rounded border"
              style={{ background: `${kdColor}12`, border: `1px solid ${kdColor}30`, color: kdColor }}
            >
              {formatKd(kd)} K/D
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== MAIN HOME PAGE DEFAULT EXPORT ====================
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
        // Safe timeout matrix to ensure accurate DOM rendering
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

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans relative overflow-x-hidden pb-16">
      
      {/* 1. BGMI Lobby Background View */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 fixed z-0"
        style={{
          backgroundImage: profile?.heroBackground
            ? `url(${profile.heroBackground})`
            : 'linear-gradient(135deg, #0D1321, #070B14)',
        }}
      />

      <div className="relative z-10 container mx-auto px-4 pt-6 space-y-6 max-w-md md:max-w-2xl">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
        >
          <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#A855F7] to-[#FFD700] uppercase">
            BGMI Vault
          </h1>
          <p className="text-[9px] text-slate-400 tracking-widest mt-0.5">PREMIUM PROFILES</p>
        </motion.div>

        {/* ==================== MY PROFILE (MAIN ATTRACTION - EXTREME PREMIUM) ==================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full relative rounded-3xl p-[2px] bg-gradient-to-b from-[#FFD700] via-[#00F0FF] to-[#A855F7] shadow-[0_0_25px_rgba(255,215,0,0.35)] overflow-hidden"
        >
          <div className="bg-[#0b0f19]/95 backdrop-blur-xl rounded-[22px] p-5 relative">
            
            {/* Custom Mythic Tag Flag */}
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[8px] font-black px-2.5 py-1 rounded-full border border-pink-400/30 tracking-wider shadow-[0_0_10px_rgba(219,39,119,0.4)]">
                ★ MYTHIC FASHION
              </span>
            </div>

            {/* Avatar Framework */}
            <div className="flex flex-col items-center text-center mt-3">
              <div className="relative mb-3">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#00F0FF] to-[#A855F7] p-1 shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                  <img 
                    src={profile?.profilePhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964"} 
                    alt="Main Profile" 
                    className="w-full h-full object-cover rounded-full bg-slate-900"
                  />
                </div>
                <div className="absolute bottom-0 right-1 bg-gradient-to-r from-[#FFD700] to-yellow-600 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full border border-[#0a0c14]">
                  Lv.{profile?.accountLevel || "78"}
                </div>
              </div>

              {/* Identity Headers */}
              <h2 className="text-xl font-black text-white tracking-wide uppercase drop-shadow-[0_2px_8px_rgba(0,240,255,0.4)]">
                {profile?.ign || "D3XSHUBHAM"}
              </h2>
              <p className="text-xs text-slate-400 font-bold tracking-widest">{profile?.realName || "SHUBHAM KUMAR NAGVANSHI"}</p>
              
              <p className="text-xs text-[#00F0FF] font-mono mt-1.5 bg-[#00F0FF]/10 px-3 py-0.5 rounded border border-[#00F0FF]/20">
                ID: {profile?.bgmiId || "5557085848"}
              </p>
            </div>

            {/* Core Stats Metric Display */}
            <div className="grid grid-cols-3 gap-2.5 my-5">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center backdrop-blur-md">
                <p className="text-xl font-black text-[#00F0FF] font-mono">{formatKd(kd)}</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">K/D Ratio</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center backdrop-blur-md">
                <p className="text-sm font-black text-[#FFD700] pt-1 truncate">{profile?.tier || "Conqueror"}</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Tier</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 text-center backdrop-blur-md">
                <p className="text-xl font-black text-[#A855F7] font-mono">{profile?.popularity || "1.2M"}</p>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Popularity</p>
              </div>
            </div>

            {/* Extra Structural Elements */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-center">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider">Collection Level</p>
                <p className="text-sm font-black text-slate-200">{profile?.collectionLevel || "65"}</p>
              </div>
              <div className="bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-center flex flex-col justify-center items-center">
                <p className="text-[9px] text-slate-400 uppercase tracking-wider mb-1">Social Handles</p>
                <div className="flex space-x-3 text-sm">
                  <a href={social?.instagram || "https://instagram.com/shubhamnagvanshi84823"} target="_blank" rel="noreferrer" className="text-pink-500"><Instagram className="w-4 h-4" /></a>
                  <a href={social?.youtube || "#"} target="_blank" rel="noreferrer" className="text-red-500"><Youtube className="w-4 h-4" /></a>
                </div>
              </div>
            </div>

            {/* About Box Description */}
            <div className="bg-slate-900/90 p-3 rounded-xl border border-white/10 relative mt-3">
              <span className="absolute -top-1.5 left-3 bg-[#0b0f19] text-[#00F0FF] text-[7px] px-1.5 font-black tracking-widest border border-[#00F0FF]/30 rounded">ABOUT ME</span>
              <p className="text-xs text-slate-300 italic text-center">{profile?.about || "PUBG/BGMI Professional Player & Collector."}</p>
            </div>

          </div>
        </motion.section>

        {/* ==================== ACHIEVEMENTS BADGES SECTION ==================== */}
        <motion.div 
          className="bg-[#0d121f]/80 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs font-black text-[#A855F7] tracking-widest uppercase mb-3 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
            <Shield className="w-3.5 h-3.5" /> VAULT ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: '🏆 Conqueror Badge', style: 'text-[#FFD700] border-[#FFD700]/20 bg-[#FFD700]/5' },
              { name: '⚡ Ace Badge', style: 'text-red-500 border-red-500/20 bg-red-500/5' },
              { name: '🔥 Dominator Badge', style: 'text-purple-500 border-purple-500/20 bg-purple-500/5' },
              { name: '🎖️ Veteran Badge', style: 'text-slate-400 border-slate-500/20 bg-slate-500/5' },
              { name: '📦 Elite Collector', style: 'text-[#00F0FF] border-[#00F0FF]/20 bg-[#00F0FF]/5' },
              { name: '👑 Mythic Fashion', style: 'text-pink-500 border-pink-500/20 bg-pink-500/5' },
              { name: '🧬 OG Player', style: 'text-orange-400 border-orange-500/20 bg-orange-400/5' },
              { name: '⚔️ Event Champion', style: 'text-green-400 border-green-400/20 bg-green-400/5' },
            ].map((b, idx) => (
              <div key={idx} className={`p-2 rounded-xl border text-center font-black text-[11px] backdrop-blur-sm ${b.style}`}>
                {b.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ==================== PARTNER CONNECTOR DISPATCH ==================== */}
        {profile?.partner && <PartnerSection partner={profile.partner} />}

        {/* Quick Router Action Bar */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button 
            onClick={() => navigate('/friends')} 
            className="p-3 bg-gradient-to-r from-slate-900 to-black/80 rounded-xl border border-[#00F0FF]/20 text-xs font-bold text-slate-200 shadow-sm flex items-center justify-center gap-2"
          >
            👥 View Friends Page
          </button>
          <button 
            onClick={() => navigate('/gallery')} 
            className="p-3 bg-gradient-to-r from-slate-900 to-black/80 rounded-xl border border-white/5 text-xs font-bold text-slate-400 flex items-center justify-center gap-2"
          >
            🖼️ View Gallery
          </button>
        </div>

      </div>
    </div>
  );
        }
                     
