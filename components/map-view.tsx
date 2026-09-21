"use client";

import { useEffect, useRef, useState } from "react";
import { IoMdRefresh } from "react-icons/io";
import { TbCurrentLocation } from "react-icons/tb";
import { isNaverConfigured, naverClientId } from "@/lib/config";
import { getStoreImages } from "@/lib/firebase/images";
import { useStores } from "@/hooks/use-stores";
import { useSelectedStore } from "@/store/selected-store";
import { useUiStore } from "@/store/ui-store";
import { useUserStore } from "@/store/user-store";
import type { Store } from "@/types/models";
import type { NaverMap, NaverMarker } from "@/types/naver";

const DEFAULT = { latitude: 37.497952, longitude: 127.027619 };

export const MapView = () => {
  const mapRef = useRef<NaverMap | null>(null);
  const markersRef = useRef<NaverMarker[]>([]);
  const clickMarkerRef = useRef<NaverMarker | null>(null);
  const currentMarkerRef = useRef<NaverMarker | null>(null);
  const [ready, setReady] = useState(false);
  const [research, setResearch] = useState(false);
  const [zoom, setZoom] = useState(14);
  const [, setMyLocation] = useState(DEFAULT);
  const { stores, isLoading } = useStores();
  const { filter, reportPinActive, setReportPin, openDetail } = useUiStore();
  const { setStore, setImages, reset } = useSelectedStore();
  const { user } = useUserStore();

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      position =>
        setMyLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => undefined,
    );
  }, []);

  useEffect(() => {
    if (!isNaverConfigured) return;
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${naverClientId}`;
    script.onload = () => {
      if (!window.naver || mapRef.current) {
        setReady(true);
        return;
      }
      mapRef.current = new window.naver.maps.Map("map", {
        center: new window.naver.maps.LatLng(DEFAULT.latitude, DEFAULT.longitude),
        zoom: 14,
        mapDataControl: false,
        scaleControl: false,
        mapTypeControl: false,
      });
      setReady(true);
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !window.naver) return;
    const naver = window.naver;
    const map = mapRef.current;
    setResearch(false);
    markersRef.current.forEach(marker => marker.setVisible(!reportPinActive));

    if (!clickMarkerRef.current) {
      clickMarkerRef.current = new naver.maps.Marker({
        position: map.getCenter(),
        map,
        visible: false,
        icon: {
          content: `<div class="report-pin"></div>`,
          size: new naver.maps.Size(18, 18),
          anchor: new naver.maps.Point(9, 16),
        },
      });
    } else {
      clickMarkerRef.current.setVisible(false);
    }

    const drag = naver.maps.Event.addListener(map, "dragend", () => {
      if (!reportPinActive) setResearch(true);
    });
    const click = naver.maps.Event.addListener(map, "click", (event: unknown) => {
      if (!reportPinActive) return;
      const coord = (event as { coord: { _lat: number; _lng: number } }).coord;
      clickMarkerRef.current?.setVisible(true);
      clickMarkerRef.current?.setPosition(new naver.maps.LatLng(coord._lat, coord._lng));
      setReportPin({ latitude: coord._lat, longitude: coord._lng });
    });
    const zoomListener = naver.maps.Event.addListener(map, "zoom_changed", () => {
      setZoom(map.getZoom());
    });

    return () => {
      window.naver?.maps.Event.removeListener(drag);
      window.naver?.maps.Event.removeListener(click);
      window.naver?.maps.Event.removeListener(zoomListener);
    };
  }, [ready, reportPinActive, setReportPin]);

  useEffect(() => {
    if (!mapRef.current || !window.naver || isLoading) return;
    const map = mapRef.current;
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    const bounds = map.getBounds();
    let visible = stores.filter(
      store =>
        store.latitude < bounds._max._lat &&
        store.latitude > bounds._min._lat &&
        store.longitude > bounds._min._lng &&
        store.longitude < bounds._max._lng,
    );
    if (filter === "즐겨찾기") {
      visible = visible.filter(store => user?.favorites.includes(store.id));
    } else if (filter !== "전체") {
      visible = visible.filter(store => store.type === filter);
    }

    visible.forEach(store => {
      const options: Record<string, unknown> = {
        position: new window.naver!.maps.LatLng(store.latitude, store.longitude),
        map,
        data: store,
      };
      if (zoom > 12) {
        options.icon = {
          content: `<div class="marker-chip">${store.name}</div>`,
          size: new window.naver!.maps.Size(120, 36),
          anchor: new window.naver!.maps.Point(20, 36),
        };
      }
      const marker = new window.naver!.maps.Marker(options) as NaverMarker;
      marker.data = store;
      window.naver!.maps.Event.addListener(marker, "click", async () => {
        reset();
        setStore(store);
        openDetail();
        const photos = await getStoreImages(store.id);
        setImages(photos);
      });
      markersRef.current.push(marker);
    });
    setResearch(false);
  }, [stores, filter, zoom, isLoading, user, ready, openDetail, reset, setImages, setStore]);

  const goCurrent = () => {
    if (!mapRef.current || !window.naver) return;
    navigator.geolocation?.getCurrentPosition(position => {
      const next = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setMyLocation(next);
      const latlng = new window.naver!.maps.LatLng(next.latitude, next.longitude);
      mapRef.current?.panTo(latlng);
      currentMarkerRef.current?.setMap(null);
      currentMarkerRef.current = new window.naver!.maps.Marker({
        position: latlng,
        map: mapRef.current,
        icon: {
          content: `<div class="current-dot"></div>`,
          size: new window.naver!.maps.Size(16, 16),
          anchor: new window.naver!.maps.Point(8, 8),
        },
      });
    });
  };

  const handleSelectFromList = async (store: Store) => {
    setStore(store);
    openDetail();
    if (mapRef.current && window.naver) {
      mapRef.current.panTo(new window.naver.maps.LatLng(store.latitude, store.longitude));
    }
    const photos = await getStoreImages(store.id);
    setImages(photos);
  };

  return (
    <div className="relative h-[calc(var(--vh)*100-56px)] sm:h-[calc(var(--vh)*100-64px)]">
      <div id="map" className="h-full w-full bg-night" />
      {!isNaverConfigured && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#243056,transparent_45%),linear-gradient(180deg,#0b1020,#151b2e)]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-amber">지도를 준비하는 중</p>
            <p className="max-w-sm text-sm text-muted">
              네이버맵 키가 없으면 미리보기 목록으로 매장을 볼 수 있습니다. `.env.local`에 키를 넣으면 실제 지도가
              열립니다.
            </p>
            <div className="mt-4 grid w-full max-w-md gap-2">
              {stores.map(store => (
                <button
                  key={store.id}
                  onClick={() => handleSelectFromList(store)}
                  className="rounded-2xl border border-white/10 bg-panel/80 px-4 py-3 text-left"
                >
                  <p className="font-medium">{store.name}</p>
                  <p className="text-xs text-muted">
                    {store.type} · {store.address}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {research && (
        <button
          onClick={() => setZoom(mapRef.current?.getZoom() ?? 14)}
          className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-panel px-4 py-2 text-sm shadow-lg"
        >
          <IoMdRefresh /> 이 지역 재검색
        </button>
      )}

      <button
        onClick={goCurrent}
        className="absolute right-3 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-panel shadow-lg sm:right-5 bottom-[290px] sm:bottom-24"
        aria-label="현재 위치"
      >
        <TbCurrentLocation />
      </button>
    </div>
  );
};
