
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

const quickActions = [
{ label: 'All Friends', icon: UsersIcon, path: '/friends', color: '#00F0FF' },
{ label: 'Top 10', icon: TrophyIcon, path: '/leaderboard', color: '#FFD700' },
{ label: 'Gallery', icon: ImageIcon, path: '/gallery', color: '#FF6B6B' },
{ label: 'Statistics', icon: BarChartIcon, path: '/statistics', color: '#4ECDC4' },
];

function UsersIcon(p: any) { return ; }
function TrophyIcon(p: any) { return ; }
function ImageIcon(p: any) { return ; }
function BarChartIcon(p: any) { return ; }

const BADGE_MAP: Record = {
verified: { label: 'Verified Player', icon: '✔', color: '#3B82F6', glow: 'rgba(59,130,246,0.3)' },
elite: { label: 'Elite Player', icon: '👑', color: '#FFD700', glow: 'rgba(255,215,0,0.3)' },
partner: { label: 'Partner', icon: '❤️', color: '#F43F5E', glow: 'rgba(244,63,94,0.3)' },
popular: { label: 'Popular Player', icon: '⭐', color: '#A855F7', glow: 'rgba(168,85,247,0.3)' },
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
const intervalRef = useRef<any>(null);
  

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

className="px-5 mt-4"
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.35 }}
>

className="rounded-2xl p-4 relative overflow-hidden"
style={{
background: 'linear-gradient(135deg, rgba(244,63,94,0.08), rgba(168,85,247,0.08), rgba(7,11,20,0.9))',
border: '1px solid rgba(244,63,94,0.35)',
boxShadow: '0 0 30px rgba(244,63,94,0.12), 0 0 60px rgba(168,85,247,0.06)',
}}
>
{/* Decorative glow orb */}

className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none"
style={{ background: 'radial-gradient(circle, #F43F5E, transparent)' }}
/>

{/* Header */}


❤️

Partner


className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold border"
style={{ color: '#FFD700', borderColor: 'rgba(255,215,0,0.3)', background: 'rgba(255,215,0,0.1)' }}
>
👑 Elite Partner




{/* Partner card */}


{/* Photo */}



className="w-20 h-20 rounded-2xl overflow-hidden border-2"
style={{ borderColor: 'rgba(244,63,94,0.5)', boxShadow: '0 0 20px rgba(244,63,94,0.25)' }}
>
{partner.photo ? (

) : (


{partner.name?.[0] || '?'}


)}


{partner.isOnline ? (

className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#070B14] flex items-center justify-center"
animate={{ scale: [1, 1.3, 1] }}
transition={{ duration: 2, repeat: Infinity }}
>


) : (





)}



{/* Info */}



{partner.name}


UID: {partner.uid}

{partner.relationshipStatus && (

className="inline-block text-[10px] px-2 py-0.5 rounded-full border mb-2"
style={{ color: '#F43F5E', borderColor: 'rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.1)' }}
>
{partner.relationshipStatus}

)}



className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold"
style={{ background: `${kdColor}12`, border: `1px solid ${kdColor}30`, color: kdColor }}
>
{getKdDot(kd)}
{formatKd(kd)}+ KD





{partner.synergy}+ SYN







{/* Anniversary counter */}
{counter && partner.playingTogetherSince && (





Playing Together Since {partner.playingTogetherSince}




{[
{ label: 'Years', value: counter.years },
{ label: 'Months', value: counter.months },
{ label: 'Days', value: counter.days },
{ label: 'Hours', value: counter.hours },
].map(({ label, value }) => (

key={label}
className="text-center py-1.5 rounded-xl"
style={{ background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.15)' }}
>

{value}


{label}



))}



{counter.totalDays}+ days together ❤️


)}


);
}

export default function HomePage() {
const [profile, setProfile] = useState(null);
const [social, setSocial] = useState(null);
const [friends, setFriends] = useState([]);
const [, setGallery] = useState([]);
const [, setSettings] = useState(null);
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






);
}

const kd = profile?.kd ?? 0;
const kdColor = getKdColor(kd);
const badges = profile?.badges ?? [];

