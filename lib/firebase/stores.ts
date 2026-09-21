import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { COLLECTIONS, META_UPDATE_ID } from "@/lib/firebase/collections";
import { getFirebaseDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/config";
import { MOCK_STORES } from "@/lib/mock-stores";
import type { Store, StoreInput, UpdateMeta } from "@/types/models";

const toStore = (id: string, data: Record<string, unknown>): Store => ({
  id,
  name: String(data.name ?? ""),
  type: data.type === "무인" ? "무인" : "일반",
  address: String(data.address ?? ""),
  latitude: Number(data.latitude ?? 0),
  longitude: Number(data.longitude ?? 0),
  phone: String(data.phone ?? ""),
  parking: data.parking === "가능" || data.parking === "불가" ? data.parking : "",
  toilet: data.toilet === "있음" || data.toilet === "없음" ? data.toilet : "",
  googlePlaceId: data.googlePlaceId ? String(data.googlePlaceId) : "",
  createdAt: Number(data.createdAt ?? 0),
  updatedAt: Number(data.updatedAt ?? 0),
});

const todayYmd = () => {
  const date = new Date();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export const getStores = async (): Promise<Store[]> => {
  if (!isFirebaseConfigured) return MOCK_STORES;
  const db = getFirebaseDb();
  if (!db) return MOCK_STORES;
  const snapshot = await getDocs(collection(db, COLLECTIONS.stores));
  return snapshot.docs.map(item => toStore(item.id, item.data()));
};

export const createStore = async (input: StoreInput) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  const now = Date.now();
  const payload = { ...input, createdAt: now, updatedAt: now };
  const ref = await addDoc(collection(db, COLLECTIONS.stores), payload);
  await setDoc(doc(db, COLLECTIONS.meta, META_UPDATE_ID), { ymd: todayYmd() });
  return ref.id;
};

export const updateStore = async (id: string, input: StoreInput) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  await updateDoc(doc(db, COLLECTIONS.stores, id), { ...input, updatedAt: Date.now() });
  await setDoc(doc(db, COLLECTIONS.meta, META_UPDATE_ID), { ymd: todayYmd() });
};

export const deleteStore = async (id: string) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  await deleteDoc(doc(db, COLLECTIONS.stores, id));
};

export const getUpdateMeta = async (): Promise<UpdateMeta | null> => {
  if (!isFirebaseConfigured) return { ymd: todayYmd() };
  const db = getFirebaseDb();
  if (!db) return null;
  const snapshot = await getDoc(doc(db, COLLECTIONS.meta, META_UPDATE_ID));
  if (!snapshot.exists()) return null;
  return snapshot.data() as UpdateMeta;
};
