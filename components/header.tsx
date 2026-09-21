"use client";

import { FILTERS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore, type CafeFilter } from "@/store/ui-store";
import { useSelectedStore } from "@/store/selected-store";
import { toast } from "sonner";
import Link from "next/link";

export const Header = () => {
  const { user, isAdmin, login, logout } = useAuth();
  const { filter, setFilter, openIntro, panelOpen, setPanelOpen } = useUiStore();
  const { reset } = useSelectedStore();

  const handleFilter = (next: CafeFilter) => {
    if (next === "즐겨찾기" && !user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    setFilter(next);
  };

  return (
    <header className="relative z-30 flex h-14 items-center gap-3 border-b border-white/10 bg-night/90 px-3 backdrop-blur-xl sm:h-16 sm:px-5">
      <button
        className="mr-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-amber sm:hidden"
        onClick={() => setPanelOpen(!panelOpen)}
        aria-label="패널 열기"
      >
        <span className="text-lg">☰</span>
      </button>

      <button
        className="flex items-center gap-2"
        onClick={() => {
          reset();
          openIntro();
        }}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber text-night shadow-[0_0_20px_rgba(232,184,109,0.35)]">
          ✦
        </span>
        <div className="text-left leading-tight">
          <p className="font-semibold tracking-tight">새벽 감성</p>
          <p className="hidden text-[11px] text-muted sm:block">24시 카페 지도</p>
        </div>
      </button>

      <nav className="ml-4 hidden items-center gap-1 sm:flex">
        {FILTERS.map(item => (
          <button
            key={item}
            onClick={() => handleFilter(item)}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              filter === item ? "bg-amber text-night font-semibold" : "text-muted hover:bg-white/5 hover:text-mist"
            }`}
          >
            {item === "일반" ? "일반카페" : item === "무인" ? "무인카페" : item}
          </button>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {isAdmin && (
          <Link
            href="/admin"
            className="hidden rounded-full border border-amber/30 px-3 py-1.5 text-xs text-amber sm:inline"
          >
            어드민
          </Link>
        )}
        {user ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-panel-2 px-2 py-1 text-sm"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-bold text-night">
              {user.name.slice(0, 1)}
            </span>
            <span className="hidden max-w-[90px] truncate sm:inline">{user.name}</span>
          </button>
        ) : (
          <button
            onClick={login}
            className="rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-night hover:bg-white"
          >
            로그인
          </button>
        )}
      </div>
    </header>
  );
};
