"use client";

import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { StoreEditor } from "@/components/admin/store-editor";
import { ImageSwiper } from "@/components/image-swiper";
import { useStores } from "@/hooks/use-stores";
import { deleteStoreImage, getStoreImages } from "@/lib/firebase/images";
import { deleteStore, updateStore } from "@/lib/firebase/stores";
import { deleteStoreFolder } from "@/lib/firebase/images";
import type { CafeType, Store } from "@/types/models";

export default function AdminModifyPage() {
  const { stores } = useStores();
  const queryClient = useQueryClient();
  const [type, setType] = useState<"전체" | CafeType>("전체");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [keyword, setKeyword] = useState({ address: "", name: "" });
  const [selected, setSelected] = useState<Store | null>(null);

  const filtered = useMemo(() => {
    return stores.filter(store => {
      if (type !== "전체" && store.type !== type) return false;
      if (keyword.address && !store.address.includes(keyword.address)) return false;
      if (keyword.name && !store.name.includes(keyword.name)) return false;
      return true;
    });
  }, [keyword, stores, type]);

  const images = useQuery({
    queryKey: ["store-images", selected?.id],
    queryFn: () => getStoreImages(selected!.id),
    enabled: Boolean(selected),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="mb-6 text-2xl font-semibold">정보 수정</h1>
      <div className="mb-6 flex flex-wrap gap-3 rounded-3xl border border-white/10 bg-panel p-4">
        <select
          className="rounded-xl bg-night px-3 py-2"
          value={type}
          onChange={e => setType(e.target.value as typeof type)}
        >
          <option>전체</option>
          <option>일반</option>
          <option>무인</option>
        </select>
        <input
          className="admin-input max-w-48"
          placeholder="지역"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <input
          className="admin-input max-w-48"
          placeholder="지점명"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <button
          className="rounded-xl bg-amber px-4 py-2 text-night"
          onClick={() => setKeyword({ address, name })}
        >
          검색
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map(store => (
          <div key={store.id} className="rounded-3xl border border-white/10 bg-panel">
            <button className="flex w-full items-center justify-between px-5 py-4" onClick={() => setSelected(store)}>
              <span>
                {store.name}
                <span className="ml-2 text-xs text-muted">{store.type}</span>
              </span>
              <span className="text-xs text-muted">{store.address}</span>
            </button>
            {selected?.id === store.id && (
              <div className="border-t border-white/10 p-5">
                {images.data?.length ? (
                  <div className="mb-4 h-40 overflow-hidden rounded-2xl">
                    <ImageSwiper urls={images.data} />
                  </div>
                ) : null}
                {images.data?.map(url => (
                  <button
                    key={url}
                    className="mr-2 mb-3 text-xs text-danger"
                    onClick={async () => {
                      await deleteStoreImage(url);
                      images.refetch();
                    }}
                  >
                    사진 삭제
                  </button>
                ))}
                <StoreEditor
                  key={store.id}
                  initial={store}
                  submitLabel="수정"
                  onSubmit={async (input, files) => {
                    await updateStore(store.id, input);
                    const { uploadStoreImages } = await import("@/lib/firebase/images");
                    if (files.length) await uploadStoreImages(store.id, files);
                    queryClient.invalidateQueries({ queryKey: ["stores"] });
                    setSelected(null);
                  }}
                />
                <button
                  className="mt-3 text-sm text-danger"
                  onClick={async () => {
                    if (!confirm("이 매장을 삭제할까요?")) return;
                    await deleteStoreFolder(store.id);
                    await deleteStore(store.id);
                    queryClient.invalidateQueries({ queryKey: ["stores"] });
                    setSelected(null);
                    toast.success("삭제했습니다.");
                  }}
                >
                  매장 삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
