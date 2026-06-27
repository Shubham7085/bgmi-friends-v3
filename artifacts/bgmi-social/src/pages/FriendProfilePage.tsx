import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Heart, Clock, Target, Swords, Star, CheckCircle, Crown, Calendar } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFriends } from '../data/firebaseService';
import type { Friend } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

function calcDuration(from: string) {
  const start = new Date(from);
  const now = new Date();
  const diff = Math.abs(now.getTime() - start.getTime());
  const totalDays = Math.ceil(diff / 86400000);
  return {
    years: Math.floor(totalDays / 365),
    months: Math.floor((totalDays % 365) / 30),
    days: totalDays % 30,
    totalDays,
  };
}

const BADGE_MAP: Record<string, { label: string; icon: string; color: string; glow: string }> = {
  verified:  { label: 'Verified Player', icon: '✔',  color: '#3B82F6', glow: 'rgba(59,130,246,0.25)' },
  elite:     { label: 'Elite Player',    icon: '👑', color: '#FFD700', glow: 'rgba(255,215,0,0.25)' },
  partner:   { label: 'Partner',         icon: '❤️', color: '#F43F5E', glow: 'rgba(244,63,94,0.25)' },
  popular:   { label: 'Popular Player',  icon: '⭐', color: '#A855F7', glow: 'rgba(168,85,247,0.25)' },
};

