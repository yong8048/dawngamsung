import { arrayRemove, arrayUnion, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { UserProfile } from "@/types/models";

const toUser = (data: Record<string, unknown>, uid: string): UserProfile => ({
  uid,
  name: String(data.name ?? ""),
  email: String(data.email ?? ""),
  favorites: Array.isArray(data.favorites) ? data.favorites.map(String) : [],
});

export const ensureUser = async (profile: UserProfile) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  const ref = doc(db, COLLECTIONS.users, profile.uid);
  const existing = await getDoc(ref);
  if (!existing.exists()) {
    await setDoc(ref, profile);
    return profile;
  }
  return toUser(existing.data(), profile.uid);
};

export const getUser = async (uid: string) => {
  const db = getFirebaseDb();
  if (!db) return null;
  const snapshot = await getDoc(doc(db, COLLECTIONS.users, uid));
  if (!snapshot.exists()) return null;
  return toUser(snapshot.data(), uid);
};

export const toggleFavorite = async (uid: string, storeId: string, remove: boolean) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  await updateDoc(doc(db, COLLECTIONS.users, uid), {
    favorites: remove ? arrayRemove(storeId) : arrayUnion(storeId),
  });
  return getUser(uid);
};

export const getUserCount = async () => {
  const db = getFirebaseDb();
  if (!db) return 0;
  const snapshot = await getDocs(collection(db, COLLECTIONS.users));
  return snapshot.size;
};
