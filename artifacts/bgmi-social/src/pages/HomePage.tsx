import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Star, CheckCircle, Flame, Crown, Heart, Activity, Target, Trophy, Crosshair, Medal, Award, Image as ImageIcon, Users, BarChart2, Home, MessageSquare, User } from 'lucide-react';

export interface PlayerStats {
  kd: string;
  matches: number;
  wins: number;
  top10: number;
  rating: string;
}

export interface Partner {
  name: string;
  avatar: string;
  synergy: number;
  isOnline: boolean;
  relationship: string;
}

export interface PlayerData {
  id: string;
  name: string;
  avatar: string;
  background: string;
  level: number;
  country: string;
  bgmiId: string;
  tier: string;
  stars: number;
  isVerified: boolean;
  hasElite: boolean;
  hasConqueror: boolean;
  hasMythic: boolean;
  stats: PlayerStats;
  partner: Partner;
  achievements: string[];
  gallery: string[];
}

export default function HomePage() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistingData = async () => {
      setTimeout(() => {
        setPlayerData({
          id: "USR_123",
          name: "NinjaPro",
          avatar: "https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=300&q=80",
          background: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80",
          level: 74,
          country: "IN",
          bgmiId: "5123456789",
          tier: "CONQUEROR",
          stars: 3,
          isVerified: true,
          hasElite: true,
          hasConqueror: true,
          hasMythic: true,
          stats: { kd: "4.85", matches: 1240, wins: 412, top10: 890, rating: "SS+" },
          partner: {
            name: "ViperQueen",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
            synergy: 2450,
            isOnline: true,
            relationship: "Lover"
          },
          achievements: ["a1", "a2", "a3", "a4", "a5"],
          gallery: [
            "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1605901309584-818e25960b8f?auto=format&fit=crop&w=500&q=80",
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=500&q=80"
          ]
        });
        setLoading(false);
      }, 800);
    };

    fetchExistingData();
  }, []);

  if (loading || !playerData) {
    return (
      <div className="min-h-screen bg-[#070B14] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white font-sans pb-24 overflow-x-hidden selection:bg-cyan-500/30">
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full rounded-b-[40px] overflow-hidden bg-[#070B14] pb-6 border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(0,255,255,0.15)]"
      >
        <div className="absolute inset-0 h-48">
          <img 
            src={playerData.background} 
            alt="Profile Background" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/80 to-transparent" />
        </div>

        <div className="relative z-10 flex flex-col items-center pt-24 px-4">
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-b from-cyan-400 to-purple-600 shadow-[0_0_25px_rgba(0,255,255,0.4)]">
              <img 
                src={playerData.avatar} 
                alt="Avatar" 
                className="w-full h-full rounded-full border-[3px] border-[#070B14] object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#070B14] rounded-full p-1">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-[#070B14] font-bold text-xs shadow-[0_0_10px_rgba(250,204,21,0.6)]">
                {playerData.level}
              </span>
            </div>
          </motion.div>

          <div className="mt-4 flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-wide text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
              {playerData.name}
            </h1>
            {playerData.isVerified && <CheckCircle className="w-5 h-5 text-cyan-400 drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]" />}
          </div>

          <div className="flex gap-2 mt-2">
            {playerData.hasElite && <Shield className="w-5 h-5 text-purple-400" />}
            {playerData.hasConqueror && <Crown className="w-5 h-5 text-yellow-400" />}
            {playerData.hasMythic && <Flame className="w-5 h-5 text-red-500" />}
          </div>

          <div className="mt-3 flex items-center gap-4 text-sm font-medium text-gray-400">
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              ID: <span className="text-cyan-400">{playerData.bgmiId}</span>
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              {playerData.country} 🇮🇳
            </span>
          </div>

          <div className="mt-4 flex flex-col items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 font-extrabold text-lg uppercase tracking-widest">
              {playerData.tier}
            </span>
            <div className="flex gap-1 mt-1">
              {[...Array(playerData.stars)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]" />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-4 mt-6 p-[1px] rounded-2xl bg-gradient-to-r from-purple-600/50 to-pink-600/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
      >
        <div className="bg-[#070B14]/90 backdrop-blur-xl rounded-2xl p-4 flex items-center justify-between">
          <div className="flex flex-col items-center gap-2">
            <img src={playerData.avatar} alt="You" className="w-12 h-12 rounded-full border-2 border-cyan-400" />
            <span className="text-xs text-gray-400">You</span>
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <span className="text-pink-400 font-semibold text-xs tracking-widest uppercase">{playerData.partner.relationship}</span>
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-8 h-8 text-pink-500 fill-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
            </motion.div>
            <div className="flex items-center gap-1 text-xs text-purple-300 bg-purple-900/30 px-2 py-1 rounded-full border border-purple-500/30">
              <Activity className="w-3 h-3" />
              {playerData.partner.synergy} Synergy
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 relative">
            <div className="relative">
              <img src={playerData.partner.avatar} alt="Partner" className="w-12 h-12 rounded-full border-2 border-pink-400" />
              {playerData.partner.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#070B14]" />
              )}
            </div>
            <span className="text-xs text-gray-400 truncate w-16 text-center">{playerData.partner.name}</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-4 gap-2 px-4 mt-6">
        {[
          { name: 'Friends', icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { name: 'Leaderboard', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
          { name: 'Gallery', icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { name: 'Statistics', icon: BarChart2, color: 'text-green-400', bg: 'bg-green-400/10' },
        ].map((action, idx) => (
          <button key={idx} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-300 active:scale-95">
            <div className={`p-3 rounded-full ${action.bg} ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{action.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 mt-6">
        {[
          { label: 'F/D Ratio', value: playerData.stats.kd, icon: Target, color: 'text-cyan-400' },
          { label: 'Matches', value: playerData.stats.matches, icon: Crosshair, color: 'text-purple-400' },
          { label: 'Wins', value: playerData.stats.wins, icon: Trophy, color: 'text-yellow-400' },
          { label: 'Top 10', value: playerData.stats.top10, icon: Medal, color: 'text-green-400' },
        ].map((stat, idx) => (
          <div key={idx} className="relative group rounded-xl bg-white/[0.03] border border-white/10 p-4 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-cyan-500/50">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-400">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color} opacity-80`} />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-wide">
              {stat.value}
            </h3>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all duration-300" />
          </div>
        ))}
      </div>

      <div className="mt-6 px-4">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Award className="text-yellow-400 w-5 h-5" />
          Recent Achievements
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {playerData.achievements.map((_, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.1 }}
              className="flex-shrink-0 w-16 h-16 bg-gradient-to-b from-yellow-300 to-yellow-600 [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(250,204,21,0.3)]"
            >
              <div className="w-full h-full bg-[#070B14] [clip-path:polygon(50%_0%,_100%_25%,_100%_75%,_50%_100%,_0%_75%,_0%_25%)] flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mt-2 px-4 mb-8">
        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <ImageIcon className="text-purple-400 w-5 h-5" />
          Highlights Vault
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {playerData.gallery.map((img, idx) => (
            <div key={idx} className="flex-shrink-0 w-48 h-32 rounded-xl overflow-hidden border border-white/10 shadow-lg relative group">
              <img src={img} alt={`Highlight ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070B14]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
                <span className="text-xs text-white font-medium">Moment #{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-50">
        <div className="bg-[#070B14]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex justify-around items-center shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <button className="p-2 text-cyan-400 flex flex-col items-center gap-1">
            <Home className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
            <div className="w-1 h-1 bg-cyan-400 rounded-full" />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <Shield className="w-6 h-6" />
          </button>
          <button className="p-2 text-gray-500 hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
           }
           
