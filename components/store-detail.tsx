"use client";

import { useQuery } from "@tanstack/react-query";
import { getStoreImages } from "@/lib/firebase/images";
import { useSelectedStore } from "@/store/selected-store";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";
import { toggleFavorite } from "@/lib/firebase/users";
import { toast } from "sonner";
import { ImageSwiper } from "@/components/image-swiper";
import { kakaoMapUrl, naverMapUrl } from "@/lib/map-links";
import { FaPhone, FaStar, FaRegStar, FaCarSide, FaRestroom } from "react-icons/fa6";
import { LiaMapMarkerAltSolid } from "react-icons/lia";
import { FaRegCopy } from "react-icons/fa";
import { SiKakao, SiNaver } from "react-icons/si";

const rows = [
  { key: "address", label: "주소", icon: <LiaMapMarkerAltSolid size={20} />, copy: true },
  { key: "phone", label: "전화", icon: <FaPhone size={14} />, copy: true },
  { key: "parking", label: "주차", icon: <FaCarSide size={16} />, copy: false },
  { key: "toilet", label: "화장실", icon: <FaRestroom size={16} />, copy: false },
] as const;

export const StoreDetail = () => {
  const { store, images } = useSelectedStore();
  const { user, setUser } = useUserStore();
  const { setPanelOpen } = useUiStore();

  const { data: remoteImages } = useQuery({
    queryKey: ["store-images", store?.id],
    queryFn: () => getStoreImages(store!.id),
    enabled: Boolean(store?.id) && images.length === 0,
  });

  if (!store) return null;

  const photos = images.length ? images : remoteImages ?? [];
  const isFav = Boolean(user?.favorites.includes(store.id));

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    toast.success("복사되었습니다.");
  };

  const handleFav = async () => {
    if (!user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    const next = await toggleFavorite(user.uid, store.id, isFav);
    if (next) setUser(next);
    toast.success(isFav ? "즐겨찾기에서 뺐습니다." : "즐겨찾기에 넣었습니다.");
  };

  return (
    <section className="flex h-full flex-col overflow-y-auto">
      <div className="relative h-52 shrink-0 bg-panel-2">
        {photos.length ? (
          <ImageSwiper urls={photos} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted">
            <p className="text-4xl">☕</p>
            <p className="text-sm">아직 등록된 사진이 없습니다</p>
          </div>
        )}
        <button
          className="absolute top-3 right-3 hidden h-8 w-8 items-center justify-center rounded-full bg-panel/90 sm:flex"
          onClick={() => setPanelOpen(false)}
        >
          ×
        </button>
      </div>

      <div className="border-b border-line px-5 py-5 text-center">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-semibold">{store.name}</h2>
          <button onClick={handleFav} className={isFav ? "text-amber" : "text-muted"}>
            {isFav ? <FaStar /> : <FaRegStar />}
          </button>
        </div>
        <p className="mt-1 text-sm text-muted">{store.type} 카페 · 24시간</p>
      </div>

      <div className="px-2 py-2">
        {rows.map(row => {
          const value = store[row.key] || "정보 없음";
          return (
            <button
              key={row.key}
              className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left hover:bg-panel-2"
              onClick={() => row.copy && store[row.key] && copy(store[row.key])}
            >
              <span className="flex h-8 w-8 items-center justify-center text-amber">{row.icon}</span>
              <span className={store[row.key] ? "text-mist" : "text-muted"}>{value}</span>
              {row.copy && store[row.key] && <FaRegCopy className="ml-auto text-muted" size={14} />}
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-line px-5 py-5">
        <p className="mb-3 text-xs text-muted">다른 지도에서 보기</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={naverMapUrl(store)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-night px-3 py-3 text-sm font-medium hover:bg-panel-2"
          >
            <SiNaver className="text-[#03C75A]" size={14} />
            네이버지도
          </a>
          <a
            href={kakaoMapUrl(store)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl border border-line bg-night px-3 py-3 text-sm font-medium hover:bg-panel-2"
          >
            <SiKakao className="text-[#371D1E]" size={18} />
            카카오맵
          </a>
        </div>
      </div>
    </section>
  );
};