export default function FriendProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [friend, setFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFriends()
      .then(list => setFriend(list.find(f => f.id === id) ?? null))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const duration = useMemo(() => friend?.friendSince ? calcDuration(friend.friendSince) : null, [friend]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <p className="text-lg text-[#94A3B8] mb-4">Friend not found</p>
        <button onClick={() => navigate('/friends')} className="btn-primary px-4 py-2 rounded-xl text-sm">
          Back to Friends
        </button>
      </div>
    );
  }

  const kd = friend.kd ?? 0;
  const kdColor = getKdColor(kd);
  const kdDot = getKdDot(kd);
  const badges = friend.badges ?? [];

  return (
    <div className="pb-24">
      {/* Hero Banner */}
      <section className="relative h-[300px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: friend.coverBanner
              ? `url(${friend.coverBanner})`
              : 'linear-gradient(135deg, #0D1321, #1a0533, #070B14)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070B14]/10 via-[#070B14]/50 to-[#070B14]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#070B14]/40 to-transparent" />

        {/* Neon border glow on cover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00F0FF]/40 to-transparent" />

        <div className="relative z-10 px-5 pt-4">
          <motion.button
            onClick={() => navigate('/friends')}
            className="w-10 h-10 glass-card flex items-center justify-center"
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft className="w-5 h-5 text-[#00F0FF]" />
          </motion.button>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4 px-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div
              className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-[#00F0FF]/50"
              style={{ boxShadow: '0 0 30px rgba(0,240,255,0.25), 0 0 60px rgba(0,240,255,0.1)' }}
            >
              {friend.profilePhoto ? (
                <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/20 to-[#B829DD]/20 flex items-center justify-center">
                  <span className="text-3xl font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                </div>
              )}
            </div>
            {friend.isOnline ? (
              <motion.div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#070B14]"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            ) : (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#374151] border-2 border-[#070B14]" />
            )}
          </motion.div>

          <motion.div
            className="text-center mt-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl font-bold text-white font-gaming tracking-wide">{friend.ign}</h1>
            <p className="text-sm text-[#94A3B8]">{friend.realName}</p>
            <span className="text-xs bg-[#00F0FF]/10 text-[#00F0FF] px-2 py-0.5 rounded-md mt-1 inline-block border border-[#00F0FF]/20">
              ID: {friend.bgmiId}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Badges */}
      {badges.length > 0 && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {badges.map(badge => {
              const b = BADGE_MAP[badge];
              if (!b) return null;
              return (
                <motion.span
                  key={badge}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border"
                  style={{
                    color: b.color,
                    borderColor: `${b.color}40`,
                    background: `${b.color}12`,
                    boxShadow: `0 0 12px ${b.glow}`,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span>{b.icon}</span> {b.label}
                </motion.span>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Core Stats Grid */}
      <motion.section
        className="px-5 mt-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-2 gap-3">
          {/* KD */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3" hover={false}>
              <div className="flex items-center gap-2 mb-1">
                <Swords className="w-3.5 h-3.5" style={{ color: kdColor }} />
                <span className="text-[10px] text-[#94A3B8]">K/D Ratio</span>
              </div>
              <div className="flex items-baseline gap-1">
                <p className="text-lg font-bold font-gaming" style={{ color: kdColor }}>
                  {formatKd(kd)}+
                </p>
                <span className="text-sm">{kdDot}</span>
              </div>
            </GlassCard>
          </motion.div>

          {/* Synergy */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3" hover={false}>
              <div className="flex items-center gap-2 mb-1">
                <Heart className="w-3.5 h-3.5 text-[#FF6B6B]" />
                <span className="text-[10px] text-[#94A3B8]">Synergy</span>
              </div>
              <p className="text-lg font-bold text-[#FF6B6B] font-gaming">{friend.synergy}+</p>
            </GlassCard>
          </motion.div>

          {/* Collection Level */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3" hover={false}>
              <div className="flex items-center gap-2 mb-1">
                <Award className="w-3.5 h-3.5 text-[#FFD700]" />
                <span className="text-[10px] text-[#94A3B8]">Collection</span>
              </div>
              <p className="text-lg font-bold text-[#FFD700] font-gaming">Lv.{friend.collectionLevel}+</p>
            </GlassCard>
          </motion.div>

          {/* Account Level */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3" hover={false}>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-3.5 h-3.5 text-[#B829DD]" />
                <span className="text-[10px] text-[#94A3B8]">Account Level</span>
              </div>
              <p className="text-lg font-bold text-[#B829DD] font-gaming">{friend.accountLevel || 0}+</p>
            </GlassCard>
          </motion.div>

          {/* Matches */}
          {(friend.matches ?? 0) > 0 && (
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-3" hover={false}>
                <div className="flex items-center gap-2 mb-1">
                  <Swords className="w-3.5 h-3.5 text-[#00E5FF]" />
                  <span className="text-[10px] text-[#94A3B8]">Matches</span>
                </div>
                <p className="text-lg font-bold text-[#00E5FF] font-gaming">{friend.matches}+</p>
              </GlassCard>
            </motion.div>
          )}

          {/* Achievement Points */}
          {(friend.achievementPoints ?? 0) > 0 && (
            <motion.div variants={fadeInUp}>
              <GlassCard className="p-3" hover={false}>
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3.5 h-3.5 text-[#4ECDC4]" />
                  <span className="text-[10px] text-[#94A3B8]">Achievement Pts</span>
                </div>
                <p className="text-lg font-bold text-[#4ECDC4] font-gaming">{friend.achievementPoints}+</p>
              </GlassCard>
            </motion.div>
          )}

          {/* Friend Since */}
          <motion.div variants={fadeInUp}>
            <GlassCard className="p-3" hover={false}>
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span className="text-[10px] text-[#94A3B8]">Friend Since</span>
              </div>
              <p className="text-sm font-medium text-[#00F0FF]">{friend.friendSince || '-'}</p>
            </GlassCard>
          </motion.div>
        </div>
      </motion.section>

      {/* Friendship Duration */}
      {duration && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div
            className="rounded-2xl p-4 border border-[#FFD700]/20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.05), rgba(255,107,107,0.05))',
              boxShadow: '0 0 20px rgba(255,215,0,0.06)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#FFD700]" />
              <h3 className="text-sm font-bold text-[#FFD700] font-gaming">Friendship Duration</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Years', value: duration.years },
                { label: 'Months', value: duration.months },
                { label: 'Days', value: duration.days },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="text-center p-2.5 rounded-xl"
                  style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.15)' }}
                >
                  <p className="text-2xl font-bold text-[#FFD700] font-gaming">{value}</p>
                  <p className="text-[10px] text-[#94A3B8]">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-[#64748B] mt-2">{duration.totalDays}+ days together</p>
          </div>
        </motion.section>
      )}

      {/* Notes */}
      {friend.notes && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard className="p-4" hover={false}>
            <h3 className="text-sm font-bold text-[#00F0FF] mb-2 font-gaming">Notes</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">{friend.notes}</p>
          </GlassCard>
        </motion.section>
      )}

      {/* Gallery */}
      {friend.gallery && friend.gallery.length > 0 && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-4" hover={false}>
            <h3 className="text-sm font-bold text-[#00F0FF] mb-3 font-gaming">Gallery ({friend.gallery.length})</h3>
            <div className="grid grid-cols-3 gap-2">
              {friend.gallery.map((img, i) => (
                <motion.div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden border border-[#00F0FF]/15"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={img} alt={`Memory ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Achievements */}
      {friend.achievements && friend.achievements.length > 0 && (
        <motion.section
          className="px-5 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <GlassCard className="p-4" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-[#FFD700]" />
              <h3 className="text-sm font-bold text-[#FFD700] font-gaming">Achievements</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {friend.achievements.map((a, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-[#FFD700]/10 text-[#FFD700] text-xs border border-[#FFD700]/20"
                >
                  {a}
                </span>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      )}

      {/* Memories */}
      {friend.memories && friend.memories.length > 0 && (
        <motion.section
          className="px-5 mt-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <GlassCard className="p-4" hover={false}>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-[#B829DD]" />
              <h3 className="text-sm font-bold text-[#B829DD] font-gaming">Memories</h3>
            </div>
            <div className="space-y-3">
              {friend.memories.map((memory) => (
                <div key={memory.id} className="p-3 rounded-xl bg-[#070B14]/60 border border-[#00F0FF]/10">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{memory.title}</p>
                    <span className="text-[10px] text-[#64748B]">{memory.date}</span>
                  </div>
                  <p className="text-xs text-[#94A3B8]">{memory.description}</p>
                  {memory.image && (
                    <img src={memory.image} alt={memory.title} className="mt-2 rounded-xl w-full h-32 object-cover" loading="lazy" />
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.section>
      )}
    </div>
  );
}
