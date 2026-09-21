"use client";

import { useEffect } from "react";
import { BottomSheet, SidePanel } from "@/components/panels";
import { Header } from "@/components/header";
import { MapView } from "@/components/map-view";
import { MobileFilters } from "@/components/mobile-filters";
import { ReportButton } from "@/components/report-button";
import { isFirebaseConfigured, isNaverConfigured } from "@/lib/config";

export default function HomePage() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div className="relative overflow-hidden bg-night">
      <Header />
      <div className="relative">
        <MobileFilters />
        <SidePanel />
        <MapView />
        <BottomSheet />
        <ReportButton />
      </div>
      {(!isFirebaseConfigured || !isNaverConfigured) && (
        <div className="pointer-events-none absolute top-20 right-3 z-30 hidden rounded-full border border-amber/30 bg-night/80 px-3 py-1 text-[11px] text-amber sm:block">
          {isFirebaseConfigured ? "네이버맵 키 대기" : "미리보기 데이터"}
        </div>
      )}
    </div>
  );
}
