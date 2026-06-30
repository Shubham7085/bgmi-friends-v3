import { db } from '../firebase/config';
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  query, orderBy, writeBatch
} from 'firebase/firestore';
import type { ProfileData, SocialLinks, Friend, GalleryImage, SiteSettings } from '../types';

const COLLECTIONS = {
  PROFILE: 'profile',
  SOCIAL: 'social',
  FRIENDS: 'friends',
  CLAN: 'clan',
  SQUAD: 'squad',
  GALLERY: 'gallery',
  SETTINGS: 'settings',
  MEMORIES: 'memories',
};

const CLOUDINARY_CLOUD_NAME = 'dgvjl4d04';
const CLOUDINARY_UPLOAD_PRESET = 'bgmi_friends';

// Profile
export async function getProfile(): Promise<ProfileData | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.PROFILE, 'main'));
  return snap.exists() ? (snap.data() as ProfileData) : null;
}

export async function updateProfile(data: Partial<ProfileData>) {
  await setDoc(doc(db, COLLECTIONS.PROFILE, 'main'), data, { merge: true });
}

// Social Links
export async function getSocialLinks(): Promise<SocialLinks | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SOCIAL, 'links'));
  return snap.exists() ? (snap.data() as SocialLinks) : null;
}

export async function updateSocialLinks(data: Partial<SocialLinks>) {
  await setDoc(doc(db, COLLECTIONS.SOCIAL, 'links'), data, { merge: true });
}

// Friends
export async function getFriends(): Promise<Friend[]> {
  const q = query(collection(db, COLLECTIONS.FRIENDS), orderBy('synergy', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Friend));
}

export async function addFriend(friend: Omit<Friend, 'id'>): Promise<string> {
  const docRef = doc(collection(db, COLLECTIONS.FRIENDS));
  await setDoc(docRef, friend);
  return docRef.id;
}

export async function updateFriend(id: string, data: Partial<Friend>) {
  await updateDoc(doc(db, COLLECTIONS.FRIENDS, id), data);
}

export async function deleteFriend(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.FRIENDS, id));
}


// Gallery
export async function getGallery(): Promise<GalleryImage[]> {
  const q = query(collection(db, COLLECTIONS.GALLERY), orderBy('date', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage));
}

export async function addGalleryImage(image: Omit<GalleryImage, 'id'>) {
  const docRef = doc(collection(db, COLLECTIONS.GALLERY));
  await setDoc(docRef, image);
  return docRef.id;
}

export async function deleteGalleryImage(id: string) {
  await deleteDoc(doc(db, COLLECTIONS.GALLERY, id));
}

// Settings
export async function getSettings(): Promise<SiteSettings | null> {
  const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'site'));
  return snap.exists() ? (snap.data() as SiteSettings) : null;
}

export async function updateSettings(data: Partial<SiteSettings>) {
  await setDoc(doc(db, COLLECTIONS.SETTINGS, 'site'), data, { merge: true });
}

// Image upload via Cloudinary (unsigned upload)
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Cloudinary upload failed: ${errText}`);
  }

  const data = await response.json();
  if (!data.secure_url) {
    throw new Error('Cloudinary returned no secure_url');
  }
  return data.secure_url as string;
}

// Initialize default data
export async function initializeDefaultData() {
  const batch = writeBatch(db);

  const profileRef = doc(db, COLLECTIONS.PROFILE, 'main');
  const profileSnap = await getDoc(profileRef);
  if (!profileSnap.exists()) {
    batch.set(profileRef, {
      realName: '',
      ign: '',
      bgmiId: '',
      collectionLevel: 0,
      accountLevel: 0,
      popularity: 0,
      likes: 0,
      currentTier: 'Bronze',
      highestTier: 'Bronze',
      favoriteWeapon: '',
      favoriteMap: '',
      favoriteMode: '',
      playingSince: '',
      country: '',
      state: '',
      aboutMe: '',
      profilePhoto: '',
      coverBanner: '',
      heroBackground: '',
    });
  }

  const socialRef = doc(db, COLLECTIONS.SOCIAL, 'links');
  const socialSnap = await getDoc(socialRef);
  if (!socialSnap.exists()) {
    batch.set(socialRef, {
      instagram: '',
      youtube: '',
      facebook: '',
      discord: '',
    });
  }

  const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'site');
  const settingsSnap = await getDoc(settingsRef);
  if (!settingsSnap.exists()) {
    batch.set(settingsRef, {
      siteName: 'BGMI Friends Vault',
      siteLogo: '',
      loadingText: 'BGMI FRIENDS VAULT',
      loadingSubtitle: 'Every Friend Has A Story',
      themeColors: {
        primary: '#00F0FF',
        secondary: '#B829DD',
        accent: '#FFD700',
      },
    });
  }

  await batch.commit();
}

        
