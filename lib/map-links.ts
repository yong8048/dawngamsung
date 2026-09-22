import type { Store } from "@/types/models";

export const naverMapUrl = (store: Pick<Store, "name" | "address" | "latitude" | "longitude">) => {
  const query = encodeURIComponent([store.name, store.address].filter(Boolean).join(" "));
  return `https://map.naver.com/p/search/${query}?c=${store.longitude},${store.latitude},16,0,0,0,dh`;
};

export const kakaoMapUrl = (store: Pick<Store, "name" | "latitude" | "longitude">) => {
  const name = encodeURIComponent(store.name || "카페");
  return `https://map.kakao.com/link/map/${name},${store.latitude},${store.longitude}`;
};
