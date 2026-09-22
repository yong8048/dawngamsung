"use client";

import { FILTERS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore, type CafeFilter } from "@/store/ui-store";
import { toast } from "sonner";

export const MobileFilters = () => {
  const { user } = useAuth();
  const { filter, setFilter } = useUiStore();

  const handleFilter = (next: CafeFilter) => {
    if (next === "즐겨찾기" && !user) {
      toast.error("로그인이 필요합니다.");
      return;
    }
    setFilter(next);
  };

  return (
    <div className="absolute top-3 left-3 right-16 z-20 flex gap-2 overflow-x-auto sm:hidden">
      {FILTERS.map(item => (
        <button
          key={item}
          onClick={() => handleFilter(item)}
          className={`shrink-0 rounded-full px-3 py-1 text-xs shadow-lg ${
            filter === item ? "bg-amber text-night font-semibold" : "bg-panel text-mist border border-line"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
