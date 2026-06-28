import React from 'react';
import { motion } from 'framer-motion';
import { FiInstagram, FiYoutube, FiAward, FiShield, FiZap, FiSettings } from 'react-icons/fi';

// 1. Safe Type mapping matching your existing project system
interface HomeProps {
  userProfile?: any;
  partnerProfile?: any;
  isAdmin?: boolean;
  friends?: any[];
}

// 2. Main component definition matching default layout standards
const Home: React.FC<HomeProps> = ({ userProfile, partnerProfile, isAdmin }) => {
  
  const myStats = {
    ign: userProfile?.ign || "D3XSHUBHAM",
    realName: userProfile?.realName || "SHUBHAM KUMAR NAGVANSHI",
    bgmiId: userProfile?.bgmiId || "5557085848",
    level: userProfile?.level || "78",
    collectionLevel: userProfile?.collectionLevel || "65",
    tier: userProfile?.tier || "Conqueror",
    kd: userProfile?.kd || "5.24",
    popularity: userProfile?.popularity || "1.2M",
    about: userProfile?.about || "PUBG/BGMI Professional Player & Collector.",
    instagram: userProfile?.instagram || "https://instagram.com/shubhamnagvanshi84823",
    youtube: userProfile?.youtube || "#"
  };

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white font-sans relative overflow-x-hidden pb-16">
      
      {/* BGMI Lobby Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35 fixed z-0"
        style={{ backgroundImage: `url(${userProfile?.lobbyBg || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070'})` }}
      />
      
      {/* Main Glassmorphism UI Content */}
      <div className="relative z-10 container mx-auto px-4 pt-6 space-y-8 max-w-md md:max-w-3xl">
        
        {/* ==================== HOME PAGE HEADER ==================== */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_0_15px_rgba(0,210,255,0.2)]"
        >
          <h1 className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ff] via-[#9d4edd] to-[#ffb703] uppercase">
            BGMI Vault
          </h1>
          <p className="text-[10px] text-slate-400 tracking-widest mt-1">PREMIUM GAMING HUB</p>
        </motion.div>

        {/* ==================== MY PROFILE (MAIN ATTRACTION - SUPER PREMIUM) ==================== */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full relative rounded-3xl p-[2px] bg-gradient-to-b from-[#ffb703] via-[#00d2ff] to-[#9d4edd] shadow-[0_0_25px_rgba(255,183,3,0.4)] overflow-hidden"
        >
          <div className="bg-[#0b0f19]/90 backdrop-blur-xl rounded-[22px] p-6 relative">
            
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white text-[9px] font-black px-3 py-1 rounded-full border border-pink-400/40 tracking-wider shadow-[0_0_10px_rgba(219,39,119,0.5)]">
                ★ MYTHIC FASHION
              </span>
            </div>

            <div className="flex flex-col items-center text-center mt-4">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#ffb703] via-[#00d2ff] to-[#9d4edd] p-1 shadow-[0_0_20px_rgba(0,210,255,0.6)]">
                  <img 
                    src={userProfile?.avatarUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964"} 
                    alt="Shubham Avatar" 
                    className="w-full h-full object-cover rounded-full bg-slate-900"
                  />
                </div>
                <div className="absolute bottom-0 right-1 bg-gradient-to-r from-[#ffb703] to-yellow-600 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-[#0a0c14]">
                  Lv.{myStats.level}
                </div>
              </div>

              <h2 className="text-2xl font-black text-white tracking-wide uppercase drop-shadow-[0_2px_10px_rgba(0,212,255,0.5)]">
                {myStats.ign}
              </h2>
              <p className="text-xs text-slate-400 font-bold tracking-widest mt-0.5">{myStats.realName}</p>
              
              <p className="text-xs text-[#00d2ff] font-mono mt-2 bg-[#00d2ff]/10 px-4 py-1 rounded-md border border-[#00d2ff]/20 tracking-wider">
                ID: {myStats.bgmiId}
              </p>
            </div>

            {/* Core Stats Grid Layout */}
            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md shadow-[0_0_10px_rgba(0,210,255,0.15)]">
                <p className="text-2xl font-black text-[#00d2ff] font-mono">{myStats.kd}</p>
                <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">K/D Ratio</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md shadow-[0_0_15px_rgba(255,183,3,0.25)]">
                <p className="text-lg font-black text-[#ffb703] pt-0.5 truncate">{myStats.tier}</p>
                <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Tier</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center backdrop-blur-md shadow-[0_0_10px_rgba(157,78,221,0.15)]">
                <p className="text-2xl font-black text-[#9d4edd] font-mono">{myStats.popularity}</p>
                <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Popularity</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Collection Lv.</p>
                <p className="text-base font-black text-slate-200">{myStats.collectionLevel}</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-xl border border-white/5 text-center flex flex-col justify-center items-center">
                <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Links</p>
                <div className="flex space-x-4 text-base">
                  <a href={myStats.instagram} target="_blank" rel="noreferrer" className="text-pink-500 hover:scale-120 transition-transform"><FiInstagram /></a>
                  <a href={myStats.youtube} target="_blank" rel="noreferrer" className="text-red-500 hover:scale-120 transition-transform"><FiYoutube /></a>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-white/10 relative mt-4">
              <span className="absolute -top-2 left-4 bg-[#0b0f19] text-[#00d2ff] text-[8px] px-2 font-black tracking-widest border border-[#00d2ff]/30 rounded">ABOUT ME</span>
              <p className="text-xs text-slate-300 italic text-center pt-1">{myStats.about}</p>
            </div>

          </div>
        </motion.section>

        {/* ==================== ACHIEVEMENTS BADGES SECTION ==================== */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-[#0d121f]/75 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-[0_0_15px_rgba(157,78,221,0.2)]"
        >
          <h3 className="text-sm font-black text-[#9d4edd] tracking-widest uppercase mb-4 flex items-center gap-2 border-b border-white/5 pb-2">
            <FiShield /> SPECIAL VAULT ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: '🏆 Conqueror Badge', style: 'text-[#ffb703] border-[#ffb703]/20 bg-[#ffb703]/5' },
              { name: '⚡ Ace Badge', style: 'text-red-500 border-red-500/20 bg-red-500/5' },
              { name: '🔥 Dominator Badge', style: 'text-purple-500 border-purple-500/20 bg-purple-500/5' },
              { name: '🎖️ Veteran Badge', style: 'text-slate-400 border-slate-500/20 bg-slate-500/5' },
              { name: '📦 Elite Collector', style: 'text-[#00d2ff] border-[#00d2ff]/20 bg-[#00d2ff]/5' },
              { name: '👑 Mythic Fashion', style: 'text-pink-500 border-pink-500/20 bg-pink-500/5' },
              { name: '🧬 OG Player', style: 'text-orange-400 border-orange-500/20 bg-orange-500/5' },
              { name: '⚔️ Event Champion', style: 'text-green-400 border-green-400/20 bg-green-400/5' },
            ].map((badge, idx) => (
              <div key={idx} className={`p-3 rounded-xl border text-center font-black text-xs backdrop-blur-sm transition-all hover:scale-[1.02] ${badge.style}`}>
                {badge.name}
              </div>
            ))}
          </div>
        </motion.div>

        {/* ==================== REDESIGNED CLEAN PARTNER SECTION ==================== */}
        {partnerProfile && (
          <motion.section 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full bg-[#0d121f]/50 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-[0_0_15px_rgba(0,210,255,0.15)] opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="text-center mb-3">
              <span className="text-[9px] text-[#00d2ff] font-black tracking-widest bg-[#00d2ff]/10 px-3 py-0.5 rounded-full border border-[#00d2ff]/20">
                CLAN PARTNER
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <img 
                src={partnerProfile?.avatarUrl || "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1974"} 
                alt="Partner Avatar" 
                className="w-14 h-14 rounded-xl object-cover border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold text-slate-200 truncate">{partnerProfile?.ign || "Partner_IGN"}</h4>
                <p className="text-xs text-[#00d2ff]/70 font-mono">ID: {partnerProfile?.bgmiId || "XXXXXXXXXX"}</p>
              </div>
              <div className="text-right flex flex-col justify-center items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tier</span>
                <span className="text-xs font-bold text-[#ffb703]">{partnerProfile?.tier || "Ace"}</span>
              </div>
            </div>
          </motion.section>
        )}

      </div>

      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <a href="/admin" className="bg-[#9d4edd] text-white p-3 rounded-full flex items-center justify-center shadow-lg border border-purple-400">
            <FiSettings className="text-lg" />
          </a>
        </div>
      )}
    </div>
  );
};

// 3. Ensuring seamless structural mapping via default export
export default Home;
          
