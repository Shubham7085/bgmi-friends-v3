import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFriends } from '../data/firebaseService';
import type { Friend } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

export default function LeaderboardPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFriends()
      .then(data => setFriends([...data].sort((a, b) => (b.synergy || 0) - (a.synergy || 0))))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const getRankColor = (i: number) => {
    if (i === 0) return '#FFD700';
    if (i === 1) return '#C0C0C0';
    if (i === 2) return '#CD7F32';
    return '#00F0FF';
  };

  const getRankIcon = (i: number) => {
    if (i === 0) return Crown;
    if (i === 1) return Medal;
    if (i === 2) return Medal;
    return Trophy;
  };

  const topThree = friends.slice(0, 3);
  const rest = friends.slice(3);

  return (
    <div className="pb-24 pt-16 px-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="w-10 h-10 glass-card flex items-center justify-center">
          <ArrowLeft className="w-5 h-5 text-[#00F0FF]" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white font-gaming">Leaderboard</h1>
          <p className="text-xs text-[#94A3B8]">Top friends by synergy</p>
        </div>
      </motion.div>

      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Trophy className="w-12 h-12 text-[#64748B]/50 mb-3" />
          <p className="text-sm text-[#94A3B8]">No friends yet</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <motion.div
              className="flex items-end justify-center gap-3 mb-8"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {topThree.map((friend, index) => {
                const RankIcon = getRankIcon(index);
                const rankColor = getRankColor(index);
                const height = index === 0 ? 'h-40' : index === 1 ? 'h-32' : 'h-28';
                const order = index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3';
                const kd = friend.kd ?? 0;
                const kdColor = getKdColor(kd);

                return (
                  <motion.div
                    key={friend.id}
                    className={`flex flex-col items-center ${order} cursor-pointer`}
                    variants={fadeInUp}
                    onClick={() => navigate(`/friend/${friend.id}`)}
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative mb-2">
                      <div
                        className="rounded-2xl overflow-hidden border-2"
                        style={{
                          width: index === 0 ? 68 : 60,
                          height: index === 0 ? 68 : 60,
                          borderColor: rankColor,
                          boxShadow: `0 0 20px ${rankColor}40`,
                        }}
                      >
                        {friend.profilePhoto ? (
                          <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                            <span className="text-xl font-bold" style={{ color: rankColor }}>{friend.ign[0]}</span>
                          </div>
                        )}
                      </div>
                      <div
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: rankColor }}
                      >
                        <RankIcon className="w-3.5 h-3.5 text-[#070B14]" />
                      </div>
                    </div>

                    <p className="text-xs font-bold text-white mb-0.5">{friend.ign}</p>
                    <p className="text-[10px] mb-0.5" style={{ color: rankColor }}>{friend.synergy}+ SYN</p>

                    {/* KD pill */}
                    <span
                      className="text-[9px] px-1.5 py-0.5 rounded-full font-bold mb-1.5"
                      style={{ color: kdColor, background: `${kdColor}18`, border: `1px solid ${kdColor}30` }}
                    >
                      {getKdDot(kd)} {formatKd(kd)}+ KD
                    </span>

                    <div
                      className={`w-20 ${height} rounded-t-xl flex items-end justify-center pb-2`}
                      style={{
                        background: `linear-gradient(to top, ${rankColor}20, ${rankColor}05)`,
                        border: `1px solid ${rankColor}30`,
                      }}
                    >
                      <span className="text-lg font-bold font-gaming" style={{ color: rankColor }}>
                        #{index + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Rest of the list */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-2">
            {rest.map((friend, index) => {
              const actualIndex = index + 3;
              const rankColor = getRankColor(actualIndex);
              const kd = friend.kd ?? 0;
              const kdColor = getKdColor(kd);

              return (
                <motion.div key={friend.id} variants={fadeInUp}>
                  <GlassCard
                    className="p-3 cursor-pointer"
                    onClick={() => navigate(`/friend/${friend.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold font-gaming w-7 text-center" style={{ color: rankColor }}>
                        #{actualIndex + 1}
                      </span>

                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00F0FF]/20 shrink-0">
                        {friend.profilePhoto ? (
                          <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{friend.ign}</p>
                        <p className="text-[10px] text-[#94A3B8]">{friend.realName}</p>
                      </div>

                      {/* KD */}
                      <div className="text-center shrink-0 mr-1">
                        <p className="text-xs font-bold" style={{ color: kdColor }}>
                          {getKdDot(kd)} {formatKd(kd)}+
                        </p>
                        <p className="text-[9px] text-[#64748B]">K/D</p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold" style={{ color: rankColor }}>{friend.synergy}+</p>
                        <p className="text-[10px] text-[#64748B]">SYN</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </motion.div>
        </>
      )}
    </div>
  );
}
