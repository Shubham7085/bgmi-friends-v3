import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Heart, Award, Target, ChevronRight, Instagram, Youtube, Facebook, MessageCircle, Swords, Star, Wifi, WifiOff } from 'lucide-react';
import { getProfile, getSocialLinks, getFriends, getGallery, getSettings } from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, GalleryImage, SiteSettings, PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { staggerContainer, fadeInUp } from '../utils/animations';
import { useNavigate } from 'react-router-dom';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

function UsersIcon(p: any) { return <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function TrophyIcon(p: any) { return <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 19.8 7 21h10c0-1.2-.85-2.25-1.97-2.79-.5-.23-.97-.66-.97-1.21v-2.34"/><path d="M8 8h8v6a4 4 0 0 1-8 0V8z"/></svg>; }
function ImageIcon(p: any) { return <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>; }
function BarChartIcon(p: any) { return <svg {...p} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/></svg>; }

const BADGE_MAP: Record<string, { label: string; icon: string; color: string; glow: string }> = {
  verified: { label: 'Verified Player', icon: '✔',  color: '#3B82F6', glow: 'rgba(59,130,246,0.3)' },
  elite:    { label: 'Elite Player',    icon: '👑', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
  partner:  { label: 'Partner',         icon: '❤️', color: '#F43F5E', glow: 'rgba(244,63,94,0.3)' },
  popular:  { label: 'Popular Player',  icon: '⭐', color: '#A855F7', glow: 'rgba(168,85,247,0.3)' },
};

function calcAnniversary(since: string) {
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

function PartnerSection({ partner }: { partner: PartnerData }) {
  const [counter, setCounter] = useState(() => calcAnniversary(partner.playingTogetherSince));
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (!partner.playingTogetherSince) return;
    intervalRef.current = setInterval(() => {
      setCounter(calcAnniversary(partner.playingTogetherSince));
    }, 60000);
    return () => clearInterval(intervalRef.current);
  }, [partner.playingTogetherSince]);

  const kd = partner.kd ?? 0;
  const kdColor = getKdColor(kd);

  return (
    <motion.section
      className="px-5 mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
    >
      <div
        className="rounded-2xl p-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(168,85,247,0.08), rgba(7,11,20,0.9))',
          border: '1px solid rgba(244,63,94,0.35)',
          boxShadow: '0 0 30px rgba(244,63,94,0.12), 0 0 60px rgba(168,85,247,0.06)',
        }}
      >
        {/* Decorative glow orb */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #F43F5E, transparent)' }}
        />

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">❤️</span>
          <h3 className="text-sm font-bold font-gaming" style={{ color: '#F43F5E' }}>Partner</h3>
          <span
            className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold border"
            style={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.1)' }}
          >
            👑 Elite Partner
          </span>
        </div>

        {/* Partner card */}
        <div className="flex items-center gap-4">
          {/* Photo */}
          <div className="relative shrink-0">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden border-2"
              style={{ borderColor: 'rgba(244,63,94,0.5)', boxShadow: '0 0 20px rgba(244,63,94,0.25)' }}
            >
              {partner.photo ? (
                <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#F43F5E]/20 to-[#A855F7]/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#F43F5E]/50">{partner.name?.[0] || '?'}</span>
                </div>
              )}
            </div>
            {partner.isOnline ? (
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#070B14] flex items-center justify-center"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wifi className="w-2.5 h-2.5 text-white" />
              </motion.div>
            ) : (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#374151] border-2 border-[#070B14] flex items-center justify-center">
                <WifiOff className="w-2.5 h-2.5 text-[#94A3B8]" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-bold text-white font-gaming truncate">{partner.name}</p>
            <p className="text-xs text-[#94A3B8] mb-1 truncate">UID: {partner.uid}</p>
            {partner.relationshipStatus && (
              <span
                className="inline-block text-[10px] px-2 py-0.5 rounded-full border mb-2"
                style={{ color: '#F43F5E', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.1)' }}
              >
                {partner.relationshipStatus}
              </span>
            )}
            <div className="flex gap-3">
              <div
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold"
                style={{ background: `${kdColor}12`, border: `1px solid ${kdColor}30`, color: kdColor }}
              >
                <span>{getKdDot(kd)}</span>
                <span>{formatKd(kd)}+ KD</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B]">
                <Heart className="w-3 h-3" />
                <span>{partner.synergy}+ SYN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Anniversary counter */}
        {counter && partner.playingTogetherSince && (
          <div className="mt-4 pt-4 border-t border-[#F43F5E]/15">
            <div className="flex items-center gap-1.5 mb-2">
              <Calendar className="w-3.5 h-3.5 text-[#F43F5E]" />
              <span className="text-[10px] text-[#94A3B8]">Playing Together Since {partner.playingTogetherSince}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Years', value: counter.years },
                { label: 'Months', value: counter.months },
                { label: 'Days', value: counter.days },
                { label: 'Hours', value: counter.hours },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="text-center py-1.5 rounded-xl"
                  style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)' }}
                >
                  <p className="text-base font-bold font-gaming text-[#F43F5E]">{value}</p>
                  <p className="text-[9px] text-[#64748B]">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-[#64748B] mt-2">{counter.totalDays}+ days together ❤️</p>
          </div>
        )}
      </div>
    </motion.section>
  );
}

export default function HomePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [, setGallery] = useState<GalleryImage[]>([]);
  const [, setSettings] = useState<SiteSettings | null>(null);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kd = profile?.kd ?? 0;
  const kdColor = getKdColor(kd);
  const badges = profile?.badges ?? [];

  return (
    <div className="pb-24">
      
      

      {/* Partner Section */}
      {profile?.partner?.name && <PartnerSection partner={profile.partner} />}

      {/* Profile Details */}
      <motion.section
        className="px-5 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <GlassCard className="p-4" hover={false}>
          <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming flex items-center gap-2">
            <Swords className="w-4 h-4" />
            Profile Details
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {/* KD */}
            {kd > 0 && (
              <div className="col-span-2">
                <div
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{ background: `${kdColor}08`, borderColor: `${kdColor}25` }}
                >
                  <div className="flex items-center gap-2">
                    <Swords className="w-4 h-4" style={{ color: kdColor }} />
                    <span className="text-xs text-[#94A3B8]">K/D Ratio</span>
                  </div>
                  <span className="text-lg font-bold font-gaming" style={{ color: kdColor }}>
                    {getKdDot(kd)} {formatKd(kd)}+
                  </span>
                </div>
              </div>
            )}

            {/* Hero */}
<section className="relative h-[560px] overflow-hidden">

  {/* Background */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: profile?.heroBackground
        ? `url(${profile.heroBackground})`
        : "linear-gradient(135deg,#050816,#081426,#050816)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/55" />

  {/* Neon Glow */}
  <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-[120px]" />
  <div className="absolute bottom-0 right-0 w-[260px] h-[260px] rounded-full bg-fuchsia-600/20 blur-[100px]" />

  {/* Bottom Gradient */}
  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070B14]/30 to-[#070B14]" />

  <div className="relative z-10 flex flex-col items-center justify-end h-full px-5 pb-8">

    {/* Avatar */}
    <motion.div
      initial={{ opacity: 0, scale: .8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: .6 }}
      className="relative mb-5"
    >

      {/* Glow Ring */}
      <div className="absolute -inset-3 rounded-full bg-cyan-400/20 blur-2xl" />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute inset-0 rounded-full border-2 border-cyan-400/40 border-dashed"
      />

      <div
        className="relative w-36 h-36 rounded-full overflow-hidden border-[4px]"
        style={{
          borderColor: "#00F0FF",
          boxShadow:
            "0 0 35px rgba(0,240,255,.45),0 0 90px rgba(0,240,255,.18)"
        }}
      >
        {profile?.profilePhoto ? (
          <img
            src={profile.profilePhoto}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-fuchsia-600/20">
            <Swords className="w-14 h-14 text-cyan-400" />
          </div>
        )}
      </div>

      {/* Online */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity
        }}
        className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-green-500 border-4 border-[#070B14]"
      />
    </motion.div>
            

            {[
              { label: 'Collection Level', value: `${profile?.collectionLevel || 0}+`, icon: Target,    color: '#B829DD' },
              { label: 'Account Level',    value: `${profile?.accountLevel || 0}+`,    icon: Award,     color: '#00F0FF' },
              { label: 'Popularity',       value: `${profile?.popularity || 0}+`,      icon: Star,      color: '#FF6B6B' },
              { label: 'Likes',            value: `${profile?.likes || 0}+`,           icon: Heart,     color: '#F43F5E' },
              { label: 'Matches',          value: `${profile?.matches || 0}+`,         icon: Swords,    color: '#00E5FF' },
              { label: 'Achieve. Points',  value: `${profile?.achievementPoints || 0}+`, icon: Award,   color: '#FFD700' },
              { label: 'Current Tier',     value: profile?.currentTier || '-',         icon: TrophyIcon,color: '#FFD700' },
              { label: 'Highest Tier',     value: profile?.highestTier || '-',         icon: TrophyIcon,color: '#4ECDC4' },
              { label: 'Playing Since',    value: profile?.playingSince || '-',        icon: Calendar,  color: '#94A3B8' },
              { label: 'State',            value: profile?.state || '-',               icon: MapPin,    color: '#94A3B8' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2 p-2 rounded-xl bg-[#070B14]/40">
                <item.icon className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: item.color }} />
                <div>
                  <p className="text-[10px] text-[#64748B]">{item.label}</p>
                  <p className="text-xs font-semibold text-[#E2E8F0]">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.section>

      {/* About Me */}
      {profile?.aboutMe && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-4" hover={false}>
            <h3 className="text-sm font-bold text-[#00F0FF] mb-2 font-gaming">About Me</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{profile.aboutMe}</p>
          </GlassCard>
        </motion.section>
      )}

      {/* Social Links */}
      {social && (social.instagram || social.youtube || social.facebook || social.discord) && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-4" hover={false}>
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Connect</h3>
            <div className="grid grid-cols-2 gap-2">
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#E4405F]/10 to-[#F77737]/10 border border-[#E4405F]/20 text-[#E4405F]"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-xs font-medium">Instagram</span>
                  </motion.div>
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#FF0000]/10 to-[#CC0000]/10 border border-[#FF0000]/20 text-[#FF0000]"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <Youtube className="w-4 h-4" />
                    <span className="text-xs font-medium">YouTube</span>
                  </motion.div>
                </a>
              )}
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#1877F2]/10 to-[#0D5CB6]/10 border border-[#1877F2]/20 text-[#1877F2]"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <Facebook className="w-4 h-4" />
                    <span className="text-xs font-medium">Facebook</span>
                  </motion.div>
                </a>
              )}
              {social.discord && (
                <a href={social.discord} target="_blank" rel="noopener noreferrer">
                  <motion.div
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#5865F2]/10 to-[#4752C4]/10 border border-[#5865F2]/20 text-[#5865F2]"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Discord</span>
                  </motion.div>
                </a>
              )}
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Featured Friends */}
      {friends.length > 0 && (
        <motion.section
          className="px-5 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#00F0FF] font-gaming">Featured Friends</h3>
            <button onClick={() => navigate('/friends')} className="text-[10px] text-[#94A3B8] hover:text-[#00F0FF]">
              View All
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
            {friends.slice(0, 6).map((friend) => {
              const fKd = friend.kd ?? 0;
              const fKdColor = getKdColor(fKd);
              return (
                <motion.div
                  key={friend.id}
                  className="flex-shrink-0 w-20 cursor-pointer"
                  onClick={() => navigate(`/friend/${friend.id}`)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/20 mb-1.5">
                    {friend.profilePhoto ? (
                      <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                      </div>
                    )}
                    {friend.isOnline && (
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border border-[#070B14]" />
                    )}
                  </div>
                  <p className="text-[10px] text-center text-[#E2E8F0] truncate">{friend.ign}</p>
                  <p className="text-[9px] text-center font-bold" style={{ color: fKdColor }}>
                    {formatKd(fKd)}+ KD
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
            }
