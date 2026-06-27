import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, X, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getFriends } from '../data/firebaseService';
import type { Friend } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { fadeInUp, staggerContainer } from '../utils/animations';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

type SortField = 'synergy' | 'collectionLevel' | 'kd' | 'friendSince' | 'ign';
type SortOrder = 'asc' | 'desc';

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('synergy');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getFriends()
      .then(setFriends)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredFriends = useMemo(() => {
    let result = [...friends];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.ign.toLowerCase().includes(q) ||
          f.realName.toLowerCase().includes(q) ||
          f.bgmiId.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'synergy':       cmp = (a.synergy || 0) - (b.synergy || 0); break;
        case 'collectionLevel': cmp = (a.collectionLevel || 0) - (b.collectionLevel || 0); break;
        case 'kd':            cmp = (a.kd || 0) - (b.kd || 0); break;
        case 'friendSince':   cmp = new Date(a.friendSince).getTime() - new Date(b.friendSince).getTime(); break;
        case 'ign':           cmp = a.ign.localeCompare(b.ign); break;
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });

    return result;
  }, [friends, searchQuery, sortField, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00F0FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const sortLabels: Record<SortField, string> = {
    synergy: 'Synergy',
    collectionLevel: 'Collection',
    kd: 'K/D',
    friendSince: 'Friend Since',
    ign: 'IGN',
  };

  return (
    <div className="pb-24 pt-16 px-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-xl font-bold text-white font-gaming mb-1">Friends</h1>
        <p className="text-xs text-[#94A3B8]">{friends.length} friends in your vault</p>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative mb-3"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          placeholder="Search by name, IGN, or BGMI ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-10 py-3 input-gaming rounded-xl text-sm"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-[#64748B]" />
          </button>
        )}
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 mb-4"
      >
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            showFilters
              ? 'bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30'
              : 'bg-[#111827]/60 text-[#94A3B8] border border-[#00F0FF]/10'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          Sort by: {sortLabels[sortField]}
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827]/60 text-[#94A3B8] border border-[#00F0FF]/10 text-xs font-medium"
        >
          {sortOrder === 'asc' ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />}
          {sortOrder === 'asc' ? 'Asc' : 'Desc'}
        </button>
      </motion.div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="flex flex-wrap gap-2 p-3 glass-card">
              {(Object.keys(sortLabels) as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => { setSortField(field); setShowFilters(false); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    sortField === field
                      ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                      : 'bg-[#070B14]/60 text-[#94A3B8] border border-[#00F0FF]/10'
                  }`}
                >
                  {sortLabels[field]}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredFriends.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16">
          <User className="w-12 h-12 text-[#64748B]/50 mb-3" />
          <p className="text-sm text-[#94A3B8]">
            {searchQuery ? 'No friends match your search' : 'No friends yet'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          {filteredFriends.map((friend) => {
            const kd = friend.kd ?? 0;
            const kdColor = getKdColor(kd);
            const kdDot = getKdDot(kd);

            return (
              <motion.div key={friend.id} variants={fadeInUp}>
                <GlassCard
                  className="p-4 cursor-pointer group"
                  onClick={() => navigate(`/friend/${friend.id}`)}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className="w-14 h-14 rounded-xl overflow-hidden border border-[#00F0FF]/20"
                        style={{ boxShadow: friend.isOnline ? '0 0 12px rgba(34,197,94,0.2)' : 'none' }}
                      >
                        {friend.profilePhoto ? (
                          <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-[#00F0FF]/50">{friend.ign[0]}</span>
                          </div>
                        )}
                      </div>
                      {friend.isOnline ? (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#070B14]" />
                      ) : (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#374151] border-2 border-[#070B14]" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-white truncate">{friend.ign}</h3>
                        <span className="text-[10px] bg-[#00F0FF]/10 text-[#00F0FF] px-1.5 py-0.5 rounded border border-[#00F0FF]/20 shrink-0">
                          Lv.{friend.collectionLevel || 0}+
                        </span>
                      </div>
                      <p className="text-xs text-[#94A3B8] truncate">{friend.realName}</p>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className="text-[10px] text-[#64748B]">ID: {friend.bgmiId}</span>
                        <span className="text-[10px] text-[#FFD700] font-medium">{friend.synergy}+ SYN</span>
                      </div>
                    </div>

                    {/* KD Badge */}
                    <div
                      className="shrink-0 flex flex-col items-center px-2.5 py-2 rounded-xl border"
                      style={{
                        background: `${kdColor}10`,
                        borderColor: `${kdColor}30`,
                      }}
                    >
                      <span className="text-base leading-none">{kdDot}</span>
                      <p className="text-xs font-bold font-gaming mt-0.5" style={{ color: kdColor }}>
                        {formatKd(kd)}+
                      </p>
                      <p className="text-[9px] text-[#64748B]">K/D</p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
