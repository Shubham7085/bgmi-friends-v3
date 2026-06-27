import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Users, Trophy, Image, Settings,
  Save, Plus, Trash2, Upload, LogOut, Globe, Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getProfile, updateProfile, getSocialLinks, updateSocialLinks,
  getFriends, addFriend, updateFriend, deleteFriend,
  getClan, updateClan, getSquad, updateSquad,
  getGallery, addGalleryImage, deleteGalleryImage,
  getSettings, updateSettings, uploadImage, initializeDefaultData
} from '../data/firebaseService';
import type { ProfileData, SocialLinks, Friend, ClanData, SquadData, GalleryImage, SiteSettings, PartnerData } from '../types';
import GlassCard from '../components/ui/GlassCard';
import { getKdColor, getKdDot, formatKd } from '../utils/kdColor';

type AdminTab = 'profile' | 'partner' | 'friends' | 'clan' | 'squad' | 'gallery' | 'social' | 'settings';

const tabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: 'profile',  label: 'Profile',  icon: User },
  { id: 'partner',  label: 'Partner',  icon: Heart },
  { id: 'friends',  label: 'Friends',  icon: Users },
  { id: 'clan',     label: 'Clan',     icon: Trophy },
  { id: 'squad',    label: 'Squad',    icon: Users },
  { id: 'gallery',  label: 'Gallery',  icon: Image },
  { id: 'social',   label: 'Social',   icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const BADGE_OPTIONS = [
  { id: 'verified', label: '✔ Verified Player' },
  { id: 'elite',    label: '👑 Elite Player' },
  { id: 'partner',  label: '❤️ Partner' },
  { id: 'popular',  label: '⭐ Popular Player' },
];

const DEFAULT_PARTNER: PartnerData = {
  name: '', uid: '', photo: '', kd: 0, synergy: 0,
  relationshipStatus: '', playingTogetherSince: '', isOnline: false,
};

export default function AdminPage() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('profile');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [social, setSocial] = useState<Partial<SocialLinks>>({});
  const [friends, setFriends] = useState<Friend[]>([]);
  const [clan, setClan] = useState<Partial<ClanData>>({});
  const [squad, setSquad] = useState<Partial<SquadData>>({});
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [settings, setSettings] = useState<Partial<SiteSettings>>({});
  const [partner, setPartner] = useState<PartnerData>(DEFAULT_PARTNER);

  const [uploadingFriendPhoto, setUploadingFriendPhoto] = useState(false);
  const [uploadingPartnerPhoto, setUploadingPartnerPhoto] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);
  const [showFriendForm, setShowFriendForm] = useState(false);
  const [friendForm, setFriendForm] = useState<Partial<Friend>>({});

  useEffect(() => {
    if (!isAdmin) { navigate('/login'); return; }
    loadAllData();
  }, [isAdmin]);

  const loadAllData = async () => {
    try {
      await initializeDefaultData();
      const [p, s, f, c, sq, g, st] = await Promise.all([
        getProfile(), getSocialLinks(), getFriends(),
        getClan(), getSquad(), getGallery(), getSettings()
      ]);
      if (p) { setProfile(p); if (p.partner) setPartner({ ...DEFAULT_PARTNER, ...p.partner }); }
      if (s) setSocial(s);
      if (f) setFriends(f);
      if (c) setClan(c);
      if (sq) setSquad(sq);
      if (g) setGallery(g);
      if (st) setSettings(st);
    } catch (e) {
      console.error(e);
      showMessage('Error loading data.');
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profile);
      showMessage('Profile saved!');
    } catch { showMessage('Error saving profile'); }
    finally { setSaving(false); }
  };

  const handleSavePartner = async () => {
    setSaving(true);
    try {
      await updateProfile({ partner });
      setProfile(prev => ({ ...prev, partner }));
      showMessage('Partner saved!');
    } catch { showMessage('Error saving partner'); }
    finally { setSaving(false); }
  };

  const handleSaveSocial = async () => {
    setSaving(true);
    try {
      await updateSocialLinks(social);
      showMessage('Social links saved!');
    } catch { showMessage('Error saving social links'); }
    finally { setSaving(false); }
  };

  const handleSaveClan = async () => {
    setSaving(true);
    try {
      await updateClan(clan);
      showMessage('Clan saved!');
    } catch { showMessage('Error saving clan'); }
    finally { setSaving(false); }
  };

  const handleSaveSquad = async () => {
    setSaving(true);
    try {
      await updateSquad(squad);
      showMessage('Squad saved!');
    } catch { showMessage('Error saving squad'); }
    finally { setSaving(false); }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showMessage('Settings saved!');
    } catch { showMessage('Error saving settings'); }
    finally { setSaving(false); }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (field.startsWith('profile.')) {
        const key = field.replace('profile.', '') as keyof ProfileData;
        setProfile(prev => ({ ...prev, [key]: url }));
        await updateProfile({ [key]: url });
      } else if (field.startsWith('clan.')) {
        const key = field.replace('clan.', '') as keyof ClanData;
        setClan(prev => ({ ...prev, [key]: url }));
        await updateClan({ [key]: url });
      }
      showMessage('Image uploaded!');
    } catch { showMessage('Upload failed.'); }
    finally { setUploading(false); }
  };

  const handlePartnerPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingPartnerPhoto(true);
    try {
      const url = await uploadImage(file);
      setPartner(prev => ({ ...prev, photo: url }));
      showMessage('Partner photo uploaded!');
    } catch { showMessage('Upload failed.'); }
    finally { setUploadingPartnerPhoto(false); }
  };

  const handleFriendPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploadingFriendPhoto(true);
    try {
      const url = await uploadImage(file);
      setFriendForm(prev => ({ ...prev, profilePhoto: url }));
      showMessage('Photo uploaded!');
    } catch { showMessage('Upload failed.'); }
    finally { setUploadingFriendPhoto(false); }
  };

  const handleAddFriend = async () => {
    if (!friendForm.ign) { showMessage('IGN is required'); return; }
    setSaving(true);
    try {
      const newFriend: Omit<Friend, 'id'> = {
        realName: friendForm.realName || '',
        ign: friendForm.ign || '',
        bgmiId: friendForm.bgmiId || '',
        collectionLevel: friendForm.collectionLevel || 0,
        accountLevel: friendForm.accountLevel || 0,
        kd: friendForm.kd || 0,
        matches: friendForm.matches || 0,
        achievementPoints: friendForm.achievementPoints || 0,
        badges: friendForm.badges || [],
        friendSince: friendForm.friendSince || '',
        synergy: friendForm.synergy || 0,
        favoriteWeapon: '', favoriteMap: '', favoriteMode: '',
        profilePhoto: friendForm.profilePhoto || '',
        coverBanner: friendForm.coverBanner || '',
        isOnline: friendForm.isOnline || false,
        notes: friendForm.notes || '',
        memories: [], gallery: [], achievements: [],
      };
      await addFriend(newFriend);
      setShowFriendForm(false);
      setFriendForm({});
      setFriends(await getFriends());
      showMessage('Friend added!');
    } catch (e) { console.error(e); showMessage('Error adding friend'); }
    finally { setSaving(false); }
  };

  const handleUpdateFriend = async () => {
    if (!editingFriend) return;
    setSaving(true);
    try {
      await updateFriend(editingFriend.id, friendForm);
      setEditingFriend(null);
      setFriendForm({});
      setShowFriendForm(false);
      setFriends(await getFriends());
      showMessage('Friend updated!');
    } catch (e) { console.error(e); showMessage('Error updating friend'); }
    finally { setSaving(false); }
  };

  const handleDeleteFriend = async (id: string) => {
    if (!confirm('Delete this friend?')) return;
    try {
      await deleteFriend(id);
      setFriends(prev => prev.filter(f => f.id !== id));
      showMessage('Friend deleted');
    } catch { showMessage('Error deleting friend'); }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setUploading(true);
    try {
      const url = await uploadImage(file);
      const caption = file.name.replace(/\.[^/.]+$/, '');
      const date = new Date().toISOString().split('T')[0];
      const id = await addGalleryImage({ url, caption, date });
      setGallery(prev => [{ id, url, caption, date }, ...prev]);
      showMessage('Image added!');
    } catch { showMessage('Upload failed.'); }
    finally { setUploading(false); }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await deleteGalleryImage(id);
      setGallery(prev => prev.filter(g => g.id !== id));
      showMessage('Image deleted');
    } catch { showMessage('Error deleting image'); }
  };

  const toggleBadge = (badgeId: string) => {
    const current = profile.badges ?? [];
    const updated = current.includes(badgeId)
      ? current.filter(b => b !== badgeId)
      : [...current, badgeId];
    setProfile(prev => ({ ...prev, badges: updated }));
  };

  const toggleFriendBadge = (badgeId: string) => {
    const current = friendForm.badges ?? [];
    const updated = current.includes(badgeId)
      ? current.filter(b => b !== badgeId)
      : [...current, badgeId];
    setFriendForm(prev => ({ ...prev, badges: updated }));
  };

  const openEditFriend = (friend: Friend) => {
    setEditingFriend(friend);
    setFriendForm({ ...friend });
    setShowFriendForm(true);
  };

  const openAddFriend = () => {
    setEditingFriend(null);
    setFriendForm({});
    setShowFriendForm(true);
  };

  if (!isAdmin) return null;

  const inputClass = "w-full px-3 py-2.5 input-gaming rounded-xl text-sm";
  const labelClass = "text-xs text-[#94A3B8] mb-1 block";

  return (
    <div className="pb-24 pt-16 px-5 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white font-gaming">Admin Panel</h1>
            <p className="text-xs text-[#94A3B8]">Manage your vault</p>
          </div>
          <button onClick={() => logout()} className="w-10 h-10 glass-card flex items-center justify-center">
            <LogOut className="w-4 h-4 text-[#94A3B8]" />
          </button>
        </div>
      </motion.div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-xl bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-[#00F0FF] text-xs"
        >
          {message}
        </motion.div>
      )}

      {uploading && (
        <div className="mb-4 p-3 rounded-xl bg-[#B829DD]/10 border border-[#B829DD]/30 text-[#B829DD] text-xs flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-[#B829DD] border-t-transparent rounded-full animate-spin" />
          Uploading to Cloudinary…
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00F0FF]/15 text-[#00F0FF] border border-[#00F0FF]/30'
                  : 'bg-[#111827]/60 text-[#94A3B8] border border-[#00F0FF]/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* ── Profile Tab ── */}
        {activeTab === 'profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Profile Settings</h3>
              <div className="space-y-4">

                {/* Photos */}
                {[
                  { label: 'Profile Photo', field: 'profile.profilePhoto', key: 'profilePhoto' as keyof ProfileData },
                  { label: 'Cover Banner',  field: 'profile.coverBanner',  key: 'coverBanner'  as keyof ProfileData },
                  { label: 'Hero Background', field: 'profile.heroBackground', key: 'heroBackground' as keyof ProfileData },
                ].map(({ label, field, key }) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <div className="flex items-center gap-3">
                      {profile[key] && (
                        <img src={profile[key] as string} className="w-12 h-12 rounded-xl object-cover border border-[#00F0FF]/20" alt={label} />
                      )}
                      <label className={`flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload className="w-3.5 h-3.5" />
                        Upload
                        <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleImageUpload(e, field)} />
                      </label>
                    </div>
                  </div>
                ))}

                {/* Text / number fields */}
                {[
                  ['Real Name',         'realName',          'text'],
                  ['In-Game Name',      'ign',               'text'],
                  ['BGMI ID',           'bgmiId',            'text'],
                  ['Collection Level',  'collectionLevel',   'number'],
                  ['Account Level',     'accountLevel',      'number'],
                  ['KD Ratio',          'kd',                'float'],
                  ['Matches',           'matches',           'number'],
                  ['Achievement Points','achievementPoints', 'number'],
                  ['Popularity',        'popularity',        'number'],
                  ['Likes',             'likes',             'number'],
                  ['Current Tier',      'currentTier',       'text'],
                  ['Highest Tier',      'highestTier',       'text'],
                  ['Playing Since',     'playingSince',      'text'],
                  ['Country',           'country',           'text'],
                  ['State',             'state',             'text'],
                ].map(([label, field, type]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input
                      type={type === 'float' ? 'number' : type as string}
                      step={type === 'float' ? '0.01' : undefined}
                      value={(profile as any)[field] ?? ''}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        [field]: type === 'float'
                          ? parseFloat(e.target.value) || 0
                          : type === 'number'
                            ? parseInt(e.target.value) || 0
                            : e.target.value,
                      }))}
                      className={inputClass}
                      placeholder={type === 'float' ? '0.00' : ''}
                    />
                  </div>
                ))}

                <div>
                  <label className={labelClass}>About Me</label>
                  <textarea
                    value={profile.aboutMe || ''}
                    onChange={(e) => setProfile(prev => ({ ...prev, aboutMe: e.target.value }))}
                    className={`${inputClass} min-h-[100px] resize-none`}
                  />
                </div>

                {/* Badges */}
                <div>
                  <label className={labelClass}>Badges</label>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_OPTIONS.map(b => {
                      const active = (profile.badges ?? []).includes(b.id);
                      return (
                        <button
                          key={b.id}
                          type="button"
                          onClick={() => toggleBadge(b.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            active
                              ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40'
                              : 'bg-[#111827]/60 text-[#94A3B8] border-[#00F0FF]/10'
                          }`}
                        >
                          {b.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleSaveProfile} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Partner Tab ── */}
        {activeTab === 'partner' && (
          <motion.div key="partner" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4" style={{ border: '1px solid rgba(244,63,94,0.3)' } as React.CSSProperties}>
              <h3 className="text-sm font-bold mb-4 font-gaming" style={{ color: '#F43F5E' }}>❤️ Partner Settings</h3>
              <div className="space-y-4">

                {/* Partner Photo */}
                <div>
                  <label className={labelClass}>Partner Photo</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#F43F5E]/30 bg-gradient-to-br from-[#F43F5E]/10 to-[#A855F7]/10 flex items-center justify-center shrink-0">
                      {partner.photo ? (
                        <img src={partner.photo} alt="Partner" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-5 h-5 text-[#64748B]" />
                      )}
                    </div>
                    <div>
                      <label className={`flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer w-fit ${uploadingPartnerPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                        {uploadingPartnerPhoto ? (
                          <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading…</>
                        ) : (
                          <><Upload className="w-3.5 h-3.5" />{partner.photo ? 'Change' : 'Upload'}</>
                        )}
                        <input type="file" accept="image/*" className="hidden" disabled={uploadingPartnerPhoto} onChange={handlePartnerPhotoUpload} />
                      </label>
                      {partner.photo && (
                        <button type="button" onClick={() => setPartner(prev => ({ ...prev, photo: '' }))} className="mt-1 text-[10px] text-red-400">
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Partner text / number fields */}
                {[
                  ['Partner Name',            'name',                 'text'],
                  ['Partner UID',             'uid',                  'text'],
                  ['KD+',                     'kd',                   'float'],
                  ['Synergy+',                'synergy',              'number'],
                  ['Relationship Status',     'relationshipStatus',   'text'],
                  ['Playing Together Since',  'playingTogetherSince', 'text'],
                ].map(([label, field, type]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input
                      type={type === 'float' ? 'number' : type as string}
                      step={type === 'float' ? '0.01' : undefined}
                      value={(partner as any)[field] ?? ''}
                      onChange={(e) => setPartner(prev => ({
                        ...prev,
                        [field]: type === 'float'
                          ? parseFloat(e.target.value) || 0
                          : type === 'number'
                            ? parseInt(e.target.value) || 0
                            : e.target.value,
                      }))}
                      className={inputClass}
                      placeholder={type === 'float' ? '0.00' : field === 'playingTogetherSince' ? 'YYYY-MM-DD' : ''}
                    />
                  </div>
                ))}

                {/* Online status */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#070B14]/60 border border-[#00F0FF]/10">
                  <span className="text-sm text-[#E2E8F0]">Partner Online Status</span>
                  <button
                    type="button"
                    onClick={() => setPartner(prev => ({ ...prev, isOnline: !prev.isOnline }))}
                    className={`w-12 h-6 rounded-full transition-all relative ${partner.isOnline ? 'bg-green-500' : 'bg-[#374151]'}`}
                  >
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                      style={{ left: partner.isOnline ? '28px' : '4px' }}
                    />
                  </button>
                </div>

                <button onClick={handleSavePartner} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Partner'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Friends Tab ── */}
        {activeTab === 'friends' && (
          <motion.div key="friends" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#00F0FF] font-gaming">Friends ({friends.length})</h3>
              <button onClick={openAddFriend} className="flex items-center gap-2 px-3 py-1.5 rounded-xl btn-primary text-xs">
                <Plus className="w-3.5 h-3.5" />
                Add Friend
              </button>
            </div>

            {showFriendForm && (
              <GlassCard className="p-4 mb-4">
                <h4 className="text-sm font-bold text-white mb-3">{editingFriend ? 'Edit Friend' : 'Add Friend'}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Real Name',          'realName',          'text'],
                    ['IGN *',              'ign',               'text'],
                    ['BGMI ID',            'bgmiId',            'text'],
                    ['Collection Level',   'collectionLevel',   'number'],
                    ['Account Level',      'accountLevel',      'number'],
                    ['KD Ratio',           'kd',                'float'],
                    ['Matches',            'matches',           'number'],
                    ['Achievement Points', 'achievementPoints', 'number'],
                    ['Synergy',            'synergy',           'number'],
                    ['Friend Since',       'friendSince',       'text'],
                  ].map(([label, field, type]) => (
                    <div key={field}>
                      <label className={labelClass}>{label}</label>
                      <input
                        type={type === 'float' ? 'number' : type as string}
                        step={type === 'float' ? '0.01' : undefined}
                        value={(friendForm as any)[field] ?? ''}
                        onChange={(e) => setFriendForm(prev => ({
                          ...prev,
                          [field]: type === 'float'
                            ? parseFloat(e.target.value) || 0
                            : type === 'number'
                              ? parseInt(e.target.value) || 0
                              : e.target.value,
                        }))}
                        className={inputClass}
                        placeholder={type === 'float' ? '0.00' : ''}
                      />
                    </div>
                  ))}

                  {/* Profile Photo */}
                  <div className="col-span-2">
                    <label className={labelClass}>Profile Photo</label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#00F0FF]/20 shrink-0 bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                        {friendForm.profilePhoto ? (
                          <img src={friendForm.profilePhoto} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Upload className="w-5 h-5 text-[#64748B]" />
                        )}
                      </div>
                      <div>
                        <label className={`flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer w-fit ${uploadingFriendPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingFriendPhoto ? (
                            <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Uploading…</>
                          ) : (
                            <><Upload className="w-3.5 h-3.5" />{friendForm.profilePhoto ? 'Change' : 'Upload'}</>
                          )}
                          <input type="file" accept="image/*" className="hidden" disabled={uploadingFriendPhoto} onChange={handleFriendPhotoUpload} />
                        </label>
                        {friendForm.profilePhoto && (
                          <button type="button" onClick={() => setFriendForm(prev => ({ ...prev, profilePhoto: '' }))} className="mt-1 text-[10px] text-red-400">
                            Remove photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="col-span-2">
                    <label className={labelClass}>Badges</label>
                    <div className="flex flex-wrap gap-2">
                      {BADGE_OPTIONS.map(b => {
                        const active = (friendForm.badges ?? []).includes(b.id);
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => toggleFriendBadge(b.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                              active
                                ? 'bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/40'
                                : 'bg-[#111827]/60 text-[#94A3B8] border-[#00F0FF]/10'
                            }`}
                          >
                            {b.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Online toggle */}
                  <div className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-[#070B14]/60 border border-[#00F0FF]/10">
                    <span className="text-sm text-[#E2E8F0]">Online Status</span>
                    <button
                      type="button"
                      onClick={() => setFriendForm(prev => ({ ...prev, isOnline: !prev.isOnline }))}
                      className={`w-12 h-6 rounded-full transition-all relative ${friendForm.isOnline ? 'bg-green-500' : 'bg-[#374151]'}`}
                    >
                      <span
                        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all"
                        style={{ left: friendForm.isOnline ? '28px' : '4px' }}
                      />
                    </button>
                  </div>

                  {/* Notes */}
                  <div className="col-span-2">
                    <label className={labelClass}>Notes</label>
                    <textarea
                      value={friendForm.notes || ''}
                      onChange={(e) => setFriendForm(prev => ({ ...prev, notes: e.target.value }))}
                      className={`${inputClass} min-h-[60px] resize-none`}
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { setShowFriendForm(false); setEditingFriend(null); setFriendForm({}); }}
                    className="flex-1 py-2 rounded-xl bg-[#111827]/60 text-[#94A3B8] text-xs border border-[#00F0FF]/10"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingFriend ? handleUpdateFriend : handleAddFriend}
                    disabled={saving || uploadingFriendPhoto}
                    className="flex-1 py-2 rounded-xl btn-primary text-xs font-medium disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : uploadingFriendPhoto ? 'Uploading…' : editingFriend ? 'Update' : 'Add'}
                  </button>
                </div>
              </GlassCard>
            )}

            <div className="space-y-2">
              {friends.length === 0 && (
                <p className="text-center text-xs text-[#64748B] py-8">No friends yet. Add your first friend!</p>
              )}
              {friends.map(friend => {
                const kd = friend.kd ?? 0;
                const kdColor = getKdColor(kd);
                return (
                  <GlassCard key={friend.id} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#00F0FF]/20 shrink-0">
                        {friend.profilePhoto ? (
                          <img src={friend.profilePhoto} alt={friend.ign} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#00F0FF]/10 to-[#B829DD]/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-[#00F0FF]/50">{friend.ign?.[0] || '?'}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{friend.ign}</p>
                        <p className="text-[10px] text-[#94A3B8]">
                          {friend.synergy}+ SYN ·{' '}
                          <span style={{ color: kdColor }}>{getKdDot(kd)} {formatKd(kd)}+ KD</span>
                          {friend.realName ? ` · ${friend.realName}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditFriend(friend)} className="w-8 h-8 rounded-lg bg-[#00F0FF]/10 flex items-center justify-center">
                          <Settings className="w-3.5 h-3.5 text-[#00F0FF]" />
                        </button>
                        <button onClick={() => handleDeleteFriend(friend.id)} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ── Clan Tab ── */}
        {activeTab === 'clan' && (
          <motion.div key="clan" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Clan Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Clan Logo</label>
                  <div className="flex items-center gap-3">
                    {clan.logo && <img src={clan.logo} className="w-12 h-12 rounded-xl object-cover border border-[#00F0FF]/20" alt="Clan" />}
                    <label className={`flex items-center gap-2 px-3 py-2 rounded-xl btn-primary text-xs cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-3.5 h-3.5" />Upload
                      <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleImageUpload(e, 'clan.logo')} />
                    </label>
                  </div>
                </div>
                <div><label className={labelClass}>Clan Name</label><input type="text" value={clan.name || ''} onChange={(e) => setClan(prev => ({ ...prev, name: e.target.value }))} className={inputClass} /></div>
                <div><label className={labelClass}>Members</label><input type="number" value={clan.members || 0} onChange={(e) => setClan(prev => ({ ...prev, members: parseInt(e.target.value) || 0 }))} className={inputClass} /></div>
                <div><label className={labelClass}>Description</label><textarea value={clan.description || ''} onChange={(e) => setClan(prev => ({ ...prev, description: e.target.value }))} className={`${inputClass} min-h-[80px] resize-none`} /></div>
                <button onClick={handleSaveClan} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Clan'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Squad Tab ── */}
        {activeTab === 'squad' && (
          <motion.div key="squad" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Squad Settings</h3>
              <div className="space-y-4">
                <div><label className={labelClass}>Squad Name</label><input type="text" value={squad.name || ''} onChange={(e) => setSquad(prev => ({ ...prev, name: e.target.value }))} className={inputClass} /></div>
                <button onClick={handleSaveSquad} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Squad'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Gallery Tab ── */}
        {activeTab === 'gallery' && (
          <motion.div key="gallery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#00F0FF] font-gaming">Gallery ({gallery.length})</h3>
              <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl btn-primary text-xs cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <Upload className="w-3.5 h-3.5" />{uploading ? 'Uploading...' : 'Upload'}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleGalleryUpload} />
              </label>
            </div>
            {gallery.length === 0 && <p className="text-center text-xs text-[#64748B] py-8">No gallery images yet.</p>}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {gallery.map(img => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-[#00F0FF]/10 group">
                  <img src={img.url} alt={img.caption} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-[#070B14]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => handleDeleteGallery(img.id)} className="w-8 h-8 rounded-lg bg-red-500/80 flex items-center justify-center">
                      <Trash2 className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <p className="absolute bottom-0 left-0 right-0 text-[10px] text-white bg-[#070B14]/70 px-2 py-1 truncate">{img.caption}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Social Tab ── */}
        {activeTab === 'social' && (
          <motion.div key="social" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Social Links</h3>
              <div className="space-y-4">
                {[['Instagram URL', 'instagram'], ['YouTube URL', 'youtube'], ['Facebook URL', 'facebook'], ['Discord URL', 'discord']].map(([label, field]) => (
                  <div key={field}>
                    <label className={labelClass}>{label}</label>
                    <input type="url" value={(social as any)[field] || ''} onChange={(e) => setSocial(prev => ({ ...prev, [field]: e.target.value }))} className={inputClass} placeholder="https://..." />
                  </div>
                ))}
                <button onClick={handleSaveSocial} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <GlassCard className="p-4">
              <h3 className="text-sm font-bold text-[#00F0FF] mb-4 font-gaming">Site Settings</h3>
              <div className="space-y-4">
                <div><label className={labelClass}>Site Name</label><input type="text" value={settings.siteName || ''} onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))} className={inputClass} /></div>
                <div><label className={labelClass}>Loading Text</label><input type="text" value={settings.loadingText || ''} onChange={(e) => setSettings(prev => ({ ...prev, loadingText: e.target.value }))} className={inputClass} /></div>
                <div><label className={labelClass}>Loading Subtitle</label><input type="text" value={settings.loadingSubtitle || ''} onChange={(e) => setSettings(prev => ({ ...prev, loadingSubtitle: e.target.value }))} className={inputClass} /></div>
                <button onClick={handleSaveSettings} disabled={saving} className="w-full py-2.5 rounded-xl btn-primary text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-60">
                  <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
