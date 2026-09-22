import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase/collections";
import { getFirebaseDb } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/config";
import type { Report, ReportInput, CafeType } from "@/types/models";

const toReport = (id: string, data: Record<string, unknown>): Report => ({
  id,
  name: String(data.name ?? ""),
  type: data.type === "무인" || data.type === "일반" ? (data.type as CafeType) : "",
  address: String(data.address ?? ""),
  latitude: Number(data.latitude ?? 0),
  longitude: Number(data.longitude ?? 0),
  phone: String(data.phone ?? ""),
  parking: data.parking === "가능" || data.parking === "불가" ? data.parking : "",
  toilet: data.toilet === "있음" || data.toilet === "없음" ? data.toilet : "",
  additional: String(data.additional ?? ""),
  status: data.status === "approved" || data.status === "rejected" ? data.status : "pending",
  createdAt: Number(data.createdAt ?? 0),
});

export const getReports = async (): Promise<Report[]> => {
  if (!isFirebaseConfigured) return [];
  const db = getFirebaseDb();
  if (!db) return [];
  const snapshot = await getDocs(collection(db, COLLECTIONS.reports));
  return snapshot.docs
    .map(item => toReport(item.id, item.data()))
    .sort((a, b) => b.createdAt - a.createdAt);
};

export const createReport = async (input: ReportInput) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  const ref = await addDoc(collection(db, COLLECTIONS.reports), {
    ...input,
    status: "pending",
    createdAt: Date.now(),
  });
  await updateDoc(doc(db, COLLECTIONS.reports, ref.id), { id: ref.id });
  return ref.id;
};

export const deleteReport = async (id: string) => {
  const db = getFirebaseDb();
  if (!db) throw new Error("Firebase가 설정되지 않았습니다.");
  await deleteDoc(doc(db, COLLECTIONS.reports, id));
};

export const getReportCount = async () => {
  const reports = await getReports();
  return reports.filter(report => report.status === "pending").length;
};