const stats = {
totalFriends: friends.length,
totalSynergy: friends.reduce((s, f) => s + (f.synergy || 0), 0),
highestSynergy: friends.length > 0 ? Math.max(...friends.map(f => f.synergy || 0)) : 0,
avgSynergy: friends.length > 0 ? Math.round(friends.reduce((s, f) => s + (f.synergy || 0), 0) / friends.length) : 0,
totalMemories: friends.reduce((s, f) => s + (f.memories?.length || 0), 0),
collectionAvg: friends.length > 0 ? Math.round(friends.reduce((s, f) => s + (f.collectionLevel || 0), 0) / friends.length) : 0,
};

return (


{/* Hero */}



className="absolute inset-0 bg-cover bg-center"
style={{
backgroundImage: profile?.heroBackground
? `url(${profile.heroBackground})`
: 'linear-gradient(135deg, #0D1321, #070B14)',
}}
/>








className="flex items-end gap-4"
initial={{ opacity: 0, y: 30 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
>
{/* Avatar */}



className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/40"
style={{ boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
>
{profile?.profilePhoto ? (

) : (





)}



className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#070B14]"
animate={{ scale: [1, 1.2, 1] }}
transition={{ duration: 2, repeat: Infinity }}
/>



{/* Name + info */}



className="text-2xl md:text-3xl font-bold text-white font-gaming"
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: 0.2 }}
>
{profile?.ign || 'Your IGN'}


className="text-sm text-[#94A3B8] mt-0.5"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.3 }}
>
{profile?.realName || 'Your Name'}


className="flex items-center gap-3 mt-2 flex-wrap"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.4 }}
>

ID: {profile?.bgmiId || '---'}



{profile?.country || 'Country'}

{kd > 0 && (

className="text-xs font-bold px-2 py-0.5 rounded-md border"
style={{ color: kdColor, borderColor: `${kdColor}40`, background: `${kdColor}12` }}
>
{getKdDot(kd)} {formatKd(kd)}+ KD

)}


{/* Badges */}
{badges.length > 0 && (

className="flex flex-wrap gap-1.5 mt-2"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ delay: 0.5 }}
>
{badges.map(badge => {
const b = BADGE_MAP[badge];
if (!b) return null;
return (

key={badge}
className="text-[10px] px-2 py-0.5 rounded-full border font-semibold"
style={{ color: b.color, borderColor: `${b.color}40`, background: `${b.color}15` }}
>
{b.icon} {b.label}

);
})}

)}








{/* Partner Section */}
{profile?.partner?.name && }

{/* Quick Stats */}

className="px-5 mt-4"
variants={staggerContainer}
initial="hidden"
animate="visible"
>


{[
{ label: 'Friends', value: stats.totalFriends, icon: UsersIcon, color: '#00F0FF' },
{ label: 'Total Synergy', value: stats.totalSynergy, icon: Heart, color: '#FF6B6B' },
{ label: 'Avg Synergy', value: stats.avgSynergy, icon: Award, color: '#FFD700' },
{ label: 'Coll. Avg', value: stats.collectionAvg, icon: Target, color: '#B829DD' },
{ label: 'Memories', value: stats.totalMemories, icon: ImageIcon, color: '#4ECDC4' },
{ label: 'Highest SYN', value: stats.highestSynergy,icon: TrophyIcon, color: '#00E5FF' },
].map((stat) => (





{stat.label}



end={stat.value}
className="text-xl font-bold font-gaming"
suffix="+"
style={{ color: stat.color } as React.CSSProperties}
/>


))}




{/* Profile Details */}

className="px-5 mt-6"
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ delay: 0.5 }}
>


Profile Details



{/* KD */}
{kd > 0 && (



className="flex items-center justify-between p-3 rounded-xl border"
style={{ background: `${kdColor}08`, borderColor: `${kdColor}25` }}
>



K/D Ratio



{getKdDot(kd)} {formatKd(kd)}+





)}

{[
{ label: 'Collection Level', value: `${profile?.collectionLevel || 0}+`, icon: Target, color: '#B829DD' },
{ label: 'Account Level', value: `${profile?.accountLevel || 0}+`, icon: Award, color: '#00F0FF' },
{ label: 'Popularity', value: `${profile?.popularity || 0}+`, icon: Star, color: '#FF6B6B' },
{ label: 'Likes', value: `${profile?.likes || 0}+`, icon: Heart, color: '#F43F5E' },
{ label: 'Matches', value: `${profile?.matches || 0}+`, icon: Swords, color: '#00E5FF' },
{ label: 'Achieve. Points', value: `${profile?.achievement
