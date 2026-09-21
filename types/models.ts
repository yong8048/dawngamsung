export type CafeType = "일반" | "무인";
export type Parking = "가능" | "불가" | "";
export type Toilet = "있음" | "없음" | "";
export type ReportStatus = "pending" | "approved" | "rejected";

export interface Store {
  id: string;
  name: string;
  type: CafeType;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  parking: Parking;
  toilet: Toilet;
  googlePlaceId?: string;
  createdAt: number;
  updatedAt: number;
}

export type StoreInput = Omit<Store, "id" | "createdAt" | "updatedAt">;

export interface Report {
  id: string;
  name: string;
  type: CafeType | "";
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  parking: Parking;
  toilet: Toilet;
  additional: string;
  status: ReportStatus;
  createdAt: number;
}

export type ReportInput = Omit<Report, "id" | "status" | "createdAt">;

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  favorites: string[];
}

export interface UpdateMeta {
  ymd: string;
}

export const emptyStoreInput = (): StoreInput => ({
  name: "",
  type: "일반",
  address: "",
  latitude: 0,
  longitude: 0,
  phone: "",
  parking: "",
  toilet: "",
  googlePlaceId: "",
});

export const emptyReportInput = (): ReportInput => ({
  name: "",
  type: "",
  address: "",
  latitude: 0,
  longitude: 0,
  phone: "",
  parking: "",
  toilet: "",
  additional: "",
});
